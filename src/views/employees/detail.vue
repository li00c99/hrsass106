<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登入账户设置">
            <el-form
              ref="form"
              :model="form"
              :rules="formRules"
              label-width="120px"
              style="margin-left:120px;margin-top:30px"
            >
              <el-form-item label="姓名" prop="username">
                <el-input v-model="form.username" style="width:400px"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password2">
                <el-input v-model="form.password2" style="width:400px" type="password"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUserInfo">更新</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <component :is="UserComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
            <component :is="jobComponent" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserDetailById } from '@/api/user'
import { saveUserDetailById } from '@/api/employees'
import UserInfo from './components/user-info'
import JobInfo from './components/job-info'
export default {
  components: {
    UserInfo,
    JobInfo
  },
  data () {
    return {
      UserComponent: 'user-info',
      jobComponent: 'job-info',
      activeName: 'first',
      form: {
        username: '',
        password2: ''
      },
      formRules: {
        username: [{ required: true, message: '姓名不能为空', trigger: 'bulr' }],
        password2: [{ required: true, message: '密码不能为空', trigger: 'bulr' },
        { min: 6, max: 10, message: '密码长度6-10位', trigger: 'bulr' }]
      },
      userId: this.$route.params.id
    }
  },
  created () {
    this.getUserDetailById()
  },
  methods: {
    async getUserDetailById () {
      this.form = await getUserDetailById(this.userId)
    },
    async saveUserInfo () {
      await saveUserDetailById({ ...this.form, password: this.form.password2 })
      this.$message.success('修改密码成功')
    }
  }

}
</script>

<style>
</style>