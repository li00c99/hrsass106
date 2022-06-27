<template>
  <el-dialog title="提示" :visible="showloding" width="50%" @close="btnCancel">
    <!-- 表单 -->
    <el-form ref="addEmployee" :model="formData" :rules="addFormdata" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:70%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:70%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:70%" placeholder="请选择">
          <!-- 遍历只能遍历组件的数据 -->
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:70%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width:70%"
          placeholder="请选择部门"
          @focus="getDepartments"
        />
        <el-tree
          icon-class="el-icon-user"
          v-if="showTree"
          :data="treeData"
          :props="{label:'name'}"
          @node-click="selectNode"
        ></el-tree>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button type="primary" size="small" @click="addbtn">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import { addEmployee } from '@/api/employees'
import { tranListToTreeData } from '@/utils'
import { getDepartments } from '@/api/departments'
export default {
  props: {
    showloding: {
      type: Boolean,
      dufault: false
    }
  },
  data () {
    return {
      EmployeeEnum,
      treeData: [],
      showTree: false,
      loading: false,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      addFormdata: {
        username: [{ required: true, message: '用户姓名不能为空', trigger: 'blur' },
        { min: 1, max: 4, message: '用户姓名1-4位' }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }],
        formOfEmployment: [{ required: true, message: '聘用形式不能为空', trigger: 'blur' }],
        workNumber: [{ required: true, message: '工号不能为空', trigger: 'blur' }],
        departmentName: [{ required: true, message: '部门不能为空', trigger: 'change' }],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      }
    }
  },
  methods: {
    async getDepartments () {
      this.showTree = true
      this.loading = true
      const { depts } = await getDepartments()
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    // 给部门赋值
    selectNode (node) {
      this.showTree = false,
        this.formData.departmentName = node.name
    },
    // 添加
    addbtn () {
      this.$refs.addEmployee.validate(async isOk => {
        if (!isOk) return
        await addEmployee(this.formData)
        // 调用父组件的方法
        this.$parent.$parent.getEmployList && this.$parent.$parent.getEmployList()
        this.$parent.$parent.showloding = false
        this.$refs.addEmployee.resetFields()
        // this.$emit('addupdate', false)
      })
    },
    btnCancel () {
      // 重置原来的数据
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addEmployee.resetFields() // 重置校验结果
      this.$emit('update:showloding', false)
    }
  }
}
</script>

<style>
</style>