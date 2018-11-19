<template>
  <div class="content-table">
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%;border:1px solid gainsboro"
      @selection-change="handleSelect"
      >
      <el-table-column
        type="selection"
        width="40">
      </el-table-column>
      <el-table-column
        type="index"
        label="#"
        width="50"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        :label="$t('mTable.date')"
        width="200">
        <template slot-scope="scope">{{ scope.row.create_time }}</template>
      </el-table-column>
      <el-table-column
        prop="title"
        :label="$t('mTable.title')"
        min-width="150"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="description"
        :label="$t('mTable.desc')"
        min-width="200"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="looked"
        :label="$t('mTable.looked')"
        width="100"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="status"
        :label="$t('mTable.status')"
        width="100"
        :filters="[{ text: $t('mTable.normal'), value: 'normal' }, { text:  $t('mTable.disabled'), value: 'disabled' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 'normal' ? 'primary' : 'warning'"
            disable-transitions>{{scope.row.status === 'normal' ? $t('mTable.normal') :$t('mTable.disabled')}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('mTable.console')" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-edit"
            @click="handleEdit(scope.$index, scope.row)"></el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="page-wrap"
      background
      @current-change="pageChange"
      layout="prev, pager, next"
      :total="allNum">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "mTable",
    data() {
      return {
        multipleSelection: []
      }
    },
    props:{
      tableData:{
        type:Array,
        default:()=>  {
          return []
        }
      },
      allNum:{
        type:Number,
        default: ()=> {
          return 0
        }
      }
    },
    methods: {
      filterTag(value, row) {
        return row.status === value;
      },
      handleEdit(index, row) {
        this.$emit('handleEdit',row);
      },
      handleDelete(index, row) {
        this.$emit('handleDelete',row);
      },
      handleSelect(selection){
        this.$emit('handleSelect',selection);
      },
      pageChange(page){
        this.$emit('pageChange',page);
      }
    }
  }
</script>

<style scoped lang="scss">
.page-wrap{
  margin: 10px 0;
}
</style>
