<template>
  <div class="com-cascader">
    <div class="com-cascader__list">
      <ul class="com-cascader__list-inner">
        <li
          v-for="(item,index) in firstData"
          :key="index"
          class="com-cascader__list-item"
        >
          {{ item.label||item.value }}
        </li>
      </ul>
    </div>

    <div class="com-cascader__list">
      <ul class="com-cascader__list-inner">
        <li
          v-for="(item,index) in secondData"
          :key="index"
          class="com-cascader__list-item"
        >
          {{ item.label||item.value }}
        </li>
      </ul>
    </div>

    <div class="com-cascader__list">
      <ul class="com-cascader__list-inner">
        <li
          v-for="(item,index) in thirdData"
          :key="index"
          class="com-cascader__list-item"
        >
          {{ item.label||item.value }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Slide from '../../js/Slide'
export default {
  props: {
    data: {
      type: Array,
      default: () => ([
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                {
                  value: 'yizhi',
                  label: '一致'
                }, {
                  value: 'fankui',
                  label: '反馈'
                }, {
                  value: 'xiaolv',
                  label: '效率'
                }, {
                  value: 'kekong',
                  label: '可控'
                }
              ]
            }, {
              value: 'daohang',
              label: '导航',
              children: [
                {
                  value: 'cexiangdaohang',
                  label: '侧向导航'
                }, {
                  value: 'dingbudaohang',
                  label: '顶部导航'
                }
              ]
            }
          ]
        }, {
          value: 'zujian',
          label: '组件',
          children: [
            {
              value: 'basic',
              label: 'Basic',
              children: [
                {
                  value: 'layout',
                  label: 'Layout 布局'
                }, {
                  value: 'color',
                  label: 'Color 色彩'
                }, {
                  value: 'typography',
                  label: 'Typography 字体'
                }, {
                  value: 'icon',
                  label: 'Icon 图标'
                }, {
                  value: 'button',
                  label: 'Button 按钮'
                }
              ]
            }, {
              value: 'form',
              label: 'Form',
              children: [
                {
                  value: 'radio',
                  label: 'Radio 单选框'
                }, {
                  value: 'checkbox',
                  label: 'Checkbox 多选框'
                }, {
                  value: 'input',
                  label: 'Input 输入框'
                }, {
                  value: 'input-number',
                  label: 'InputNumber 计数器'
                }, {
                  value: 'select',
                  label: 'Select 选择器'
                }, {
                  value: 'cascader',
                  label: 'Cascader 级联选择器'
                }, {
                  value: 'switch',
                  label: 'Switch 开关'
                }, {
                  value: 'slider',
                  label: 'Slider 滑块'
                }, {
                  value: 'time-picker',
                  label: 'TimePicker 时间选择器'
                }, {
                  value: 'date-picker',
                  label: 'DatePicker 日期选择器'
                }, {
                  value: 'datetime-picker',
                  label: 'DateTimePicker 日期时间选择器'
                }, {
                  value: 'upload',
                  label: 'Upload 上传'
                }, {
                  value: 'rate',
                  label: 'Rate 评分'
                }, {
                  value: 'form',
                  label: 'Form 表单'
                }
              ]
            }, {
              value: 'data',
              label: 'Data',
              children: [
                {
                  value: 'table',
                  label: 'Table 表格'
                }, {
                  value: 'tag',
                  label: 'Tag 标签'
                }, {
                  value: 'progress',
                  label: 'Progress 进度条'
                }, {
                  value: 'tree',
                  label: 'Tree 树形控件'
                }, {
                  value: 'pagination',
                  label: 'Pagination 分页'
                }, {
                  value: 'badge',
                  label: 'Badge 标记'
                }
              ]
            }, {
              value: 'notice',
              label: 'Notice',
              children: [
                {
                  value: 'alert',
                  label: 'Alert 警告'
                }, {
                  value: 'loading',
                  label: 'Loading 加载'
                }, {
                  value: 'message',
                  label: 'Message 消息提示'
                }, {
                  value: 'message-box',
                  label: 'MessageBox 弹框'
                }, {
                  value: 'notification',
                  label: 'Notification 通知'
                }
              ]
            }, {
              value: 'navigation',
              label: 'Navigation',
              children: [
                {
                  value: 'menu',
                  label: 'NavMenu 导航菜单'
                }, {
                  value: 'tabs',
                  label: 'Tabs 标签页'
                }, {
                  value: 'breadcrumb',
                  label: 'Breadcrumb 面包屑'
                }, {
                  value: 'dropdown',
                  label: 'Dropdown 下拉菜单'
                }, {
                  value: 'steps',
                  label: 'Steps 步骤条'
                }
              ]
            }, {
              value: 'others',
              label: 'Others',
              children: [
                {
                  value: 'dialog',
                  label: 'Dialog 对话框'
                }, {
                  value: 'tooltip',
                  label: 'Tooltip 文字提示'
                }, {
                  value: 'popover',
                  label: 'Popover 弹出框'
                }, {
                  value: 'card',
                  label: 'Card 卡片'
                }, {
                  value: 'carousel',
                  label: 'Carousel 走马灯'
                }, {
                  value: 'collapse',
                  label: 'Collapse 折叠面板'
                }
              ]
            }
          ]
        }, {
          value: 'ziyuan',
          label: '资源',
          children: [
            {
              value: 'axure',
              label: 'Axure Components'
            }, {
              value: 'sketch',
              label: 'Sketch Templates'
            }, {
              value: 'jiaohu',
              label: '组件交互文档'
            }
          ]
        }
      ])
    }
  },
  data () {
    return {
      firstData: this.data,
      secondData: [],
      thirdData: [],
      firstValue: '',
      secondValue: '',
      thirdValue: ''
    }
  },
  watch: {
    // firstValue () {
    //   this.setSecondData()

    // },
    // secondValue () {
    //   this.setThirdData()
    // }
  },
  created () {
    this.firstValue = this.firstData[0]
    this.setSecondData()
    this.secondValue = this.secondData[0]
    this.setThirdData()
    this.thirdValue = this.thirdData[0]
  },
  mounted () {
    const lists = document.querySelectorAll('.com-cascader__list-inner')
    const firstSlide = new Slide(lists[0], {}, this.firstData)
    firstSlide.on('change', (el, value, nodes) => {
      nodes.forEach(node => {
        node.classList.remove('com-cascader__list-item_checked')
      })
      el.classList.add('com-cascader__list-item_checked')
      this.firstValue = value
      this.secondData = this.firstValue.children

      this.$nextTick(() => {
        if (secondSlide) {
          secondSlide.reInit(this.secondData)
        }
      })
    })
    firstSlide.init()

    const secondSlide = new Slide(lists[1], {}, this.secondData)
    secondSlide.on('change', (el, value, nodes) => {
      nodes.forEach(node => {
        node.classList.remove('com-cascader__list-item_checked')
      })
      el.classList.add('com-cascader__list-item_checked')
      this.secondValue = value
      this.thirdData = this.secondValue.children
      this.$nextTick(() => {
        if (thirdSlide) {
          thirdSlide.reInit(this.thirdData)
        }
      })
    })
    secondSlide.init()

    const thirdSlide = new Slide(lists[2], {}, this.thirdData)
    thirdSlide.on('change', (el, value, nodes) => {
      nodes.forEach(node => {
        node.classList.remove('com-cascader__list-item_checked')
      })
      el.classList.add('com-cascader__list-item_checked')
      this.thirdValue = value
    })
    thirdSlide.init()
  },
  methods: {
    setSecondData () {
      this.secondData = this.firstValue.children
    },
    setThirdData () {
      this.thirdData = this.secondValue.children
    },
    setData () {
      for (let i = 0; ;i++) {
        if (this.value[i].children && this.value[i].children.length) {
          this.data[i + 1] = this.value[i].children
        }
      }
    },
    setNextLevelData (lastValue) {
      // this.
    }
  }
}
</script>

<style lang='less'>
.com-cascader {
  width: 100%;
}

.com-cascader__list {
  display: inline-block;
  vertical-align: top;
  width: 33%;
  text-align: center;
}

.com-cascader__list-item {
  padding: 6px 0;
  white-space: nowrap;
}

.com-cascader__list-item_checked {
  color: rgb(3, 136, 189);
}

</style>
