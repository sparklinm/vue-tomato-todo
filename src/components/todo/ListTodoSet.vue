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
        :style="{borderLeftColor:item.background}"
        @click.native.self="setShowTodos(index)"
      >
        <template v-slot:right-icon>
          <ComIcon
            v-show="!showTodos[index]"
            name="chevron-right"
            class="btn-option"
            @click="setShowTodos(index, true)"
          />
          <ComIcon
            v-show="showTodos[index]"
            name="chevron-down"
            class="btn-option"
            @click="setShowTodos(index, false)"
          />
          <ComToolTip>
            <ComIcon
              name="pie-chart"
              class="btn-option"
            />
            <template v-slot:content>
              <div class="drop-list_simple">
                <ul>
                  <li>
                    {{ $t('todo.view_todo_set_statistics') }}
                  </li>
                  <li>
                    {{ $t('todo.view_all_statistics') }}
                  </li>
                </ul>
              </div>
            </template>
          </ComToolTip>
          <ComIcon
            name="cog"
            class="btn-option"
            @click="showBox('showBoxModifySet',index)"
          />
          <ComIcon
            name="plus"
            class="btn-option"
            @click="showBox('showBoxAddTodo',index)"
          />
        </template>
      </ComCell>
      <ListTodo
        v-show="showTodos[index]"
        :todos="getTodosBySet(item.id)"
        class="list-set-todo"
      />
    </div>
    <BoxAddTodo
      v-if="showBoxAddTodo"
      :show.sync="showBoxAddTodo"
      @submit="submitAddTodo"
    />
    <ComPopup
      class="box-set-settings"
      no-header
      :show.sync="showBoxModifySet"
    >
      <ComInput
        v-model="currentSet.resetTimeSingle"
        type="number"
        :placeholder="$t('todo.set_complete_one_restime')"
        autofocus
      />
      <ComInput
        v-model="currentSet.resetTimeAll"
        type="number"
        :placeholder="$t('todo.set_complete_all_restime')"
        autofocus
      />
      <div class="checkbox-container">
        <ComCheckbox
          v-model="currentSet.continuousExcute"
          left
          :content="$t('todo.do_continue')"
          class="set-setting-checkbox"
        />
      </div>
      <div class="tip-setting">
        {{ $t('todo.do_continue_tip') }}
      </div>
      <template v-slot:footer>
        <button
          class="com-popup__footer-btn"
          @click="submitModifySet"
        >
          {{ $t('action.confirm') }}
        </button>
        <button
          class="com-popup__footer-btn"
          @click="showBoxModifySet=false"
        >
          {{ $t('action.cancel') }}
        </button>
      </template>
    </ComPopup>
  </ComList>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import ListTodo from './ListTodo'
import BoxAddTodo from './add/BoxAddTodo'

export default {
  components: {
    ListTodo,
    BoxAddTodo
  },
  data () {
    return {
      showTodos: [false, false],
      showBoxAddTodo: false,
      showBoxModifySet: false,
      currentSet: {},
      currentSetIndex: 0
    }
  },
  computed: {
    ...mapState('todo', {
      sets: state => state.todoSets
    }),
    ...mapGetters('todo', {
      getTodosBySet: 'getTodosBySet'
    })
  },
  methods: {
    ...mapMutations('todo', ['modifyTodoSet']),
    setShowTodos (index, isShow) {
      if (typeof isShow === 'undefined') {
        this.showTodos[index] = !this.showTodos[index]
      } else {
        this.showTodos[index] = isShow
      }
      this.showTodos = Object.assign([], this.showTodos)
    },
    showBox (key, index) {
      this[key] = true
      this.currentSet = _.cloneDeep(this.sets[index])
      this.currentSetIndex = index
    },
    submitModifySet () {
      this.modifyTodoSet({
        set: this.currentSet,
        index: this.currentSetIndex
      })
      this.showBoxModifySet = false
    },
    submitAddTodo (todo) {
      this.currentSet.todos.push(todo)
      this.submitModifySet()
    }
  }
}
</script>

<style lang="less">
@import "../../styles/variable.less";
.list-todo-set {
  .todo-set-inner {
    color: @gray-d;
    border-left: 5px solid;
    border-bottom: 1px solid @gray-l-m;
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
    font-size: 20px;
  }

  .btn-option {
    margin-left: 20px;
  }
}
</style>
