<template>
  <ComPopup
    class="box-edit-text"
    :show.sync="showBoxText"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template v-slot:header-icon>
      <ComIcon
        name="pencil"
        @click="changeCanEdit"
      />
      <ComIcon
        name="check"
        @click="submit"
      />
    </template>
    <ComInput
      ref="inputExperience"
      v-model="experience"
      type="textarea"
      :disabled="disableEditExperience"
      :placeholder="inputExperiencePlaceHolder"
      autofocus
    />
  </ComPopup>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      showBoxText: this.show,
      experience: this.value,
      disableEditExperience: false,
      inputExperiencePlaceHolder: ''
    }
  },
  watch: {
    show (val) {
      this.showBoxText = val
    },
    value (val) {
      this.experience = val
    },
    showBoxText (val) {
      if (val) {
        this.disableEditExperience = Boolean(this.experience)
        this.inputExperiencePlaceHolder = this.experience
          ? ''
          : this.$t('todo.please_input_experience')
        this.$nextTick(() => {
          this.$refs.inputExperience.focus()
        })
      }
    },
    experience (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    submit () {
      this.showBoxText = false
      this.$emit('update:show', false)
      this.$emit('submit')
    },
    changeCanEdit () {
      this.disableEditExperience = false
      this.$nextTick(() => {
        this.$refs.inputExperience.focus()
      })
    }
  }
}
</script>

<style lang='less'>
.box-edit-text {
  .com-icon {
    font-size: 16px;
    margin-left: 20px;
  }

  .com-input__box {
    height: 300px;
  }
}
</style>
