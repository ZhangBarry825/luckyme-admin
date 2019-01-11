<template>
  <div class="content">
    <mConsole
      :article-type="articleType"
      :isSearch="false"
      :isDelete="true"
      :disableDelete="true"
      :disableNew="true"
      @handleCreate="handleCreate"
      @handleDelete="consoleDelete"
      @handleSearch="handleSearch"/>

    <el-table
      :data="tableData"
      tooltip-effect="dark"
      v-loading="isLoading"
      style="width: 100%;border:1px solid gainsboro"
      @selection-change="handleSelect"
    >
      <el-table-column
        type="selection"
        width="40"/>
      <el-table-column
        type="index"
        label="#"
        width="50"
        show-overflow-tooltip/>
      <el-table-column
        :label="$t('type.date')"
        width="180">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('type.cn_name')"
        width="180">
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.cn_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('type.en_name')"
        width="180">
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.en_name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('type.console')">
        <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              :disabled="true"
              @click="handleEdit(scope.$index, scope.row)"/>
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            :disabled="true"
            @click="handleDelete(scope.$index, scope.row)"/>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="$t('type.createType')" :visible.sync="dialogFormVisible" style="overflow: hidden">
      <el-form  ref="dataForm" label-position="left" label-width="70px"
               style="margin-left:50px;">
        <el-form-item  :label="$t('type.cn_name')" prop="cn_name" >
          <el-input v-model="postForm.cn_name"/>
        </el-form-item>
        <el-form-item  :label="$t('type.en_name')" prop="en_name" >
          <el-input v-model="postForm.en_name"/>
        </el-form-item>
        <div class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{ $t('type.cancel') }}</el-button>
          <el-button type="primary" @click="submitType">{{ $t('type.confirm') }}</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import mConsole from "@/components/Form/mConsole";
  import {mCreateType,mFetchTypeList,mDeleteType} from "@/api/type";

  export default {
    name: "TypeManage",
    data() {
      return {
        articleType: this.$t('route.type'),
        dialogFormVisible: false,
        postForm: {
          id:'',
          name:'',
          cn_name: '',
          en_name: '',
        },
        tableData: [{
          date: '2016-05-02',
          en_name: '王小虎',
          cn_name: 'Wang',
        },
        ],
        isLoading: false,
        selectedItems:[]
      }
    },
    components: {
      mConsole
    },
    methods: {
      handleCreate() {
        this.dialogFormVisible = true
      },
      submitType() {
        if (this.postForm.cn_name === '' || this.postForm.en_name === '') {
          this.$message({
            message: this.$t('type.warn'),
            type: 'warning'
          })
        }else {
          let data={
            en_name:this.postForm.en_name,
            cn_name:this.postForm.cn_name,
          }
          mCreateType(data).then((response) => {
            console.log(response)
            this.postForm={
              cn_name: '',
              en_name: '',
            }
            this.$message({
              message: this.$t('type.createSuccess'),
              type: 'success'
            })
            this.dialogFormVisible=false
            this.fetchData()
            setTimeout(()=>{
              location.reload()
            },1000)
          })
        }
      },
      consoleDelete(row){
        this.$confirm(this.$t('articleList.ifDelete'), this.$t('articleList.tip'), {
          confirmButtonText: this.$t('articleList.continue'),
          cancelButtonText: this.$t('articleList.cancel'),
          type: 'warning'
        }).then(() => {
          let data={
            id:this.selectedItems
          }
          mDeleteType(data).then((response) => {
            console.log(response)
            this.$message({
              type: 'success',
              message: this.$t('type.deleteSucc')
            })
            this.fetchData()
            this.selectedItems=[]
            setTimeout(()=>{
              location.reload()
            },1000)
          }).catch((err)=>{
          })
        }).catch(() => {
        })
      },
      handleSearch(){},

      fetchData(){
        this.isLoading=true
        let data={
          all:true,
          page_size:10,
          page_num:1
        }
        mFetchTypeList(data).then((response) => {
          console.log(response)
          for(let i =0;i<response.data.types.length;i++){
            response.data.types[i]['date']= response.data.types[i].update_time
          }
          this.tableData=response.data.types

          this.isLoading=false
          console.log(this.tableData,123123)
        }).catch((err)=>{
          this.isLoading=false
        })
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        this.$confirm(this.$t('articleList.ifDelete'), this.$t('articleList.tip'), {
          confirmButtonText: this.$t('articleList.continue'),
          cancelButtonText: this.$t('articleList.cancel'),
          type: 'warning'
        }).then(() => {
          let data={
            id:row.id
          }
          mDeleteType(data).then((response) => {
            console.log(response)
            this.$message({
              type: 'success',
              message: this.$t('articleList.deleteSucc')
            })
            this.fetchData()
            setTimeout(()=>{
              location.reload()
            },1000)
          }).catch((err)=>{
          })
        }).catch(() => {
        })
      },
      handleSelect(row){
        console.log(row)
        this.selectedItems=[]
        for(let i=0;i<row.length;i++){
          this.selectedItems.push(row[i]['id'])
        }
        console.log(this.selectedItems)
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
          this.articleType = '分类管理'
        }
        if (newVal === 'en') {
          this.articleType = 'Article Manage'
        }
      }
    },
    mounted(){
      this.fetchData()
    }

  }
</script>

<style scoped lang="scss">
  .content {
    padding: 0 10px;
    box-sizing: border-box;
  }
</style>
