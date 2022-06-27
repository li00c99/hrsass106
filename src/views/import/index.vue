<template>
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  methods: {
    async success ({ header, results }) {
      // 如果是导入员工
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }

      const arr = []
      // 将result中的中文转换为英文，实现思路定义一个userRelations,遍历results,再遍历得到key;用userInfo接受userInfo[userRelations[key] = item[key]]
      results.forEach(item => {
        const userInfo = {}
        Object.keys(item).forEach(key => {
          // 当前的key是入职和转正时间需要对时间做一个处理
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            // 让英文和内容对应取来
            userInfo[userRelations[key]] = new Date(this.formatDate(item[key], '/')) // 只有这样, 才能入库
            return
          }
          userInfo[userRelations[key]] = item[key]
        })
        arr.push(userInfo)
      })
      await importEmployee(arr)
      this.$message.success('成功')
      this.$router.back()
    },
    // 处理EXEL时间格式问题函数
    formatDate (numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  }
}
</script>

<style>
</style>