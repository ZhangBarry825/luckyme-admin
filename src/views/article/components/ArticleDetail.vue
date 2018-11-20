<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">

      <sticky :class-name="'sub-navbar '+postForm.status">
        <!--<CommentDropdown v-model="postForm.comment_disabled" />-->
        <!--<PlatformDropdown v-model="postForm.platforms" />-->
        <!--<SourceUrlDropdown v-model="postForm.source_uri" />-->
        <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">{{$t('articleDetail.publish')}}</el-button>
        <el-button v-loading="loading" type="warning" @click="draftForm">{{$t('articleDetail.draft')}}</el-button>
      </sticky>

      <div class="createPost-main-container">
        <el-row>

          <!--<Warning />-->

          <el-col :span="24">
            <el-form-item style="margin-bottom: 40px;" prop="title">
              <MDinput v-model="postForm.title" :maxlength="100" name="name" required>
                {{$t('articleDetail.title')}}
              </MDinput>
            </el-form-item>

            <div class="postInfo-container">
              <el-row>
                <el-col :span="6">
                  <el-form-item label-width="100px" :label="$t('articleDetail.type')+':'" class="postInfo-container-item">
                    <el-select v-model="postForm.type" :placeholder="$t('articleDetail.select')">
                      <!--<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
                      <el-option   label="心路历程" value="心路历程"></el-option>
                      <el-option   label="情感世界" value="情感世界"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label-width="120px" :label="$t('articleDetail.createTime')+':'" class="postInfo-container-item">
                    <el-date-picker v-model="postForm.display_time" type="datetime" format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('articleDetail.selectDate')"/>
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label-width="60px" :label="$t('articleDetail.status')+':'" class="postInfo-container-item">
                    <el-switch
                      v-model="postForm.mStatus"
                      active-color="#ff4949"
                      inactive-color="#13ce66"
                      active-value="disabled"
                      inactive-value="normal"
                      :active-text="$t('articleDetail.disabled')"
                      :inactive-text="$t('articleDetail.normal')">
                    </el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-col>
        </el-row>

        <el-form-item  style="margin-bottom: 40px;"  label-width="100px"  :label="$t('articleDetail.description')+':'">
          <el-input :rows="1" v-model="postForm.content_short" type="textarea" class="article-textarea" autosize :placeholder="$t('articleDetail.inputPlease')"/>
          <span v-show="contentShortLength" class="word-counter">{{ contentShortLength }} {{$t('articleDetail.word')}}</span>
        </el-form-item>

        <div class="editor-container">
          <Tinymce ref="editor" :height="400" v-model="postForm.content" />
        </div>

        <div style="margin-bottom: 20px;">
          <Upload v-model="postForm.image_uri" />
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
import { fetchArticle } from '@/api/article'
import { userSearch } from '@/api/remoteSearch'
import Warning from './Warning'
import { CommentDropdown, PlatformDropdown, SourceUrlDropdown } from './Dropdown'

const defaultForm = {
  mstatus:'normal',
  status: 'draft',
  title: '', // 文章题目
  content: '', // 文章内容
  content_short: '', // 文章摘要
  source_uri: '', // 文章外链
  image_uri: '', // 文章图片
  display_time: undefined, // 前台展示时间
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
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        this.$message({
          message: rule.field + this.$t('articleDetail.must'),
          type: 'error'
        })
        callback(new Error(rule.field + this.$t('articleDetail.must')))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validateURL(value)) {
          callback()
        } else {
          this.$message({
            message: '外链url填写不正确',
            type: 'error'
          })
          callback(new Error('外链url填写不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: 'blur' }]
      },
      tempRoute: {}
    }
  },
  computed: {
    contentShortLength() {
      return this.postForm.content_short.length
    },
    lang() {
      return this.$store.getters.language
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
      this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }

    // Why need to make a copy of this.$route here?
    // Because if you enter this page and quickly switch tag, may be in the execution of the setTagsViewTitle function, this.$route is no longer pointing to the current page
    // https://github.com/PanJiaChen/vue-element-admin/issues/1221
    this.tempRoute = Object.assign({}, this.$route)
  },
  methods: {
    fetchData(id) {
      fetchArticle(id).then(response => {
        this.postForm = response.data
        // Just for test
        this.postForm.title += `   Article Id:${this.postForm.id}`
        this.postForm.content_short += `   Article Id:${this.postForm.id}`

        // Set tagsview title
        this.setTagsViewTitle()
      }).catch(err => {
        console.log(err)
      })
    },
    setTagsViewTitle() {
      const title = this.lang === 'zh' ? '编辑文章' : 'Edit Article'
      const route = Object.assign({}, this.tempRoute, { title: `${title}-${this.postForm.id}` })
      this.$store.dispatch('updateVisitedView', route)
    },
    submitForm() {
      this.postForm.display_time = parseInt(this.display_time / 1000)
      console.log(this.postForm)
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$notify({
            title: '成功',
            message: '发布文章成功',
            // title: this.$t('articleDetail.success'),
            // message:  this.$t('articleDetail.publishSuccess'),
            type: 'success',
            duration: 2000
          })
          this.postForm.status = 'published'
          this.loading = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    draftForm() {
      if (this.postForm.content.length === 0 || this.postForm.title.length === 0) {
        this.$message({
          message: '请填写必要的标题和内容',
          type: 'warning'
        })
        return
      }
      this.$message({
        message: '保存成功',
        type: 'success',
        showClose: true,
        duration: 1000
      })
      this.postForm.status = 'draft'
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
  .word-counter {
    width: 100px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
