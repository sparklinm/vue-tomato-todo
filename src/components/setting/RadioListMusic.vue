<template>
  <BoxRadioList
    v-model="curValue"
    class="box-set-music fade"
    :show.sync="showBoxMusic"
    name="todo_music"
    :data="music"
    :hide-on-select="false"
    @change="handleMusicChange"
  />
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
      showBoxMusic: false
    }
  },
  watch: {
    show (val) {
      this.showBoxMusic = val
    },
    value (val) {
      this.curValue = val
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
          this.curValue = item
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
      this.$emit('input', this.curValue)
      this.$emit('change', val)
      if (val !== 'custom') {
        this.setMusic()
      }
    }
  }
}
</script>

<style>

</style>
