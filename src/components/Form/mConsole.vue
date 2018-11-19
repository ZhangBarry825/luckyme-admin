<template>
  <div class="content-console">
    <el-button size="mini" type="primary" @click="newCreate" icon="el-icon-edit">{{$t('mConsole.newCreate')}}</el-button>
    <el-button size="mini" type="danger" style="margin-right: 20px;" @click="handleDelete" icon="el-icon-delete">{{$t('mConsole.delete')}}</el-button>
    <div class="searchInput">
      <el-input size="mini" style="position: relative;top: 1px;" v-model="searchKey" :placeholder="$t('mConsole.holdSpace')">
        <el-button slot="append"  icon="el-icon-search" @click="handSearch"></el-button>
      </el-input>
    </div>
    <slot></slot>
  </div>
</template>

<script>
  import elButton from 'element-ui'

  export default {
    name: "mConsole",
    comments: {elButton},
    data(){
      return{
        searchKey:''
      }
    },
    methods:{
      newCreate(){
        this.$emit('handleCreate')
      },
      handleDelete(){
        this.$emit('handleDelete')
      },
      handSearch(){
        this.$emit('handleSearch',this.searchKey)
      }
    }
  }
</script>

<style scoped lang="scss">
  .content-console {
    padding: 10px 0;
    .searchInput{
      display: inline-block;
      width: 200px;
      height: 30px;
      .el-input{
        height: 20px;
      }
    }
  }
</style>
