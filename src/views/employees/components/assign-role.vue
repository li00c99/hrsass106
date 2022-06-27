<template>
  <el-dialog title="分配角色" :visible="roleShow" @close="restCennl">
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" @click="restCennl">取 消</el-button>
        <el-button type="primary" size="small" @click="btnOk">确 定</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  props: {
    roleShow: {
      type: Boolean,
      default: false
    },
    userId: {
      type: [String, Number],
      default: true
    }
  },
  data () {
    return {
      checkList: [],
      list: []
    }
  },
  created () {
    this.getRoleList()
  },
  methods: {
    async  getRoleList () {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.list = rows
    },
    async getUserDetailById (id) {
      const { roleIds } = await getUserDetailById(id)
      this.checkList = roleIds
    },
    async btnOk () {
      await assignRoles({ id: this.userId, roleIds: this.checkList })
      this.$emit('update:roleShow', false)
      this.$message.success('分配角色成功')
    },
    restCennl(){
      this.checkList = []
      this.$emit('update:roleShow', false)
    }
  }
}
</script>

<style>
</style>