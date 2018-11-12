<template>
  <div class="content-mytype">
    <mConsole @handCreate="handCreate" @handleDelete="consoleDelete"></mConsole>
    <mTable @handleDelete="tableDelete" @handleSelect="handleSelect"></mTable>
  </div>
</template>

<script>
  import mTable from '@/components/Form/mTable.vue'
  import mConsole from '@/components/Form/mConsole.vue'
  export default {
    name: "MyType",
    components:{ mTable,mConsole },
    methods:{
      handCreate(){

      },
      consoleDelete(){

      },
      handleSelect(selection){
        console.log(selection)
      },
      tableDelete(data){
        console.log(data)
      }
    }
  }
</script>

<style scoped lang="scss">
  .content-mytype{
    padding: 0 10px;
    box-sizing: border-box;
  }
</style>
