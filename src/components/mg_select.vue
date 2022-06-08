<template>
  <div
    :style="`text-align:${align}; ` "
    class="zq-drop-list"
    @mouseover="onDplOver($event)"
    @mouseout="onDplOut($event)"
  ><span :style=" disabled ? 'color: #999999' : ( activeIndex >= 0  ? '' : 'color: #999999')">
      {{dplLable}}
      <img class="drop_select_arrow" src="../assets/images/icon_arrow_gray.png" alt="" />
    </span><ul :style="`max-height:${size}00%` " v-dpl>
      <li
        v-for="(item, index) in dataList"
        :key="index"
        @click="onLiClick(index, $event)"
      >{{item[labelProperty]}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "DropDownList",
  data() {
    return {
      // activeIndex: -1
    };
  },
  props: {
    dataList: {
      // 遍历数据
      type: [Array, Object],
      default() {
        return [{ name: "选项一" }, { name: "选项二" }];
      }
    },

    labelProperty: {
      // prop键名
      type: String,
      default() {
        return "instrument_name";
      }
    },

    placeholder: {
      // 默认提示
      type: String,
      default() {
        return "请输入";
      }
    },
    align: {
      // 对齐方式
      type: String,
      default: () => "center"
    },
    activeIndex: {
      // 显示个数
      type: [Number, String],
      default: () => -1
    },
    size: {
      // 显示个数
      type: [Number, String],
      default: () => 4
    },

    disabled: {
      type: Boolean,
      default: () => false
    }
  },
  directives: {
    dpl: {
      bind(el) {
        el.style.display = "none";
      }
    }
  },
  methods: {
    onDplOver(event) {
      // 禁用状态不允许操作
      if (this.disabled) return;
      console.dir(event.currentTarget.childNodes);
      let ul = event.currentTarget.childNodes[1];

      ul.style.display = "block";
    },
    onDplOut(event) {
      // 禁用状态不允许操作
      if (this.disabled) return;
      let ul = event.currentTarget.childNodes[1];
      ul.style.display = "none";
    },
    onLiClick(index) {
      // 禁用状态不允许操作
      if (this.disabled) return;
      let path = event.path || (event.composedPath && event.composedPath()); //兼容火狐和safari
      path[1].style.display = "none";
      this.activeIndex = index;
      this.$emit("change", {
        index: index,
        value: this.dataList[index]
      });
    }
  },
  computed: {
    dplLable() {
      return this.dataList[this.activeIndex]
        ? this.dataList[this.activeIndex][this.labelProperty]
        : this.placeholder;
    }
  },
  watch: {
    dataList() {
      // 当遍历数据发生更替时, 重置下拉菜单
      this.activeIndex = -1;
    }
  }
};
</script>


<style scoped lang="scss">
.zq-drop-list {
  display: inline-block;
  width: 100%;
  position: relative;
  span {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: space-between;
    height: 70px;
    font-size: 30px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #999999;

    border-radius: 4px;
    // padding-left: 10px;
    position: relative;
    i {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-25%);
      width: 0;
      height: 0;
      border-width: 6px;
      border-style: solid;
      border-color: #c1bfbf transparent transparent transparent;
    }
  }
  ul {    
    position: absolute;
    z-index: 20;
    top: 100%;
    left: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    // border: solid 1px #f1f1f1;
    border-radius: 4px;
    overflow: scroll;
    background: blue;
    li {
      list-style: none;
      padding: 20px 0px;
      font-size: 28px;
      padding-left: 20px;;
height: 90px;
      border-bottom: solid 1px #DDDDDD;
      background: #DDDDDD;
    color: #333333;
    }
    li:last-child {
      border-bottom: none;
    }
    li:hover {
      background: #f6f6f6;
    }
  }

  .drop_select_arrow{
        width: 20px;
        height: 20px;
      }
}
</style>