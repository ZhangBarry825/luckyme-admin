<template>
  <div class="content-table">
    <el-table
      v-loading="isLoading"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
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
        :label="$t('mTable.date')"
        width="200">
        <template slot-scope="scope">{{ scope.row.create_time }}</template>
      </el-table-column>
      <el-table-column
        :label="$t('mTable.title')"
        prop="title"
        min-width="150"
        show-overflow-tooltip/>
      <el-table-column
        :label="$t('mTable.desc')"
        prop="description"
        min-width="150"
        show-overflow-tooltip/>
      <el-table-column
        :label="$t('mTable.type')"
        prop="type"
        min-width="100"
        show-overflow-tooltip/>
      <el-table-column
        :label="$t('mTable.looked')"
        prop="looked"
        width="100"
        show-overflow-tooltip/>
      <el-table-column
        :label="$t('mTable.status')"
        :filters="[{ text: $t('mTable.normal'), value: 'normal' }, { text: $t('mTable.disabled'), value: 'disabled' }]"
        :filter-method="filterTag"
        prop="status"
        width="100"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 'normal' ? 'primary' : 'warning'"
            disable-transitions>{{ scope.row.status === 'normal' ? $t('mTable.normal') :$t('mTable.disabled') }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="$t('mTable.console')" width="150">
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
    <el-pagination
      :total="allNum"
      :current-page="currentPage"
      class="page-wrap"
      background
      layout="prev, pager, next"
      @current-change="pageChange"/>
  </div>
</template>

<script>
export default {
  name: 'MTable',
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    allNum: {
      type: Number,
      default: () => {
        return 0
      }
    },
    isLoading: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      multipleSelection: [],
      currentPage: 3
    }
  },
  methods: {
    refreshPage(page = 1) {
      this.currentPage = page
      console.log(this.currentPage)
    },
    filterTag(value, row) {
      return row.status === value
    },
    handleEdit(index, row) {
      this.$emit('handleEdit', row)
    },
    handleDelete(index, row) {
      this.$emit('handleDelete', row)
    },
    handleSelect(selection) {
      this.$emit('handleSelect', selection)
    },
    pageChange(page) {
      this.currentPage = page
      this.$emit('pageChange', page)
    }
  }
}
</script>

<style scoped lang="scss">
.page-wrap{
  margin: 10px 0;
}
</style>
