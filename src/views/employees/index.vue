<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{userInfo.total}}条记录</span>
        <template v-slot:after>
          <el-button size="mini" type="warning" @click="$router.push('/import')">导入</el-button>
          <el-button size="mini" type="danger" @click="exportData">导出</el-button>
          <el-button size="mini" type="primary" @click="showloding = true">新增</el-button>
        </template>
      </page-tools>

      <!-- 表格区域 -->
      <el-card>
        <el-table :data="list" border>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column label="头像" width="120px">
            <template slot-scope="{row}">
              <img
                slot="reference"
                v-imagerror="require('@/assets/common/tx.jpg')"
                :src="row.staffPhoto"
                @click="showQrCode(row.staffPhoto)"
                style="width:100px;height:100px;padding:10px;border-radius: 50%;"
              />
            </template>
          </el-table-column>
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式" sortable>
            <template slot-scope="{row}">
              <el-tag type="success" v-if="row.formOfEmployment === 1 ">正式</el-tag>
              <el-tag type="info" v-else>未知</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" sortable />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable>
            <template slot-scope="{row}">{{row.timeOfEntry | formatDate}}</template>
          </el-table-column>
          <el-table-column prop="enableState" label="账户状态" sortable>
            <template slot-scope="{row}">
              <el-switch
                :value="row.enableState == '1'"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable fixed="right" width="280">
            <template slot-scope="{row}">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
              >查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="userInfo.page"
            :page-size="userInfo.size"
            layout="total, prev, pager, next"
            :total="userInfo.total"
          ></el-pagination>
        </el-row>
        <add-employees :showloding.sync="showloding"></add-employees>
      </el-card>
      <!-- 二维码弹层 -->
      <el-dialog title="二维码" :visible.sync="showCodeDiadog">
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas"></canvas>
        </el-row>
      </el-dialog>
      <!-- 角色分配-->
      <assign-role ref="assignRole" :role-show.sync="roleShow" :user-id="userId" />
    </div>
  </div>
</template>

<script>
import QrCode from 'qrcode'
import AddEmployees from './components/add-employee'
import EmployeeEnum from '@/api/constant/employees'
import AssignRole from './components/assign-role'
import { getEmployeesList, delEmployee } from '@/api/employees'
import { formatDate } from '@/filters'
export default {
  components: { AddEmployees, AssignRole },
  data () {
    return {
      userInfo: {
        page: 1,
        size: 10,
        total: 0
      },
      list: [],
      loading: false, // 数据加载loading
      showloding: false, // 新增
      showCodeDiadog: false, // 二维码
      roleShow: false, // 角色弹层
      userId: null // 用户id
    }
  },
  created () {
    this.getEmployList()
  },
  methods: {
    // 获取列表
    async getEmployList () {
      this.loading = true
      const { rows, total } = await getEmployeesList(this.userInfo)
      this.list = rows
      this.userInfo.total = total
      this.loading = false
    },
    // 分页加载
    handleCurrentChange (newpage) {
      this.userInfo.page = newpage
      this.getEmployList()
    },
    // 删除
    async deleteEmployee (id) {
      try {
        await delEmployee(id)
        this.getEmployList()
        this.$message.success('删除成功')
      } catch (err) {
        console.log(err)
      }
    },
    // 导出功能
    exportData () {
      // 定义导出的表头
      const headers = {
        姓名: 'username',
        手机号: 'mobile',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      // 按需导入
      import('@/vendor/Export2Excel').then(async execl => {
        // 拿到数据
        const { rows } = await getEmployeesList({
          page: 1,
          size: this.userInfo.total
        })
        // 数据处理赋值data
        const data = this.formatJson(headers, rows)
        // 导出所需要的参数 header表头 data数据 filename表名称
        execl.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工资料表'
        })
      })
    },
    // 第一次循环拿到的是每一个员工对象item
    // header[key] 拿到的是中文对应的英文 username mobile
    // item[header[key]] 拿到的是每一个username对应的值
    formatJson (header, rows) {
      return rows.map(item => {
        return Object.keys(header).map(key => {
          // 处理时间格式
          if (header[key] === 'timeOfEntry' || header[key] === 'correctionTime') {
            return formatDate(item[header[key]])
            // 处理聘用形式
          } else if (header[key] === 'formOfEmployment') {
            const obj = EmployeeEnum.hireType.find(obj => {
              obj.id === item[header[key]]
            })
            return obj ? obj.value : '未知'
          }
          return item[header[key]]
        })
      })
    },
    // 点击图片显示二维码
    showQrCode (url) {
      if (url) {
        this.showCodeDiadog = true
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('该用户还未上传头像')
      }
    },
    // 点击分配角色
    editRole (id) {
      this.userId = id
      this.$refs.assignRole.getUserDetailById(this.userId)
      this.roleShow = true
    }
  }
}
</script>

<style>
</style>
