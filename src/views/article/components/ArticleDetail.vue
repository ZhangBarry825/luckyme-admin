<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" class="form-container">

      <sticky :class-name="'sub-navbar '+postForm.art_status">
        <!--<CommentDropdown v-model="postForm.comment_disabled" />-->
        <!--<PlatformDropdown v-model="postForm.platforms" />-->
        <!--<SourceUrlDropdown v-model="postForm.source_uri" />-->
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">
          {{ $t('articleDetail.publish') }}
        </el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">{{ $t('articleDetail.draft') }}</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>

          <!--<Warning />-->

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                {{ $t('articleDetail.title') }}
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="10">
                  <el-form-item
                    :label="$t('articleDetail.type')+':'"
                    label-width="105px"
                    class="postInfo-container-item">
                    <el-select v-model="postForm.type" @change="changeType"  :placeholder="$t('articleDetail.select')">
                      <el-option v-for="item in typeList" v-if="lang === 'zh'" :label="item.cn_name" :key="item.name" :value="item.name"/>
                      <el-option v-for="item in typeList" v-if="lang === 'en'" :label="item.en_name" :key="item.name" :value="item.name"/>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="10">
                  <el-form-item
                    :label="$t('articleDetail.createTime')+':'"
                    label-width="105px"
                    class="postInfo-container-item">
                    <el-date-picker
                      v-model="postForm.display_time"
                      :placeholder="$t('articleDetail.selectDate')"
                      type="datetime"
                      value-format="timestamp"
                      format="yyyy-MM-dd HH:mm:ss"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="7">
                  <el-form-item
                    :label="$t('articleDetail.status')+':'"
                    label-width="105px"
                    class="postInfo-container-item">
                    <el-switch
                      v-model="postForm.status"
                      :active-text="$t('articleDetail.disabled')"
                      :inactive-text="$t('articleDetail.normal')"
                      active-color="#ff4949"
                      inactive-color="#13ce66"
                      active-value="disabled"
                      inactive-value="normal"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item :label="$t('articleDetail.description')+':'" style="margin-bottom: 40px;" label-width="105px">
          <el-input
            :rows="1"
            v-model="postForm.description"
            :placeholder="$t('articleDetail.inputPlease')"
            type="textarea"
            class="article-textarea"
            autosize/>
          <span
            v-show="contentShortLength"
            :class="{wordCounter:true, red:wordsOver}">{{ contentShortLength }} {{ $t('articleDetail.word') }}</span>
        </el-form-item>

        <div class="editor-container">
          <Tinymce ref="editor" :height="400" v-model="postForm.content"/>
        </div>

        <div style="margin-bottom: 20px;">
          <Upload v-model="postForm.cover" @input="uploadCover"/>
        </div>
      </div>
    </el-form>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/singleImage3'
import MDinput from '@/components/MDinput'
import Sticky from '@/components/Sticky' // 粘性header组件
import { validateURL } from '@/utils/validate'
import { fetchArticle, mCreateArticle, mCreateDraft, mUpdateArticle, mFetchArticle, mFetchDraft, mTypeList } from '@/api/article'
import { userSearch } from '@/api/remoteSearch'
import Warning from './Warning'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
  status: 'normal',
  art_status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  description: '', // 文章摘要
  source_uri: '', // 文章外链
  cover: '', // 文章封面
  display_time: '', // 前台展示时间
  type: '', // 文章类型
  id: undefined,
  platforms: ['a-platform'],
  comment_disabled: false,
  importance: 0
}

export default {
  name: 'ArticleDetail',
  components: { Tinymce, MDinput, Upload, Sticky, Warning, CommentDropdown, PlatformDropdown, SourceUrlDropdown },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      wordsOver: true,
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      tempRoute: {},
      typeList: []
    }
  },
  computed: {
    contentShortLength() {
      if (this.postForm.description.length > 300) {
        this.wordsOver = true
      } else {
        this.wordsOver = false
      }
      return this.postForm.description.length
    },
    lang() {
      return this.$store.getters.language
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.query && this.$route.query.id
      const type = this.$route.query && this.$route.query.type
      this.fetchData(id, type)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
    this.tempRoute = Object.assign({}, this.$route)
  },
  mounted() {
    const data = {
      all: true,
      page_num: 1,
      page_size: 10
    }
    mTypeList(data).then((response) => {
      console.log(response.data)
      if (response.code == 200) {
        this.typeList = response.data.types
      }
    }).catch((err) => {})
  },
  methods: {
    changeType(val){
      console.log(this.postForm.type)
      // this.postForm.type=val
    },
    uploadCover(data) {
      console.log(data, 'cover')
    },
    fetchData(id, type) {
      if (type == 'article') {
        const data = {
          id: id
        }
        mFetchArticle(data).then(response => {
          console.log(response.data, 111)
          this.postForm.id = response.data.id,
          this.postForm.title = response.data.title,
          this.postForm.type = response.data.type,
          this.postForm.status = response.data.status,
          this.postForm.display_time = Date.parse(response.data.update_time),
          this.postForm.description = response.data.description,
          this.postForm.content = response.data.content,
          this.postForm.cover = response.data.cover
          this.postForm.is_draft = response.data.is_draft
          // Set tagsview title
          // this.setTagsViewTitle()
        }).catch(err => {
          console.log(err)
        })
      }
      if (type == 'draft') {
        const data = {
          id: id
        }
        mFetchDraft(data).then(response => {
          console.log(response.data, 111)
          this.postForm.id = response.data.id,
          this.postForm.title = response.data.title,
          this.postForm.type = response.data.type,
          this.postForm.status = response.data.status,
          this.postForm.display_time = Date.parse(response.data.update_time),
          this.postForm.description = response.data.description,
          this.postForm.content = response.data.content,
          this.postForm.cover = response.data.cover
          this.postForm.is_draft = response.data.is_draft
          // Set tagsview title
          // this.setTagsViewTitle()
        }).catch(err => {
          console.log(err)
        })
      }
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    validateItem() {
      if (this.postForm.title.length === 0) {
        this.$message({
          message: this.$t('articleDetail.typeTitle'),
          type: 'warning'
        })
        return false
      } else if (this.postForm.type === undefined || this.postForm.type === '') {
        this.$message({
          message: this.$t('articleDetail.typeType'),
          type: 'warning'
        })
        return false
      } else if (this.postForm.display_time.length === 0) {
        this.$message({
          message: this.$t('articleDetail.typeCreateTime'),
          type: 'warning'
        })
        return false
      } else if (this.wordsOver) {
        this.$message({
          message: this.$t('articleDetail.wordsOver'),
          type: 'warning'
        })
        return false
      } else if (this.postForm.description.length === 0 || this.postForm.content.length === 0) {
        this.$message({
          message: this.$t('articleDetail.typeContent'),
          type: 'warning'
        })
        return false
      } else {
        return true
      }
    },
    submitForm() {
      let display_time = ''
      if (this.postForm.display_time > 1000000000000) {
        display_time = parseInt(this.postForm.display_time / 1000)
      }
      if (!this.validateItem()) {
        return
      }
      console.log(this.postForm)

      const artToSubmit = {
        title: this.postForm.title,
        type: this.postForm.type,
        status: this.postForm.status,
        update_time: display_time,
        description: this.postForm.description,
        content: this.postForm.content,
        cover: this.postForm.cover
      }
      if (this.isEdit) {
        artToSubmit.id = this.postForm.id
        this.loading = true
        mUpdateArticle(artToSubmit).then((response) => {
          console.log(response)
          if (response.code == 200) {
            this.$notify({
              title: this.$t('articleDetail.success'),
              message: this.$t('articleDetail.publishSuccess'),
              type: 'success',
              duration: 2000
            })
            this.postForm.art_status = 'published'
            this.loading = false
          }
        }).catch((err) => {
          this.loading = false
        })
      } else {
        this.loading = true
        artToSubmit.create_time = display_time
        mCreateArticle(artToSubmit).then((response) => {
          console.log(response)
          if (response.code == 200) {
            this.$notify({
              title: this.$t('articleDetail.success'),
              message: this.$t('articleDetail.publishSuccess'),
              type: 'success',
              duration: 2000
            })
            this.postForm.art_status = 'published'
            this.loading = false
          }
        }).catch((err) => {
          this.loading = false
        })
      }
    },
    draftForm() {
      let display_time = ''
      if (this.postForm.display_time > 1000000000000) {
        display_time = parseInt(this.postForm.display_time / 1000)
      }
      if (!this.validateItem()) {
        return
      }
      console.log(this.postForm)
      const artToSubmit = {
        title: this.postForm.title,
        type: this.postForm.type,
        status: this.postForm.status,
        create_time: display_time,
        update_time: display_time,
        description: this.postForm.description,
        content: this.postForm.content,
        cover: this.postForm.cover
      }
      if (this.isEdit) {
        if (this.postForm.is_draft == 1) {
          artToSubmit.id == this.postForm.id
        }
      }
      this.loading = true
      mCreateDraft(artToSubmit).then((response) => {
        console.log(response)
        if (response.code == 200) {
          this.$notify({
            title: this.$t('articleDetail.success'),
            message: this.$t('articleDetail.draftSuccess'),
            type: 'success',
            duration: 2000
          })
          this.postForm.art_status = 'draft'
          this.loading = false
        }
      }).catch((err) => {
        console.log(err, 123123)
        this.loading = false
      })
    },
    getRemoteUserList(query) {
      userSearch(query).then(response => {
        if (!response.data.items) return
        this.userListOptions = response.data.items.map(v => v.name)
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";

  .createPost-container {
    position: relative;

    .createPost-main-container {
      padding: 40px 45px 20px 50px;

      .postInfo-container {
        position: relative;
        @include clearfix;
        margin-bottom: 10px;

        .postInfo-container-item {
          float: left;
        }
      }

      .editor-container {
        min-height: 500px;
        margin: 0 0 30px;

        .editor-upload-btn-container {
          text-align: right;
          margin-right: 10px;

          .editor-upload-btn {
            display: inline-block;
          }
        }
      }
    }
    .wordCounter {
      width: 100px;
      position: relative;
      float: right;
      left: 30px;
    }
    .red{
      color:red;
    }
  }
</style>
