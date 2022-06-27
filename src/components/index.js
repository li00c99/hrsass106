import PageTools from '@/components/PageToodls'
import UploadExcel from '@/components/UploadExcel'
import ImageUpload from '@/components/ImageUpload'
// 导入组件
export default {
  install (Vue) {
    // 全局注册
    Vue.component('PageTools', PageTools)
    // exel组件
    Vue.component('UploadExcel', UploadExcel)
    // 上传图片组件
    Vue.component('ImageUpload',ImageUpload)
  }
}
