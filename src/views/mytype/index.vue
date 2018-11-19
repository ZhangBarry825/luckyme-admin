<template>
  <div class="content-mytype">
    <mConsole @handleCreate="handleCreate" @handleDelete="consoleDelete" @handleSearch="handleSearch" ></mConsole>
    <mTable @handleDelete="tableDelete" @handleSelect="handleSelect" @handleEdit="handleEdit" @pageChange="pageChange" :tableData="tableData" :allNum="allNum"></mTable>
  </div>
</template>

<script>
  import mTable from '@/components/Form/mTable.vue'
  import mConsole from '@/components/Form/mConsole.vue'
  import {mFetchList} from "@/api/article";
  import {scrollToTop} from "@/utils/mMethods";
  export default {
    name: "MyType",
    data(){
      return{
        selection:[],
        tableData:[],
        allNum:0,
        nowNum:1
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
      consoleDelete(){
        console.log(this.selection)
      },
      handleSelect(selection){
        this.selection=selection
        console.log(this.selection)
      },
      tableDelete(data){
        console.log(data)
      },
      pageChange(page){
        this.nowNum=page
        var data={
          page_num:page,
          page_size:10,
        }
        mFetchList(data).then((response)=> {
          this.allNum=response.data.total
          this.tableData=response.data.articles
          scrollToTop()
        })
      },
    },
    mounted(){
      var data={
        page_num:1,
        page_size:10,
      }
      mFetchList(data).then((response)=> {
        this.allNum=response.data.total
        this.tableData=response.data.articles
        console.log(response.data.articles)
      })
    }
  }
</script>

<style scoped lang="scss">
  .content-mytype{
    padding: 0 10px;
    box-sizing: border-box;
  }
</style>
