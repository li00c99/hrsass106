<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="textTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="ruleForm" :model="fromDate" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="fromDate.name" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="fromDate.code" style="width:80%" placeholder="1-50个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="fromDate.manager"
          style="width:80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <el-option v-for="item in staffList" :key="item.id" :label="item.username" :value="item.username"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="fromDate.introduce"
          style="width:80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btn">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getDepartments, addDepartments, getTments, editDepartment } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    node: {
      type: Object,
      default: null
    }
  },
  data () {
    const validateName = async (rule, value, callback) => {
      // 获取所有的部门数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.fromDate.id) {
        // 编辑状态下的验证逻辑是 名称不能和除自己外的一样
        isRepeat = depts.filter(item => item.id !== this.fromDate.id && item.pid === this.node.pid).some(item => item.name === value)
      } else {
        // 先找到该部门，再找部门下是否有相同名称的
        isRepeat = depts.filter(item => item.pid === this.node.id).some(item => item.name === value)
      }
      // 找到说明存在，效验不通过。没找到则通过
      isRepeat ? callback(new Error(`已经有${value}该名称的存在`)) : callback()
    }
    const valudateCode = async (rule, value, callback) => {
      // 获取所有的部门数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.fromDate.id) {
        isRepeat = depts.filter(item => item.id !== this.fromDate.id).some(item => item.code === value)
      } else {
        // 先找到该部门，再找部门下是否有相同名称的code
        isRepeat = depts.some(item => item.code === value)
      }
      // 找到说明存在，效验不通过。没找到则通过
      isRepeat ? callback(new Error(`已经有${value}该编码的存在`)) : callback()
    }
    return {
      fromDate: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
        // 员工列表
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' },
        { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' },
        { targger: 'bulr', validator: validateName }], // 部门名称
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' },
        { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' },
        { targger: 'bulr', validator: valudateCode }], // 部门编码
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }], // 部门管理者
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' },
        { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      },
      staffList: []
    }
  },
  computed: {
    textTitle () {
      if (this.fromDate.id) {
        return '编辑部门'
      } else {
        return '添加部门'
      }
    }
  },
  methods: {
    // 获取添加对话框里的员工列表
    async getEmployeeSimple () {
      this.staffList = await getEmployeeSimple()
    },
    // 获取单个部门
    async getDepartment (id) {
      this.fromDate = await getTments(id)
      console.log(this.fromDate)
    },
    // 确定添加/或者编辑
    btn () {
      this.$refs.ruleForm.validate(async isOk => {
        if (!isOk) return
        if (this.fromDate.id) {
          // 编辑
          await editDepartment(this.fromDate)
          console.log('编辑状态')
        } else {
          await addDepartments({ ...this.fromDate, pid: this.node.id })
        }
        this.$emit('addDepts')
        this.$emit('update:showDialog', false)
      })
    },
    // 取消重置
    btnCancel () {
      this.fromDate = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
        this.$refs.ruleForm.resetFields() // 重置校验字段
        this.$emit('update:showDialog', false) // 关闭
    }
  }
}
</script>
<style lang="stylus"></style>
