<template>
  <div class="v-waterfall-content">
    <div
      class="v-waterfall-item"
      v-for="(item, index) in waterfallList"
      :key="index"
      :style="{
        top: item.top + 'px',
        left: item.left + 'px',
        width: waterfallImgWidth + 'px',
        height: item.height + 'px',
      }"
    >
      <img :src="item.src" alt="" />
    </div>
  </div>
</template>

<script>
import { debaunce } from '../utils'
import imgArr from '../api/imgArr.js'
export default {
  name: "v-waterfall",
  data() {
    return {
      waterfallImgWidth: 250,//每一列的宽度
      waterfallImgCol: 0,//多少列
      waterfallImgRight: 10,//右边距
      waterfallImgBottom: 10,//下边距
      imgArr,//原始数据
      waterfallList: [],//存放计算好的数据
      waterfallDeviationHeight: [],//存放瀑布流各个列的高度
    }
  },
  mounted() {
    this.waterFall()
    // 窗口尺寸变化事件
    window.addEventListener("resize", debaunce(() => {
      this.waterfallImgWidth = 250
      this.waterfallList = []
      this.waterFall()
    }, 1000)),
      // 窗口滚动事件
      window.addEventListener("scroll", debaunce(() => {
        this.onScroll()
      }, 1000))
  },
  methods: {
    //动态计算多少列，每列的宽度
    waterFall() {
      let pageWidth = this.getClient().width - 10;//可以减去一个滚动条的宽度
      this.waterfallImgCol = parseInt(pageWidth / (this.waterfallImgWidth + this.waterfallImgRight));
      this.waterfallImgWidth = parseInt(pageWidth % (this.waterfallImgWidth + this.waterfallImgRight) / this.waterfallImgCol) + this.waterfallImgWidth
      //初始化偏移高度数组
      this.waterfallDeviationHeight = new Array(this.waterfallImgCol);
      for (let i = 0; i < this.waterfallDeviationHeight.length; i++) {
        this.waterfallDeviationHeight[i] = 0;
      }
      this.imgPreloading()


    },
    //图片预加载
    async imgPreloading() {
      for (let i = 0; i < this.imgArr.length; i++) {
        await new Promise((resolve) => {
          const aImg = new Image();
          aImg.src = this.imgArr[i]
          aImg.onload = () => {
            const imgData = {}
            //根据设定的列宽度求出图片的高度
            imgData.height = this.waterfallImgWidth / aImg.width * aImg.height
            imgData.src = this.imgArr[i]
            this.waterfallList.push(imgData)
            //调用图片位置计算方法
            this.rankImg(imgData);
            resolve()
          }
        })
      }
    },
    //计算图片偏移量
    rankImg(imgData) {
      let { waterfallImgWidth, waterfallImgRight, waterfallImgBottom, waterfallDeviationHeight } = this;
      //找出当前最短列的索引
      let minIndex = this.waterfallDeviationHeight.indexOf(Math.min.apply(null, this.waterfallDeviationHeight))
      //获取最短列底部高度，既下一张图片的顶部高度
      imgData.top = waterfallDeviationHeight[minIndex];
      //计算左侧偏移，最短列索引*（右边距+列宽度）
      imgData.left = minIndex * (waterfallImgRight + waterfallImgWidth);
      //改变当前列高度
      waterfallDeviationHeight[minIndex] += imgData.height + waterfallImgBottom;

    },
    // clientWidth 处理兼容性
    getClient() {
      return {
        width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      }
    },
    // 触底事件
    onScroll() {
      // 滚动高度（document.documentElement.scrollTop）
      // 可视区域/屏幕高度（document.documentElement.clientHeight）
      // 页面高度（document.documentElement.scrollHeight）
      //If(滚动高度 + 可视区域  >= 页面高度){ do something函数}  
      // 是否滚动到底部
      const IS_BOTTOM = document.documentElement.scrollTop || document.body.scrollTop + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 100
      if (IS_BOTTOM) {
        console.log('到底了')
        this.imgArr = imgArr.slice(Math.round(Math.random() * 10), Math.round(Math.random() * 10) + 20)
        this.imgPreloading()
      }
    }
  },
  destroyed() {
    // 离开页面取消监听
    window.removeEventListener('scroll', this.onScroll, false)
    window.removeEventListener('resize', this.waterFall, false)
  }
}
</script>
<style >

.v-waterfall-content {
  position: relative;
}
.v-waterfall-item {
  position: absolute;
}
.v-waterfall-item img {
  width: 100%;
}
</style>

