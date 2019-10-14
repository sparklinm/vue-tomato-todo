<template>
  <ul>
    <li
      v-for="(item,index) in data"
      :key="index"
    >
      <span class="hd">{{ data.title }}</span>
      <span class="bd">{{ data.content }}</span>
      <span class="ft">{{ data.footer }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {}
  },
  methods: {}
}
</script>

<style lang='less'>


</style>
