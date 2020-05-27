<template>
  <ComPopup
    :title="$t('todo.long_press_drag_sort')"
    class="box-sort"
    :show.sync="showBoxSort"
    :z-index="2050"
    top-btn
    :submit="submitSort"
    @opened="initSort"
    @closed="handleClosed"
  >
    <template v-slot:header-icon>
      <span class="btn-header">
        <i
          aria-hidden="true"
          class="fa fa-question-circle"
          @click="$message(description.sortTodo)"
        />
      </span>
    </template>
    <ComList ref="sortContainer">
      <ComCell
        v-for="(item, index) in curData"
        :id="'item' + index"
        :key="item.name + Math.random()"
        ref="sortCell"
        :title="item.name"
        class="sort-cell"
      >
        <template v-slot:right-icon>
          <i
            :id="'item' + index"
            class="fa fa-trash delete-icon"
            aria-hidden="true"
            draggable="true"
            @click="deleteItem(index)"
          />
        </template>
      </ComCell>
    </ComList>
  </ComPopup>
</template>

<script>
import Sorter from '@/sort.js'

export default {
  props: {
    data: {
      type: Array,
      default: () => ([])
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      curData: _.cloneDeep(this.data),
      showBoxSort: this.show,
      sorter: null,
      description: {
        sortTodo: {
          title: this.$t('word.help'),
          content: this.$t('message.sort_todo')
        }
      }
    }
  },
  watch: {
    data (val) {
      this.curData = _.cloneDeep(val)
    },
    show (val) {
      this.showBoxSort = val
    }
  },
  methods: {
    submitSort () {
      if (this.sorter) {
        this.$emit('submit', this.sorter.getData())
      }
      this.showBoxSort = false
    },
    initSort () {
      if (this.sorter) {
        this.sorter.destroy()
      }

      this.sorter = new Sorter(this.$refs.sortContainer.$el, {}, this.curData)
      this.sorter.init()
    },
    deleteItem (index) {
      this.curData.splice(index, 1)
      this.$nextTick(() => {
        this.initSort()
      })
    },
    handleClosed () {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang='less'>
#item1 {
  height: 80px;
}

</style>
