<template>
  <ComPopup
    class="box-add-plan"
    :title="data ? $t('plan.edit_future_plan') : $t('plan.add_future_plan')"
    :show="show"
    :submit="submitAddPlan"
    top-btn
    @closed="reset"
  >
    <ComInput
      ref="input-name"
      v-model="plan.name"
      type="textarea"
      :placeholder="$t('plan.plan_name')"
      autofocus
    />
    <ComInput
      ref="input-desc"
      v-model="plan.description"
      type="textarea"
      :placeholder="$t('plan.plan_description')"
      autofocus
    />
  </ComPopup>
</template>

<script>
import { mapMutations } from 'vuex'

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
      plan: {
        name: '',
        description: ''
      }
    }
  },
  watch: {
    data (val) {
      this.plan = _.cloneDeep(val)
    }
  },
  created () {
    if (this.data) {
      this.plan = this.data
    }
  },
  methods: {
    ...mapMutations('plan', ['addPlan', 'editPlan']),
    submitAddPlan (done) {
      if (this.data) {
        this.editPlan(this.plan)
      } else {
        this.plan.creat = new Date()
        this.addPlan(this.plan)
      }
      done()
    },
    reset () {
      this.plan = {
        name: '',
        description: ''
      }
      this.$emit('update:show', false)
      this.$emit('closed')
    }
  }
}
</script>

<style lang='less'>
.box-add-plan {
  .com-popup__header {
    padding: 15px 18px;
    font-size: 16px;
  }

  .com-popup__content {
    padding: 10px 20px 8px;
  }

  .com-input {
    padding: 15px 30px;
    font-size: 16px
  }
}

</style>
