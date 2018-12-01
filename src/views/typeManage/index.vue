<template>
  <div class="content">
    <mConsole
      :article-type="articleType"
      :isSearch="false"
      :isDelete="false"
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
              @click="handleEdit(scope.$index, scope.row)"/>
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"/>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="$t('type.createType')" :visible.sync="dialogFormVisible">
      <el-form  ref="dataForm" label-position="left" label-width="70px"
               style="width: 400px; margin-left:50px;">
        <el-form-item label-width="120px" :label="$t('type.cn_name')" prop="cn_name" >
          <el-input v-model="postForm.cn_name"/>
        </el-form-item>
        <el-form-item label-width="120px" :label="$t('type.en_name')" prop="en_name" >
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
        isLoading: false
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
          })
        }
      },
      consoleDelete(){},
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
          this.tableData=response.data.types
          this.isLoading=false
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
          }).catch((err)=>{
          })
        }).catch(() => {
        })
      },
      handleSelect(){}
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
