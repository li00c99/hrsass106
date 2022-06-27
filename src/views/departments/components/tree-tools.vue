<template>
  <el-row
    class="rowlist"
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px;width: 100%"
  >
    <el-col :span="20">
      <span :class="treeNode.children ? '' : 'el-icon-user'">{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row :gutter="20" type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="handleCommand">
            <span>
              操作
              <i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-show="isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-show="isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { deleteDepartments } from '@/api/departments'
export default {
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleCommand (command) {
      // 添加
      if (command === 'add') {
        this.$emit('addDepts', this.treeNode)
      } else if (command === 'edit') {
        // 编辑
        this.$emit('editDepts', this.treeNode)
      } else {
        // 删除
        this.$confirm('确定删除部门吗').then(() => {
          return deleteDepartments(this.treeNode.id)
        }).then(() => {
          this.$emit('delDepts') // 触发自定义事件
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>

<style>
</style>

