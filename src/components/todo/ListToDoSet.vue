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
        @click.native.self="setShowToDos(index)"
      >
        <template v-slot:right-icon>
          <ComIcon
            v-show="!showToDos[index]"
            name="chevron-right"
            class="btn-option"
            @click="setShowToDos(index, true)"
          />
          <ComIcon
            v-show="showToDos[index]"
            name="chevron-down"
            class="btn-option"
            @click="setShowToDos(index, false)"
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
                    查看此待办集的统计数据
                  </li>
                  <li>
                    查看按待办集名称分类的全部数据
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
            @click="showBox('showBoxAddToDo',index)"
          />
        </template>
      </ComCell>
      <ListToDo
        v-show="showToDos[index]"
        :todos="item.todos"
        class="list-set-todo"
      />
    </div>
    <BoxAddToDo
      v-if="showBoxAddToDo"
      :show.sync="showBoxAddToDo"
      @submit="submitAddToDo"
    />
    <ComPopup
      class="box-set-settings"
      no-header
      :show.sync="showBoxModifySet"
    >
      <ComInput
        v-model="currentSet.resetTimeSingle"
        type="number"
        placeholder="设置完成单个待办后休息时间"
        autofocus
      />
      <ComInput
        v-model="currentSet.resetTimeAll"
        type="number"
        placeholder="设置全部完成后的长休息时间"
        autofocus
      />
      <div class="checkbox-container">
        <ComCheckBox
          v-model="currentSet.continuousExcute"
          left
          content="连续执行待办"
          class="set-setting-checkbox"
        />
      </div>
      <div class="tip-setting">
        *仅支持倒计时的连续执行，不支持正计时
      </div>
      <template v-slot:footer>
        <button
          class="com-popup__footer-btn"
          @click="submitModifySet"
        >
          确定
        </button>
        <button
          class="com-popup__footer-btn"
          @click="showBoxModifySet=false"
        >
          取消
        </button>
      </template>
    </ComPopup>
  </ComList>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import ListToDo from './ListToDo'
import BoxAddToDo from './add/BoxAddToDo'
export default {
  components: {
    ListToDo,
    BoxAddToDo
  },
  data () {
    return {
      showToDos: [false, false],
      showBoxAddToDo: false,
      showBoxModifySet: false,
      currentSet: {},
      currentSetIndex: 0
    }
  },
  computed: {
    ...mapState({
      sets: state => state.todoSets
    })
  },
  methods: {
    ...mapMutations(['modifyToDoSet']),
    setShowToDos (index, isShow) {
      if (typeof isShow === 'undefined') {
        this.showToDos[index] = !this.showToDos[index]
      } else {
        this.showToDos[index] = isShow
      }
      this.showToDos = Object.assign([], this.showToDos)
    },
    showBox (key, index) {
      this[key] = true
      this.currentSet = _.cloneDeep(this.sets[index])
      this.currentSetIndex = index
    },
    submitModifySet () {
      this.modifyToDoSet({
        set: this.currentSet,
        index: this.currentSetIndex
      })
      this.showBoxModifySet = false
    },
    submitAddToDo (todo) {
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
