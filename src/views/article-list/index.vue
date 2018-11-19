<template>
  <div class="content-mytype">
    <mConsole @handleCreate="handleCreate" @handleDelete="consoleDelete" @handleSearch="handleSearch" ></mConsole>
    <mTable @handleDelete="tableDelete" @handleSelect="handleSelect" @handleEdit="handleEdit" @pageChange="tableLoad" :tableData="tableData" :allNum="allNum" :isLoading="isLoading" ></mTable>
  </div>
</template>

<script>
  import mTable from '@/components/Form/mTable.vue'
  import mConsole from '@/components/Form/mConsole.vue'
  import {mFetchList,mDeleteArticle} from "@/api/article";
  import {scrollToTop} from "@/utils/mMethods";
  export default {
    name: "ArticleList",
    data(){
      return{
        selection:[],
        tableData:[],
        allNum:0,
        nowNum:1,
        isLoading:false
      }
    },
    components:{ mTable,mConsole },
    methods:{
      handleCreate(){
        console.log('create')
      },
      handleEdit(row){
        console.log(row)
      },
      handleSearch(searchKey){
        console.log(searchKey)
      },
      handleSelect(selection){
        this.selection=selection
      },
      consoleDelete(){
        if(this.selection.length > 0){
          this.$confirm(this.$t('articleList.ifDelete'), this.$t('articleList.tip'), {
            confirmButtonText: this.$t('articleList.continue'),
            cancelButtonText: this.$t('articleList.cancel'),
            type: 'warning'
          }).then(() => {
            let toDeleteID=[]
            for(let i = 0 ;i<this.selection.length ;i++){
              toDeleteID.push(this.selection[i].id)
            }
            let mData={
              id:'['+toDeleteID.join(',')+']'
            }
            mDeleteArticle(mData).then((response)=>{
              this.$message({
                type: 'success',
                message: this.$t('articleList.deleteSucc')
              });
              // this.tableLoad(this.nowNum)
              console.log(mData)
            })
          }).catch(() => {});
        }else {
          this.$message({
            message: this.$t('articleList.atLeast'),
          });
        }
      },
      tableDelete(data){
        this.$confirm(this.$t('articleList.ifDelete'), this.$t('articleList.tip'), {
          confirmButtonText: this.$t('articleList.continue'),
          cancelButtonText: this.$t('articleList.cancel'),
          type: 'warning'
        }).then(() => {
          let mData={
            id:data.id
          }
          mDeleteArticle(mData).then((response)=>{
            this.$message({
              type: 'success',
              message: this.$t('articleList.deleteSucc')
            });
            this.tableLoad(this.nowNum)
          })
        }).catch(() => {});
      },
      tableLoad(page_num =1,page_size=10){
        var data={
          page_num:page_num,
          page_size:page_size,
        }
        this.isLoading=true
        mFetchList(data).then((response)=> {
          if(response.data.total || page_num == 1){
            this.isLoading=false
            this.allNum=response.data.total
            this.tableData=response.data.articles
            this.nowNum=page_num
            scrollToTop()
          }else {
            this.nowNum=page_num-1
            this.tableLoad(this.nowNum)
          }

        })
      }
    },
    mounted(){
      this.tableLoad()
    }
  }
</script>

<style scoped lang="scss">
  .content-mytype{
    padding: 0 10px;
    box-sizing: border-box;
  }
</style>
