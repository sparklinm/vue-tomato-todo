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
        :class="setClass"
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
        in-set
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

    <BoxSortTodo
      :data="sets"
      :show.sync="showBoxSort"
      @submit="submitSort"
    />
  </ComList>
</template>

<script>
import ListTodo from './ListTodo'
import BoxAddTodo from './add/BoxAddTodo'
import BoxSortTodo from '@/components/todo/BoxSortTodo'
import { mapState, mapGetters, mapMutations } from 'vuex'

export default {
  components: {
    ListTodo,
    BoxAddTodo,
    BoxSortTodo
  },
  data () {
    return {
      showTodos: [false, false],
      showBoxAddTodo: false,
      showBoxModifySet: false,
      currentSet: {},
      currentSetIndex: 0,
      showBoxSort: false,
      setClass: {
        'todo-set_opaque': true
      }
    }
  },
  computed: {
    ...mapState('todo', {
      sets: state => state.todoSets,
      showBoxSortSet: 'showBoxSortSet'
    }),
    ...mapState('settings', {
      appearance: 'appearance'
    }),
    ...mapGetters('todo', {
      getTodosBySet: 'getTodosBySet'
    })
  },
  watch: {
    showBoxSortSet (val) {
      this.showBoxSort = val
    },
    showBoxSort (val) {
      this.setShowBoxSortSet(val)
    }
  },
  mounted () {
    if (this.appearance.todoSetOpacity === 'opaque') {
      this.setClass = {
        'todo-set_opaque': true
      }
    } else {
      this.setClass = {
        'todo-set_translucent': true
      }
    }
  },
  methods: {
    ...mapMutations('todo', ['modifyTodoSet', 'setTodoSets', 'setShowBoxSortSet']),
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
    },
    submitSort (data) {
      this.setTodoSets(data)
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

  .todo-set_opaque {
    background: white;
  }

  .todo-set_translucent {
    background: rgba(255, 255, 255,0.65);
  }

  .list-set-todo {
    padding:3px 5px;

    .list-item {
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
