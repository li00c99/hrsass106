<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="tree-card">
        <!-- 组织架构页面 -->
        <el-row>
          <el-col>
            <el-tabs v-model="activeName">
              <el-tab-pane label="组织架构" name="first"></el-tab-pane>
            </el-tabs>
          </el-col>
        </el-row>
        <tree-tools :tree-node="company" :is-root="false" @addDepts="addDepts" />
        <el-tree
          icon-class="el-icon-circle-plus-outline"
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 传入内容 插槽内容 会循环多次 有多少节点 就循环多少次 -->
          <!-- 作用域插槽 slot-scope="obj" 接收传递给插槽的数据   data 每个节点的数据对象-->
          <tree-tools
            @delDepts="getments"
            @addDepts="addDepts"
            @editDepts="editDepts"
            slot-scope="{ data }"
            :tree-node="data"
          />
        </el-tree>
      </el-card>
      <!-- 添加弹层 -->
      <AddDept ref="addDept" :show-dialog.sync="showDialog" :node="node" @addDepts="getments"></AddDept>
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import AddDept from './components/add-dept'

import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data () {
    return {
      activeName: 'first',
      departs: [],
      company: { name: 'YHBC科技有限公司', manager: '负责人', id: '' },
      defaultProps: { label: 'label' },
      showDialog: false, // 显示窗体
      node: null
    }
  },
  created () {
    this.getments()
  },
  methods: {
    async getments () {
      try {
        const result = await getDepartments()
        this.departs = tranListToTreeData(result.depts, '')
      } catch (err) {
        console.log(err)
      }
    },
    // 添加
    addDepts (node) {
      this.showDialog = true
      this.node = node
    },
    // 编辑
    editDepts (node) {
      this.showDialog = true
      this.node = node
      // 调用子组件的方法实现回写
      this.$refs.addDept.getDepartment(node.id)
    }
  }
}
</script>

<style>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
.el-col-24 {
  text-align: end;
}
.el-icon-user:before {
  content: "\e6e3";
  padding-right: 5px;
}
</style>
