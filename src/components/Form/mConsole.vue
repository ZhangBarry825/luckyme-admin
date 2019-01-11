<template>
  <div class="content-console">
    <div class="title-bar"><h2>{{articleType}}</h2></div>
    <el-button size="mini" type="primary" :disabled="disableNew" @click="newCreate" icon="el-icon-edit">{{$t('mConsole.newCreate')}}</el-button>
    <el-button v-if="isDelete" :disabled="disableDelete" size="mini" type="danger" style="margin-right: 20px;" @click="handleDelete" icon="el-icon-delete">{{$t('mConsole.delete')}}</el-button>
    <div class="searchInput" v-if="isSearch">
      <el-input size="mini" @keyup.enter.native="handSearch" style="position: relative;top: 1px;" v-model="searchKey" :placeholder="$t('mConsole.holdSpace')">
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
    props:{
      articleType:{
        type:String,
        default:()=>{
          return '文章类型'
        }
      },
      isSearch:{
        type:Boolean,
        default:()=>{
          return true
        }
      },
      isDelete:{
        type:Boolean,
        default:()=>{
          return true
        }
      },
      disableDelete:{
        type:Boolean,
        default:()=>{
          return false
        }
      },
      disableNew:{
        type:Boolean,
        default:()=>{
          return false
        }
      }
    },
    mounted(){
      console.log(this.isSearch,666)
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
    .title-bar{
      /*background-color: gainsboro;*/
      border-left: 5px solid gray;
      padding-left: 10px;
      margin: 10px 0;
      h2{
        padding: 3px 0;
        font-size: 16px;
        color: rgba(75,75,75,0.73);
        font-weight: normal;
      }
    }
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
