<template>
  <div class="content-mytype">
    <mConsole :article-type="articleType" :isSearch="true" @handleCreate="handleCreate" @handleDelete="consoleDelete" @handleSearch="handleSearch"/>
    <mTable ref="mtable" :typeList="typeList" :table-data="tableData" :all-num="allNum" :is-loading="isLoading" @handleDelete="tableDelete" @handleSelect="handleSelect" @handleEdit="handleEdit" @pageChange="tableLoad" />
  </div>
</template>

<script>
import mTable from '@/components/Form/mTable.vue'
import mConsole from '@/components/Form/mConsole.vue'
import { mFetchDraftList, mDeleteDraft, mSearchDraft,mTypeList } from '@/api/article'
import { scrollToTop } from '@/utils/mMethods'
export default {
  name: 'Draft',
  components: { mTable, mConsole },
  data() {
    return {
      selection: [],
      tableData: [],
      allNum: 0,
      nowNum: 1,
      isLoading: false,
      articleType: this.$t('draft.title'),
      isSearch: false,
      searchKey: '',
      typeList:[]
    }
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
    this.tableLoad()
  },
  methods: {
    handleCreate() {
      this.$router.push({ path: '/article/create' })
    },
    handleEdit(row) {
      console.log(row)
      this.$router.push({ path: '/article/edit', query: { id: row.id, type: 'draft' }})
    },
    handleSearch(searchKey) {
      this.searchKey = searchKey
      this.$refs.mtable.refreshPage()
      if (searchKey) {
        this.isSearch = true
        this.tableLoad()
      } else {
        this.isSearch = false
        this.tableLoad()
      }
    },
    handleSelect(selection) {
      this.selection = selection
    },
    consoleDelete() {
      if (this.selection.length > 0) {
        this.$confirm(this.$t('articleList.ifDelete'), this.$t('articleList.tip'), {
          confirmButtonText: this.$t('articleList.continue'),
          cancelButtonText: this.$t('articleList.cancel'),
          type: 'warning'
        }).then(() => {
          const toDeleteID = []
          for (let i = 0; i < this.selection.length; i++) {
            toDeleteID.push(this.selection[i].id)
          }
          const mData = {
            id: '[' + toDeleteID.join(',') + ']'
          }
          mDeleteDraft(mData).then((response) => {
            this.$message({
              type: 'success',
              message: this.$t('articleList.deleteSucc')
            })
            this.tableLoad(this.nowNum)
          })
        }).catch(() => {})
      } else {
        this.$message({
          message: this.$t('articleList.atLeast')
        })
      }
    },
    tableDelete(data) {
      this.$confirm(this.$t('articleList.ifDelete'), this.$t('articleList.tip'), {
        confirmButtonText: this.$t('articleList.continue'),
        cancelButtonText: this.$t('articleList.cancel'),
        type: 'warning'
      }).then(() => {
        const mData = {
          id: data.id
        }
        mDeleteDraft(mData).then((response) => {
          this.$message({
            type: 'success',
            message: this.$t('articleList.deleteSucc')
          })
          this.tableLoad(this.nowNum)
        })
      }).catch(() => {})
    },
    tableLoad(page_num = 1, page_size = 10) {
      if (this.isSearch) {
        var data = {
          page_num: page_num,
          page_size: page_size,
          // type:type,
          key: this.searchKey
        }
      } else {
        var data = {
          page_num: page_num,
          page_size: page_size
          // type:type
        }
      }
      this.isLoading = true
      if (this.isSearch) {
        mSearchDraft(data).then((response) => {
          if (response.data.total || page_num == 1) {
            this.isLoading = false
            this.allNum = response.data.total
            this.tableData = response.data.articles
            this.nowNum = page_num
            scrollToTop()
          } else {
            this.nowNum = page_num - 1
            this.tableLoad(this.nowNum)
          }
        })
      } else {
        mFetchDraftList(data).then((response) => {
          if (response.data.total || page_num == 1) {
            this.isLoading = false
            this.allNum = response.data.total
            this.tableData = response.data.articles
            this.nowNum = page_num
            scrollToTop()
          } else {
            this.nowNum = page_num - 1
            this.tableLoad(this.nowNum)
          }
        })
      }
    }
  },
  computed: {
    lang() {
      return this.$store.getters.language
    }
  },
  watch: {
    lang(newVal, oldVal) {
      if (newVal === 'zh') {
        this.articleType='草稿箱'
      }
      if (newVal === 'en') {
        this.articleType='Draft List'
      }
    }
  },
}
</script>

<style scoped lang="scss">
  .content-mytype{
    padding: 0 10px;
    box-sizing: border-box;
  }
</style>
