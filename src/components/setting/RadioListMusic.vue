<template>
  <div>
    <BoxRadioList
      v-model="curValue"
      class="box-set-music fade"
      :show.sync="showBoxMusic"
      name="todo_music"
      :data="music"
      :hide-on-select="false"
      @change="handleMusicChange"
      @closed="$emit('closed')"
    />
  </div>
</template>

<script>
import BoxRadioList from '@/components/BoxRadioList'

export default {
  components: {
    BoxRadioList
  },
  props: {
    showCustom: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Object, String],
      default: () => ({})
    },
    data: {
      type: Array,
      default: () => {[]}
    }
  },
  data () {
    return {
      music: [],
      curValue: this.value,
      showBoxMusic: false,
      lastValue: this.value
    }
  },
  watch: {
    show (val) {
      this.showBoxMusic = val
    },
    value (val) {
      if (val === this.curValue) {
        return
      }
      this.curValue = this.lastValue = val
      this.setMusic()
    },
    data () {
      this.setMusic()
    },
    showBoxMusic  (val) {
      if (!val) {
        this.$emit('update:show', false)
      }
    }
  },
  mounted () {
    this.setMusic()
  },
  methods: {
    setMusic () {
      this.music = this.data.map(item => {
        const obj = {
          value: item,
          text: item.custom ? item.name : this.$t(`music.${item.name}`),
          src: item.src,
          backgroundImg: item.backgroundImg
        }

        if (item.name === this.curValue.name) {

          obj.text += `(${this.$t('settings.already_selected')})`
          this.curValue = this.lastValue = item
        }
        return obj
      })
      if (this.showCustom) {
        this.music.push({
          value: 'custom',
          text: this.$t('word.customize'),
          src: '',
          backgroundImg: '/music/background/back0.jpg'
        })
      }
    },
    handleMusicChange (val) {
      if (val !== 'custom') {
        this.setMusic()
        this.$emit('input', this.curValue)
        this.$emit('change', this.curValue)
        return
      }

      // 点击custom时，不改变绑定值，只抛出事件
      // 子组件通过watch观察curValue，但watch是延时的
      // 而这里又将curValue设定回了原值，故watch在观察时，不会观察到变化
      // 所以需要在下一次事件循环时，将curValue设回原值
      setTimeout(() => {
        this.curValue = this.lastValue
        this.$emit('change', 'custom')
      })
    }
  }
}
</script>

<style>

</style>
