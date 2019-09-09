<template>
  <div class="com-input input-c">
    <textarea
      type="text"
      class="input-box input-box-c"
      rows="1"
      :placeholder="placeholder"
    />
    <span
      v-if="icon==='question'"
      class="tip"
    ><i
      class="fa fa-question-circle"
      aria-hidden="true"
    /></span>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data () {
    return {

    }
  },
  mounted: {

  },
  methods: {

  }
}
</script>

<style lang='less'>
.com-input {
  .flex(@justify-content: space-between; @align-items: center);
  .input-box {
    width: 100%;
    border: none;
    resize: none;
    outline: none;
    padding: 5px 0;
    flex: 1;
  }
  .tip {
    color:rgb(88, 88, 88);
  }
}
</style>
