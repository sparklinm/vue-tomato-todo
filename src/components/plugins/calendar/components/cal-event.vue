<template>
  <div class="ev-events__item">
    <div class="ev-events__hd">
      <span class="ev-events__hd-text">
        {{ dateTimeFormatter(event.date, i18n[locale].hour_minute) }}
        <slot name="header" />
      </span>
    </div>

    <div class="ev-events__bd">
      <span
        class="ev-events__dot"
        :style="dotStyle"
      />
      <div class="ev-events__content">
        <span v-if="event.text">{{ event.text }}</span>
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import i18n from '../i18n.js'
import util from '../tools.js'
export default {
  inject: ['options'],
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      i18n
    }
  },
  computed: {
    locale () {
      console.log(this.options)

      return this.options.locale
    },
    color () {
      return this.options.color
    },
    dotStyle () {
      return {
        'background-image': ` radial-gradient(circle,${
          this.color
        } 20%, ${util.getLightColor(this.color, 0.7)})`
      }
    }
  },
  methods: {
    dateTimeFormatter: util.dateTimeFormatter
  }
}
</script>
