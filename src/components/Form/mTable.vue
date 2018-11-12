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
        width="55">
      </el-table-column>
      <el-table-column
        :label="$t('mTable.date')"
        width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('mTable.title')"
        width="150">
      </el-table-column>
      <el-table-column
        prop="address"
        :label="$t('mTable.desc')"
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
      background
      layout="prev, pager, next"
      :total="1000">
    </el-pagination>
  </div>
</template>

<script>
  export default {
    name: "mTable",
    data() {
      return {
        tableData: [
          {
          id:1,
          date: '2016-05-03',
          status: 'normal',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          looked: 1
        }, {
          id:2,
          date: '2016-05-02',
          status: 'disabled',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          looked: 1
        }, {
          id:3,
          date: '2016-05-04',
          status: 'normal',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          looked: 1
        }, {
          id:4,
          date: '2016-05-01',
          status: 'normal',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          looked: 1
        }, {
          id:5,
          date: '2016-05-08',
          status: 'normal',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          looked: 1
        }, {
          date: '2016-05-06',
          status: 'normal',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          looked: 1
        }, {
          id:6,
          date: '2016-05-07',
          status: 'normal',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
          looked: 1
        }
        ],
        multipleSelection: []
      }
    },
    methods: {
      filterTag(value, row) {
        return row.status === value;
      },
      handleEdit(index, row) {
        console.log(index, row);
      },
      handleDelete(index, row) {
        this.$emit('handleDelete',row);
      },
      handleSelect(selection){
        this.$emit('handleSelect',selection);
      }
    },
    watch:{}
  }
</script>

<style scoped lang="scss">

</style>
