<template>
  <div class="child-section">
    <Header>
      <div class="header-content">
        <div class="header-title">操作指南</div>
        <div class="header-back">
          <div class="back" @click="handleTitleBack">
            <i class="iconfont icon-arrowthin" style="color: #999999"></i>
            <!-- <img class="icon_logo" src="../assets/images/close.png" alt="" /> -->
          </div>
        </div>
      </div>
    </Header>
    <div>
      <div class="tools">
        <van-button
          size="small"
          type="primary"
          :title="'基础按钮'"
          @click.stop="prePage"
        >
          上一页</van-button
        >

        <div class="page">{{ pageNum }}/{{ pageTotalNum }}</div>
        <!-- <van-button size="small" type="primary" :title="'基础按钮'" @click.stop="clock" > 顺时针</van-button>
			<van-button size="small" type="primary" :title="'基础按钮'" @click.stop="counterClock" > 逆时针</van-button> -->

        <van-button
          size="small"
          type="primary"
          :title="'基础按钮'"
          @click.stop="nextPage"
        >
          下一页</van-button
        >
      </div>
      <pdf
        ref="pdf"
        :src="url"
        :page="pageNum"
        :rotate="pageRotate"
        @progress="loadedRatio = $event"
        @page-loaded="pageLoaded($event)"
        @num-pages="pageTotalNum = $event"
        @error="pdfError($event)"
        @link-clicked="page = $event"
      >
      </pdf>
    </div>
  </div>
</template>

<script>
import pdf from "vue-pdf";
import Header from "../components/header.vue";
import { Notify, Toast, List, Button, Dialog } from "vant";
// import test1 from ''
export default {
  name: "",
  components: {
    pdf,
    [Button.name]: Button,
    Header,
  },
  data() {
    return {
      url: "",
      pageNum: 1,
      pageTotalNum: 1,
      pageRotate: 0,
      // 加载进度
      loadedRatio: 0,
      curPageNum: 0,
    };
  },
  created() {

    this.url = "/convey.pdf"; //维修
    
  },
  mounted() {
    

   
  },
  methods: {
    handleTitleBack() {
      this.$router.back();
    },
    // 上一页函数，
    prePage() {
      var page = this.pageNum;
      page = page > 1 ? page - 1 : this.pageTotalNum;
      this.pageNum = page;
    },
    // 下一页函数
    nextPage() {
      var page = this.pageNum;
      page = page < this.pageTotalNum ? page + 1 : 1;
      this.pageNum = page;
    },
    // 页面顺时针翻转90度。
    clock() {
      this.pageRotate += 90;
    },
    // 页面逆时针翻转90度。
    counterClock() {
      this.pageRotate -= 90;
    },
    // 页面加载回调函数，其中e为当前页数
    pageLoaded(e) {
      this.curPageNum = e;
    },
    // 其他的一些回调函数。
    pdfError(error) {
      console.error(error);
    },
    // 打印全部
    pdfPrintAll() {
      this.$refs.pdf.print();
    },
    // 打印指定部分
    pdfPrint() {
      this.$refs.pdf.print(100, [1, 2]);
    },
    getNumPages(url) {
      var loadingTask = pdf.createLoadingTask(url);
      loadingTask
        .then((pdf) => {
          this.url = loadingTask;
          this.numPages = pdf.numPages;
        })
        .catch((err) => {
          console.error("pdf加载失败");
        });
    },
  },
};
</script>
<style scoped lang="scss">
// @import "pdfh5/css/pdfh5.css";
* {
  padding: 0;
  margin: 0;
}
html,
body,
#app {
  width: 100%;
  height: 100%;
}

.tools {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  height: 120px;
}
</style>