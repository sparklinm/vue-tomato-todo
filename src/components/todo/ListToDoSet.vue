<template>
  <ComList
    id="container"
    class="list-todo-set"
  >
    <div
      v-for="(item, index) in sets"
      :key="item.name"
      class="todo-set"
    >
      <ComCell
        :title="item.name"
        class="todo-set-inner"
      >
        <template v-slot:right-icon>
          <ComIcon
            v-show="!showToDos[index]"
            name="chevron-up"
            class="btn-option"
            @click="setShowToDos(index, true)"
          />
          <ComIcon
            v-show="showToDos[index]"
            name="chevron-down"
            class="btn-option"
            @click="setShowToDos(index, false)"
          />
          <ComIcon
            name="pie-chart"
            class="btn-option"
          />
          <ComIcon
            name="cog"
            class="btn-option"
          />
          <ComIcon
            name="plus"
            class="btn-option"
          />
        </template>
      </ComCell>
      <ListToDo
        v-show="showToDos[index]"
        :todos="item.todos"
        class="list-set-todo"
      />
    </div>
  </ComList>
</template>

<script>
import { mapState } from 'vuex'
import ListToDo from './ListToDo'
export default {
  components: {
    ListToDo
  },
  data () {
    return {
      showToDos: [false, false]
    }
  },
  computed: {
    ...mapState({
      sets: state => state.todoSets
    })
  },
  methods: {
    setShowToDos (index, isShow) {
      const showToDos = this.showToDos
      showToDos[index] = isShow
      this.showToDos = Object.assign([], showToDos)
    }
  }
}
</script>

<style lang="less">
.list-todo-set {
  .todo-set-inner {
    color: #666666;
  }

  .list-set-todo {
    .list-item {
      padding: 10px 0 5px 15px;

      .name {
        font-size: 15px;
      }
    }

    .list-item .left .card {
      margin-top: 8px;
    }

    .list-item .right .btn-start {
      font-size: 14px;
    }

    .list-item .right {
      width: 75px;
    }
  }
}

.todo-set-inner {
  .com-cell__hd {
    font-size: 18px;
  }

  .come-icon__inner {
    font-size: 24px;
  }

  .btn-option {
    margin-left: 20px;
  }
}
</style>
