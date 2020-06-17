<template>
  <ComPopup
    class="box-add-set"
    title="增加待办集"
    :show="show"
    bottom-confirm-btn
    :submit="submitAddSet"
    @closed="handleClosed"
  >
    <ComInput
      ref="input-name"
      v-model="todoSet.name"
      type="textarea"
      placeholder="请输入待办集名称"
      autofocus
      maxlength="30"
    />
    <div class="colors">
      <label
        v-for="(color,index) in colors"
        :key="color"
      >
        <input
          v-model="todoSet.background"
          type="radio"
          name="color"
          :value="color"
        >
        <span
          class="color-sample"
          :style="{background:color}"
          @click="selectColor(index)"
        />
      </label>
    </div>
  </ComPopup>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      todoSet: {
        name: '',
        background: '',
        resetTimeSingle: '',
        resetTimeAll: '',
        continuousExcute: false
      },
      colors: ['#0000FF', '#FFFFCC', '#336699', '#CCFFFF', '#003366', '#FFCCCC', '#CC3333']
    }
  },
  computed: {
    ...mapState('todo', {
      sets: state => state.todoSets
    })
  },
  watch: {
    data () {
      this.initSet()
    }
  },
  created () {
    this.initSet()
  },
  methods: {
    ...mapMutations('todo', ['addTodoSet', 'modifyTodoSet']),
    initSet () {
      if (this.data) {
        this.todoSet = _cloneDeep(this.data)
      }
    },
    selectColor (index) {
      this.todoSet.background = this.colors[index]
    },
    submitAddSet (done) {
      const { name, id } = this.todoSet

      if (name === '') {
        this.$message({
          title: this.$t('word.tip'),
          content: this.$t('tips.not_empty_set_name')
        })
        return
      }

      if (name.length > 30) {
        this.$message({
          title: this.$t('word.tip'),
          content: this.$t('tips.name_length')
        })
        return
      }

      const hasSameName = this.sets.some(set => {
        if (id >= 0) {
          if (id !== set.id) {
            return set.name === name
          }
          return false
        }

        return set.name === name
      })

      if (hasSameName) {
        this.$message({
          title: this.$t('word.tip'),
          content: this.$t('tips.already_has_same_set')
        })
        return
      }

      if (this.data) {
        this.modifyTodoSet(this.todoSet)
      } else {
        this.addTodoSet(this.todoSet)
      }
      done()
    },
    handleClosed () {
      this.todoSet = {
        name: '',
        background: ''
      }
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang='less'>
.box-add-set {
  .com-popup__header {
    padding: 25px 20px;
    font-size: 18px;
  }

  .com-input {
    padding: 15px 30px;
    font-size: 18px
  }

  .colors {
    margin-top: 12px;

    input[type='radio'] {
      width: 0;
    }

    input[type='radio']:checked + span {
      transform: scaleY(1.2);
      transform-origin: 50% 50%;
    }
  }

  .color-sample {
    display: inline-block;
    width: 40px;
    height: 40px;
  }
}

</style>
