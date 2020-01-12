<template>
  <div class="com-cascader">
    <div
      v-for="(pitem, pindex) in curData"
      :key="pindex"
      class="com-cascader__list"
      :style="{width:Math.floor(100/curData.length)+'%'}"
    >
      <ul
        ref="container"
        class="com-cascader__list-inner"
      >
        <li
          v-for="(citem, cindex) in pitem"
          :key="cindex"
          class="com-cascader__list-item"
        >
          {{ citem.label || citem.value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Slide from '../../js/SlideSelect'
export default {
  props: {
    data: {
      type: Array,
      default: () => ([])
    },
    columnCount: {
      type: Number,
      default: -1
    },
    value: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      curData: [],
      curValues: [],
      slides: [],
      startIndexs: []
    }
  },
  watch: {
    data: {
      handler () {
        // data变化时重新初始化选择器
        this.init()
      },
      deep: true
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (!this.data.length) {
        return
      }
      this.setData()
      this.$nextTick(() => {
        const lists = this.$refs.container
        const slides = []
        this.slides.forEach(slide => {
          if (slide.destroy) {
            slide.destroy()
          }
        })
        lists.forEach((list, i) => {
          const slide = new Slide(list)
          const renderSlide = (el, value, children) => {
            children.forEach(node => {
              node.classList.remove('com-cascader__list-item_checked')
            })
            // 如果当前列表为空时，el为null
            if (el) {
              el.classList.add('com-cascader__list-item_checked')
            }

            this.curValues.splice(i, 1, value)

            // 最后一级value变化，没有下一级变化,同时整个联动变化完毕，分发组件的input事件
            if (i === lists.length - 1) {
              this.$emit('input', this.getValue())
              this.$emit('change', this.getValue())
              return
            }
            // 下一级data改变
            this.curData.splice(i + 1, 1, this.curValues[i].children)
            // dom渲染完毕后，因为dom改变重新初始化
            this.$nextTick(() => {
              if (slides[i + 1]) {
                slides[i + 1].init({
                  startIndex: -1
                }, this.curData[i + 1])
              }
            })
          }
          // 滑动时，触发change事件，重新渲染下级选择器
          slide.on('change', (el, value, children) => {
            renderSlide(el, value, children)
          })

          // init后触发finsh事件，重新渲染下级选择器
          slide.on('finsh', (el, value, children) => {
            renderSlide(el, value, children)
          })
          slide.init({}, this.curData[i], this.curValues[i].value)
          slides.push(slide)
          this.slides = slides
        })
      })
    },
    getValue () {
      return this.curValues.map(item => item.value)
    },
    findValue (data, value) {
      return data.find((item) => item.value === value) || data[0]
    },
    setData () {
      const data = [this.data]
      const values = []

      values[0] = this.findValue(data[0], this.value[0])
      if (this.columnCount === -1) {
        for (let i = 0; ; i++) {
          if (values[i] && values[i].children && values[i].children.length) {
            data[i + 1] = values[i].children
            values[i + 1] = this.findValue(data[i + 1], this.value[i + 1])
          } else {
            break
          }
        }
      } else {
        for (let i = 0; i < this.columnCount - 1; i++) {
          if (values[i] && values[i].children && values[i].children.length) {
            data[i + 1] = values[i].children
            values[i + 1] = this.findValue(data[i + 1], this.value[i + 1])
          } else {
            break
          }
        }
      }
      this.curData = data
      this.curValues = values
    }
  }
}
</script>

<style lang="less">
.com-cascader {
  width: 100%;
  font-size: 14px;
}

.com-cascader__list {
  display: inline-block;
  vertical-align: top;
  width: 33%;
  text-align: center;
  box-sizing: border-box;
}

.com-cascader__list:not(:last-child){
  border-right: 1px solid rgb(243, 243, 243);
}

.com-cascader__list-item {
  padding: 8px 0;
  white-space: nowrap;
}

.com-cascader__list-item_checked {
  color: rgb(3, 136, 189);
}
</style>
