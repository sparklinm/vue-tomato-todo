<template>
  <ComPopup
    class="box-add-set"
    title="增加待办集"
    :show="show"
    bottom-confirm-btn
    :submit="submitAddSet"
    @closed="$emit('update:show',false)"
  >
    <ComInput
      ref="input-name"
      v-model="todoSet.name"
      type="textarea"
      placeholder="请输入待办集名称"
      autofocus
    />
    <div class="colors">
      <label
        v-for="(color,index) in colors"
        :key="color"
      >
        <input
          type="radio"
          name="color"
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
import { mapMutations } from 'vuex'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      todoSet: {
        name: '',
        background: ''
      },
      colors: ['#0000FF', '#FFFFCC', '#336699', '#CCFFFF', '#003366', '#FFCCCC', '#CC3333']
    }
  },
  methods: {
    ...mapMutations(['addToDoSet']),
    selectColor (index) {
      this.todoSet.background = this.colors[index]
    },
    submitAddSet (done) {
      this.todoSet.todos = []
      this.addToDoSet(this.todoSet)
      done()
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

  .com-input__placeholder {
    color: b
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
