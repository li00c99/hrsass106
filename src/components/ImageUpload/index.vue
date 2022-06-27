<template>
  <div>
    <el-upload
      class="avatar-uploader"
      action="#"
      list-type="picture-card"
      :file-list="filelist"
      :limit="1"
      :on-preview="preview"
      :on-remove="remove"
      :on-change="change"
      :before-upload="beforeUpload"
      :http-request="upload"
      :class="{disabled: imgPreview}"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress v-if="showPercent" style="width: 180px" :percentage="percent"></el-progress>
    <el-dialog title="预览" :visible.sync="showdialog">
      <img :src="imgUrl" style="width:100%" />
    </el-dialog>
  </div>
</template> 

<script>
import COS from 'cos-js-sdk-v5'
// 实例化COS对象
const cos = new COS({
  // 同学们拷贝自己的秘钥和key 只有用自己的key和自己的秘钥才能上传到自己的存储桶里面
  SecretId: 'AKIDsZ0A2dx0mHVTCdnhJeiV1GEvLUMxWopZ', // 身份识别 ID
  SecretKey: 'UifLktlMgjX4KJ1ScV8TXKq65nEPJwIO' // 身份密钥
})
export default {
  data () {
    return {
      filelist: [],
      showdialog: false,
      imgUrl: '',
      currentFileUid: null,
      showPercent: false,
      percent: 0
    }
  },
  computed: {
    imgPreview () {
      return this.filelist.length === 1
    }
  },
  methods: {
    // 点击图片
    preview (file) {
      this.showdialog = true
      this.imgUrl = file.url
    },
    // 删除图片
    remove (file, filelist) {
      this.filelist = this.filelist.filter(item => item.uid !== file.uid)
    },
    // 添加
    change (file, fileList) {
      this.filelist = fileList.map(item => item)
    },
    // 更新前调用验证图片大小格式
    beforeUpload (file) {
      console.log(file)
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      const status = types.some(item => item === file.type)
      if (!status) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        this.$message.error('图片大小不能超过5M')
        return false
      }
      this.currentFileUid = file.uid
      this.showPercent = true
      return true
    },
    upload (params) {
      if (params.file) {
        cos.putObject({
          Bucket: 'li00cc-1307737472', /* 填入您自己的存储桶，必须字段 */
          Region: 'ap-nanjing',  /* 存储桶所在地域，例如ap-beijing，必须字段 */
          Key: params.file.name,  /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
          StorageClass: 'STANDARD',
          Body: params.file, // 上传文件对象
          onProgress: (params) => {
            this.percent = params.percent * 100
            console.log(params)
          }
        }, (err, data) => {
          console.log(data)
          if (!err && data.statusCode === 200) {
            this.filelist = this.filelist.map(item => {
              if (item.uid === this.currentFileUid) {
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
            setTimeout(() => {
              this.showPercent = false // 隐藏进度条
              this.percent = 0 // 进度归0
            }, 2000)
          }
        })
      }
    }
  }
}
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>