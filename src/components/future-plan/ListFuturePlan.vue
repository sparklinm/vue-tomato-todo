<template>
  <div>
    <div class="future-plan-list">
      <div
        v-for="(plan,index) in plans"
        :key="plan.name"
        class="future-plan-item"
        @click="edit(index)"
      >
        <div class="left">
          <div
            class="hd"
            :class="{'have-completed':plan.completed}"
          >
            <span
              v-marquee
              class="hd-inline"
            >{{ plan.name }}</span>
          </div>
          <div
            v-ellipsis
            class="bd"
          >
            {{ plan.description }}
            <span v-if="plan.completed">({{ $t('word.completed') }})</span>
          </div>
        </div>
        <div class="right">
          <div
            class="hd"
          >
            <div
              class="hd-text"
              v-html="getPlanStatus(plan.creat)"
            />
          </div>
          <div class="bd">
            {{ dateFormatter(plan.creat,timePattern) }}
          </div>
        </div>
      </div>
    </div>
    <ComPopup
      class="box-edit box-edit-plan"
      :title="curPlan.name"
      :show.sync="showBoxInfo"
    >
      <div class="cells">
        <div class="cell">
          <div class="cell-bd ">
            <span
              v-if="!curPlan.completed"
              class="btn btn-small"
              @click="markCompleted"
            >{{ $t("plan.mark_completed") }}
            </span>
            <span
              v-else
              class="btn btn-small"
              @click="markIncomplete"
            >{{ $t("plan.mark_incomplete") }}
            </span>
            <span
              class="btn btn-small"
              @click="editPlan"
            >{{ $t("action.edit") }}
            </span>
            <span
              class="btn btn-small"
              @click="deletePlan"
            >{{ $t("action.delete") }}
            </span>
          </div>
        </div>
        <div class="cell btn">
          <div class="cell-footer">
            <div class="row">
              <div class="title">
                <span>1</span>
                <span>{{ $t("plan.creat_time") }}</span>
              </div>
              <span class="time">{{ dateFormatter(curPlan.creat,timePattern) }}</span>
            </div>
            <div class="row">
              <div class="title">
                <span>2</span>
                <span>{{ $t("plan.goal_deadline") }}</span>
              </div>
              <span class="time">{{ dateFormatter(curPlan.deadline,timePattern) }}</span>
            </div>

            <div class="status">
              <span v-html="getPlanStatus(curPlan.creat)" />
            </div>
          </div>
        </div>
      </div>
    </compopup>
    <BoxAddFuturePlan
      :show.sync="showBoxEditPlan"
      :data="curPlan"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import util from '../../js/util.js'
import BoxAddFuturePlan from './BoxAddFuturePlan'

export default {
  components: {
    BoxAddFuturePlan
  },
  data () {
    return {
      curPlan: {},
      showBoxInfo: false,
      timePattern: 'yyyy-MM-dd',
      showBoxEditPlan: false,
      tips: {
        delete: this.$t('message.confirm_delete')
      }
    }
  },
  computed: {
    ...mapState('plan', {
      plans: state => state.plans
    })
  },
  mounted () {
    this.curPlan = this.plans[0]
  },
  methods: {
    ...mapMutations('plan', {
      storeEditPlan: 'editPlan',
      storeDeletePlan: 'deletePlan'
    }),
    dateFormatter: util.dateFormatter.bind(util),
    getPlanStatus (creat) {
      if (!creat || !creat.getTime) {
        return
      }
      const oneDay = 24 * 60 * 60 * 1000
      const diffDay = Math.floor((new Date().getTime() - creat.getTime()) / oneDay)

      return this.$t('plan.have_passed_days', [`<span class="key">${diffDay}</span>`])
    },
    edit (index) {
      this.curPlan = this.plans[index]
      this.showBoxInfo = true
    },
    markCompleted () {
      this.editPlan({
        id: this.curPlan.id,
        completed: true
      })
      this.showBoxInfo = false
    },
    markIncomplete () {
      this.editPlan({
        id: this.curPlan.id,
        completed: false
      })
      this.showBoxInfo = false
    },
    editPlan () {
      this.showBoxEditPlan = true
      this.showBoxInfo = false
    },
    deletePlan () {
      this.$message({
        title: this.$t('word.tip'),
        content: this.tips.delete,
        options: {
          showCancel: true
        }
      }).then(() => {
        this.storeDeletePlan(this.curPlan.id)
        this.showBoxInfo = false
      })
    }
  }
}
</script>

<style lang='less'>
.future-plan-list {
  padding: 10px 12px;
}
.future-plan-item {
  padding: 12px 10px 12px 15px;
  margin-bottom: 10px;
  background-color: rgb(49, 159, 202);
  color: white;
  border-radius: 5px;
  box-shadow: 0 0 5px 0px @gray;
  font-size: 12px;
  .flex(@justify-content: space-between);

  .left {
    .flex(@flex-direction: column);
    margin-right: 0.5rem;

    .hd {
      font-size: 16px;
    }

    .bd {
      margin-top: 10px;
      font-size: 12px;
    }
  }

  .right {
    text-align: right;
    .flex(@justify-content: space-between; @flex-direction: column);
    flex: none;

    .hd {
      line-height: 1;
    }

    .bd {
      letter-spacing: 0;
    }
  }

  .key {
    margin: 0 3px;
    font-size: 20px;
  }
}

.box-edit-plan {
  .cell-footer {
    padding: 12px;
  }

  .key {
    margin: 0 3px;
    font-size: 20px;
  }

  .status {
    line-height: 1;
  }
}
</style>
