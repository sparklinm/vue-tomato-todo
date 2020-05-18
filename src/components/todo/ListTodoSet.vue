<template>
  <ComList
    id="container"
    ref="container"
    class="list-todo-set"
  >
    <div
      v-for="(item, index) in sets"
      :key="index"
      class="todo-set"
    >
      <ComCell
        ref="todoSets"
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
          <ComToolTip ref="listStatistics">
            <ComIcon
              name="pie-chart"
              class="btn-option"
            />
            <template v-slot:content>
              <div class="drop-list_simple">
                <ul>
                  <li @click="toStatistics(item,index)">
                    {{ $t('todo.view_todo_set_statistics') }}
                  </li>
                  <li @click="toStatistics('all',index)">
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
          <div class="set-btn-groups">
            <div class="btn-pencil color-btn">
              <ComIcon
                name="pencil"
                class="color-btn-inner"
                @click="editSet(item)"
              />
            </div>
            <div class="btn-delete color-btn">
              <ComIcon
                name="trash"
                class="color-btn-inner"
                @click="deleteSet(item)"
              />
            </div>
          </div>
        </template>
      </ComCell>
      <ListTodo
        v-show="showTodos[index]"
        :todos="setTodos[index]"
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
        type="positiveInteger"
        :placeholder="$t('todo.set_complete_one_restime')"
        autofocus
      />
      <ComInput
        v-model="currentSet.resetTimeAll"
        type="positiveInteger"
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

    <BoxAddTodoSet
      :show.sync="showBoxEditSet"
      :data="currentSet"
    />
  </ComList>
</template>

<script>
import ListTodo from './ListTodo'
import BoxAddTodo from './add/BoxAddTodo'
import BoxSortTodo from '@/components/todo/BoxSortTodo'
import BoxAddTodoSet from '@/components/todo/add/BoxAddTodoSet'
import { mapState, mapGetters, mapMutations } from 'vuex'
import Touch from '@/js/Touch.js'

export default {
  components: {
    ListTodo,
    BoxAddTodo,
    BoxSortTodo,
    BoxAddTodoSet
  },
  data () {
    return {
      showTodos: [false, false],
      showBoxAddTodo: false,
      showBoxModifySet: false,
      currentSet: {
        name: 'default'
      },
      showBoxSort: false,
      setClass: {
        'todo-set_opaque': true
      },
      showBoxEditSet: false,
      translateX: [],
      touchs: []
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
    }),
    setTodos () {
      return this.sets.map(set => {
        return this.getTodosBySet(set.id)
      })
    }
  },
  watch: {
    showBoxSortSet (val) {
      this.showBoxSort = val
    },
    showBoxSort (val) {
      this.setShowBoxSortSet(val)
    },
    sets () {
      this.addEvent()
    }
  },
  mounted () {
    this.currentSet = _.cloneDeep(this.sets[0])
    if (this.appearance.todoSetOpacity === 'opaque') {
      this.setClass = {
        'todo-set_opaque': true
      }
    } else {
      this.setClass = {
        'todo-set_translucent': true
      }
    }

    this.addEvent()
  },
  methods: {
    ...mapMutations('todo', [
      'modifyTodoSet',
      'setTodoSets',
      'setShowBoxSortSet',
      'deleteTodoSet',
      'addTodo'
    ]),
    setShowTodos (index, isShow) {
      if (typeof isShow === 'undefined') {
        this.showTodos[index] = !this.showTodos[index]
      } else {
        this.showTodos[index] = isShow
      }
      this.showTodos = Object.assign([], this.showTodos)
      this.resetPos()
    },
    addEvent () {
      this.$nextTick(() => {
        this.resetPos()
        this.translateX.length = this.touchs.length = this.$refs.todoSets.length
        this.$refs.todoSets.forEach((item, index) => {
          const el = item.$el

          if (this.touchs[index]) {
            if (this.touchs[index].event) {
              this.touchs[index].event.destroy()
            }
            el.removeEventListener('slidemove', this.touchs[index].moveFun)
            el.removeEventListener('slideend', this.touchs[index].endFun)
          }

          this.touchs[index] = {}
          this.touchs[index].event = new Touch(el)
          this.translateX[index] = 0

          const move = (e) => {
            const dx = e.detail.dx

            this.translateX[index] += dx
            if (this.translateX[index] > 0) {
              this.translateX[index] = 0
            }
            if (this.translateX[index] < -92) {
              this.translateX[index] = -92
            }
            el.style.transform = `translateX(${this.translateX[index]}px)`
          }
          const end = () => {
            if (this.translateX[index] > -92) {
              el.style.transform = `translateX(${0}px)`
              el.style.transition = 'transform 0.2s ease'

              setTimeout(() => {
                el.style.transition = 'none'
                this.translateX[index] = 0
              }, 200)
            }
          }

          this.touchs[index].moveFun = move
          this.touchs[index].endFun = end

          el.addEventListener('slidemove', move)
          el.addEventListener('slideend', end)
        })
      })
    },
    resetPos () {
      this.translateX.forEach((item, index) => {
        if (item !== 0) {
          this.translateX[index] = 0
          this.$refs.todoSets[index].$el.style.transform = `translateX(${this.translateX[index]}px)`
        }
      })
    },
    showBox (key, index) {
      this[key] = true
      this.currentSet = _.cloneDeep(this.sets[index])
      if (key === 'showBoxAddTodo') {
        this.resetPos()
      }
    },
    submitModifySet () {
      this.modifyTodoSet(
        this.currentSet
      )
      this.showBoxModifySet = false
    },
    submitAddTodo (todo) {
      todo.sid = this.currentSet.id
      this.addTodo(todo)
    },
    submitSort (data) {
      this.setTodoSets(data)
    },
    toStatistics (item, index) {
      this.$refs.listStatistics[index].remove()
      if (item === 'all') {
        this.$router.push({
          path: '/statistics/all',
          query: {
            type: 'todo'
          }
        })
        return
      }
      this.$router.push({
        path: `/statistics/${item.id}`,
        query: {
          type: 'set'
        }
      })
    },
    editSet (item) {
      this.currentSet = _.cloneDeep(item)
      this.showBoxEditSet = true
      this.resetPos()
    },
    deleteSet (item) {
      this.$message({
        title: this.$t('message.confirm_delete'),
        content: this.$t('message.delete_set', [item.name]),
        options: {
          showCancel: true
        }
      }).then(() => {
        this.deleteTodoSet(item.id)
        this.resetPos()
      })
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
      }
    }

    .list-item .left .card {
      margin-top: 8px;
    }

    .list-item .right .btn-start {
      font-size: 14px;
    }

    .list-item .right {
    }
  }
}

.todo-set-inner {
  position: relative;

  .com-cell__hd {
    font-size: 18px;
  }

  .com-icon{
    font-size: 20px;
  }

  .btn-option {
    margin-left: 20px;
  }

  .set-btn-groups {
    display: inline-block;
    height: 100%;
    position: absolute;
    right: 0;
    transform: translateX(92px);
    top: 0;
  }

  .color-btn {
    display: inline-block;
    height: 100%;
    color: white;
    width: 46px;
    text-align: center;
  }

  .color-btn::after {
    content: '';
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }

  .color-btn-inner {
    vertical-align: middle;
    font-size: 16px;
  }

  .btn-pencil {
    background: rgb(0, 122, 179);
    border-bottom: 1px solid rgb(0, 122, 179);
  }

  .btn-delete {
    background: rgb(255, 135, 23);
    border-bottom: 1px solid rgb(255, 135, 23);
  }
}
</style>
