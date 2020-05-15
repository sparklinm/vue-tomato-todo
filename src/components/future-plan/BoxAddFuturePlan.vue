<template>
  <div>
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
      <div class="btn-set-deadline">
        <span
          class="set-deadline-text"
          @click="showDatePicker=true"
        >
          {{ deadlineView }}
        </span>
      </div>
    </ComPopup>
    <DatePicker
      v-model="value"
      :submit="setGoalDeadline"
      :cancel="cancelSetGoalDeadline"
      type="date"
      :show.sync="showDatePicker"
    />
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import util from '@/js/util.js'
import DatePicker from '@/components/DatePicker'

export default {
  components: {
    DatePicker
  },
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
        description: '',
        deadline: ''
      },
      showDatePicker: false,
      value: []
    }
  },
  computed: {
    deadlineView () {
      return util.dateFormatter(this.plan.deadline, 'yyyy-MM-dd') || this.$t('todo.set_goal_deadline')
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

    const date = new Date()

    this.value = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
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
    },
    setGoalDeadline (done) {
      this.plan.deadline = new Date(this.value[0], this.value[1] - 1, this.value[2])
      done()
    },
    cancelSetGoalDeadline (done) {
      const date = this.plan.deadline || new Date()

      this.value = [date.getFullYear(), date.getMonth() + 1, date.getDate()]
      done()
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

  .btn-set-deadline {
    margin-top: 5px;
    text-align: center;
  }

  .set-deadline-text {
    display: inline-block;
    background: #fde0d4;
    color: #ca4b19;
    border-radius: 5px;
    padding: 5px;
  }
}

</style>
