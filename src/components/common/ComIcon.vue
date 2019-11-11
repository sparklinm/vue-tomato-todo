<template>
  <span
    v-if="name"
    class="com-icon"
    :class="{flex:text}"
    @click="$emit('click')"
  >
    <i
      class="come-icon__inner"
      :class="classObj"
    />
    <span
      v-if="text"
      class="come-icon__text"
    >{{ text }}</span>
  </span>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  computed: {
    classObj () {
      return {
        fa: true,
        ['fa-' + this.name]: true
      }

    }
  },
  mounted () {

  },
  methods: {}
}
</script>

<style lang='less'>
.flex {
  .flex(@flex-direction: column; @align-items: center);
}
.com-icon {

}

.come-icon__inner {
  font-size: 20px;
}

.come-icon__text {
  margin-top: 6px;
  font-size: 10px;
}
</style>
