<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="first">
            <!-- 新增角色 -->
            <el-row style="height:60px">
              <el-button
                icon="el-icon-plus"
                type="primary"
                size="mini"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <!-- 表格 -->
            <el-table :data="list" border center>
              <el-table-column align="center" type="index" label="序号" width="120"></el-table-column>
              <el-table-column align="center" prop="name" label="角色名" width="240"></el-table-column>
              <el-table-column align="center" prop="description" label="描述"></el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="{ row  }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editRole(row.id)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-row type="flex" justify="center" align="middle" style="height:60px">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="queryInfo.page"
                :page-size="queryInfo.pagesize"
                layout="prev, pager, next"
                :total="queryInfo.total"
              ></el-pagination>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息" name="second">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form :model="formData" label-width="120px" style="margin-top:50px">
              <el-form-item label="公司名称">
                <el-input v-model="formData.name" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width:400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width:400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 编辑新增弹层 -->
      <el-dialog :title="textTitle" :visible="showDialog" @close="btnCancel">
        <el-form ref="roleForm" :model="roleForm" :rules="orleRules" label-width="120px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="roleForm.name" />
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleForm.description" />
          </el-form-item>
        </el-form>
        <!-- 底部 -->
        <el-row slot="footer" type="flex" justify="center">
          <el-col :span="6">
            <el-button size="small" @click="btnCancel">取消</el-button>
            <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getRoleList, getCompany, deleteRole, getRoleDetail, updateRole, addRoleDate } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      activeName: 'first',
      queryInfo: {
        page: 1,
        pagesize: 3,
        total: 0
      },
      list: [],
      formData: {},
      showDialog: false,
      roleForm: {},
      orleRules: {
        name: [{ required: true, message: '不能为空', targger: 'blur' }]
      }
    }
  },
  created () {
    this.getRoList()
    this.getCompanylist()
  },
  computed: {
    ...mapGetters(['companyId']),
    textTitle () {
      return this.roleForm.id ? '编辑角色' : '添加角色'
    }
  },
  methods: {
    async getRoList () {
      // 解构获取数据
      const { total, rows } = await getRoleList(this.queryInfo)
      this.queryInfo.total = total
      this.list = rows
    },
    // 获取公司信息
    async getCompanylist () {
      this.formData = await getCompany(this.companyId)
    },
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.getRoList()
    },
    // 删除角色
    deleteRole (id) {
      // 是否确认删除
      this.$confirm('是否删除').then(async () => {
        // 删除
        await deleteRole(id)
        // 重新渲染界面
        this.getRoList()
        // 删除成功
        this.$message.success('删除角色成功')
      }).catch(() => {
        this.$message.error('取消了')
      })
    },
    async editRole (id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    btnOK () {
      this.$refs.roleForm.validate(async isOk => {
        if (!isOk) return
        // 根据id判断登入还是编辑状态
        if (this.roleForm.id) {
          await updateRole(this.roleForm)
          this.$message.success('修改成功')
        } else {
          await addRoleDate(this.roleForm)
          this.$message.success('添加成功')
        }
        // 编辑状态
        this.showDialog = false
        this.getRoList()
        window.localstorage
      })
    },
    btnCancel () {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    }
  }
}
</script>

<style>
</style>
