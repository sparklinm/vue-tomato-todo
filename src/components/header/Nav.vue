<template>
  <div class="nav-wrap">
    <div class="nav">
      <div class="left">
        待办
      </div>
      <div class="right">
        <span>
          <i
            class="fa fa-clock-o"
            aria-hidden="true"
          />
        </span>
        <span @click="addToDo">
          <i class="fa fa-plus" />
        </span>
        <span>
          <i class="fa fa-ellipsis-v" />
        </span>
      </div>
    </div>

    <BoxAddToDo
      v-if="showBoxAddToDo"
      :show.sync="showBoxAddToDo"
    />
  </div>
</template>

<script>
import BoxAddToDo from '@/components/todo/add/BoxAddToDo'
export default {
  components: {
    BoxAddToDo
  },
  data () {
    return {
      showBoxAddToDo: false
    }
  },
  methods: {
    addToDo () {
      // this.$store.commit('toggleBoxAddToDo', true, null)
      this.showBoxAddToDo = true
    }
  }
}
</script>

<style lang='less'>
.nav {
  padding: 18px 15px;
  font-size: 16px;
  color: white;
  .flex(@align-items: center; @justify-content: space-between;);

  .right {
    font-size:18px;
    span {
      margin-left: 20px;
      padding: 5px;
    }
  }
}
</style>
