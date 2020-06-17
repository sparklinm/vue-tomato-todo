<template>
  <div>
    <ComPopup
      class="box-add-plan"
      :title="data ? $t('plan.edit_future_plan') : $t('plan.add_future_plan')"
      :show="show"
      :submit="submitAddPlan"
      top-btn
      @closed="$emit('update:show',false)"
      @open="init"
    >
      <ComInput
        ref="input-name"
        v-model="plan.name"
        type="textarea"
        :placeholder="$t('plan.plan_name')"
        autofocus
        maxlength="30"
      />
      <ComInput
        ref="input-desc"
        v-model="plan.description"
        type="textarea"
        :placeholder="$t('plan.plan_description')"
        autofocus
        maxlength="30"
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
      value: new Date()
    }
  },
  computed: {
    deadlineView () {
      return util.dateFormatter(this.plan.deadline, 'yyyy-MM-dd') || this.$t('todo.set_goal_deadline')
    }
  },
  created () {
    if (this.data) {
      this.plan = this.data
    }

    this.value = new Date()
  },
  methods: {
    ...mapMutations('plan', ['addPlan', 'editPlan']),
    submitAddPlan (done) {
      const name = this.plan.name

      if (name === '') {
        this.$message({
          title: this.$t('word.tip'),
          content: this.$t('tips.not_empty_plan_name')
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

      if (this.data) {
        this.editPlan(this.plan)
        this.$emit('edited', this.plan)
      } else {
        this.plan.creat = new Date()
        this.addPlan(this.plan)
      }
      done()
    },
    init () {
      if (this.data) {
        this.plan = _cloneDeep(this.data)
        this.value = this.plan.deadline
        return
      }
      this.plan = {
        name: '',
        description: '',
        deadline: ''
      }
      this.value = new Date()
    },
    setGoalDeadline (done) {
      this.plan.deadline = this.value
      done()
    },
    cancelSetGoalDeadline (done) {
      this.value = this.plan.deadline || new Date()
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
