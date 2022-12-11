<template>
  <div>
    <div class="videoupload">
      <!-- action必选参数, 上传的地址 -->


      <el-upload
          class="avatar-uploader el-upload--text"
          :headers="headers"
          :disabled="tempSrc!='' || !isFactor "
          :action=action
          :show-file-list="false"
          :on-success="handleVideoSuccess"
          :before-upload="beforeUploadVideo"
          :on-progress="uploadVideoProcess"
      >
        <i
            v-if="!tempSrc && videoFlag == false"
            class="el-icon-plus"
            style="
                        display: flex;
                        margin-left: 300px;
                        font-size: 22px;
                        font-weight: bold;
                    "
        ></i>

        <div
            style="position: relative; margin-top: -18px"
            :style="{
                        visibility: tempSrc ? 'visible' : 'hidden'
                    }"
        >
          <i
              @click.stop="clearVideo"
              v-if="isFactor "
              class="el-icon-circle-close"
              style="
                            color: red;
                            font-size: 22px;
                            font-weight: bold;
                            top: 12px;
                            position: absolute;
                            right: -22px;
                        "
          ></i>
          <video
              ref="videoPlay"
              :src="src"
              type="video/mp4"
              width="290"
              height="190"
              style="background-color: black"
              controls="controls"
          >
            您的浏览器不支持视频播放
          </video>
        </div>

      </el-upload>

    </div>
  </div>
</template>

<script>
import {Upload} from 'element-ui'
import {request, sysbaseUrl} from "@/axios";
export default {
  name:'video-my',
  props: {
    src: String,
    isFactor: {
      // 是否是厂商默认是
      type: Boolean,
      default: true
    },
  },
  model: {
    prop: 'src',
    event: 'returnBack'
  },
  data() {
    return {
      id:'',
      urlPre:'',
      action: sysbaseUrl+this.urlPre+'uploadVideo?id='+this.id,
      headers: {'Authorization':sessionStorage.getItem("token")},
      videoFlag: false,
      tempSrc: this.src
      // videoUploadPercent: 0
    }
  },
  methods: {
    clearVideo() {
      console.log('点击删除图标')
      this.tempSrc = ''
      this.$emit('returnBack', this.id)
    },
    handleVideoSuccess(res, file) {
      //获取上传文件地址
      console.log('res', res)
      this.videoFlag = false
      // this.videoUploadPercent = 0
      if (res.data) {
        this.commonUpdateSrc(sysbaseUrl+"\\"+res.data)
        console.log('this.src', this.src)
      } else {
        this.$message.error(res.msg)
      }
    },
    commonUpdateSrc(src) {
      //如果动态切换src地址，也要加上下面的事件（前提是src地址已切换或已重新赋值，再走这个事件）
      this.tempSrc = src
      this.$nextTick(() => {
        let videoRefs = this.$refs.videoPlay
        // this.$emit('returnBack', src)
        videoRefs.src = src
        // videoRefs.play()
      })
    },
    uploadVideoProcess(event, file, fileList) {
      console.log(event.percent, file, fileList)
      this.videoFlag = true
      // this.videoUploadPercent = Math.floor(event.percent)
    },
    beforeUploadVideo(file) {
      if(this.id===null || this.id ===undefined || this.id ===''){
        this.$message.error('没有ID')
        return false
      }
      const isLt40M = file.size / 1024 / 1024 <= 40
      if (['video/mp4'].indexOf(file.type) == -1) {
        this.$message.error('请上传正确的视频格式')
        return false
      }
      if (!isLt40M) {
        this.$message.error('上传视频大小不能超过40MB哦!')
        return false
      }
    }
  },
  components: {
    ElUpload: Upload
  }
}
</script>

<style lang="css" scoped>
.videoupload {
  width: 290px;
  height: 168px;
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
}
.videoupload /deep/ .el-upload {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
