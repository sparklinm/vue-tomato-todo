<template>
  <div
    v-show="show"
    ref="box"
    class="box-wrap"
    @click.self="cancel"
  >
    <PopUp>
      <div
        v-show="show"
        class="com-popup-box"
      >
        <div class="title background-color-20">
          <div class="text">
            {{ title }}
          </div>
          <div
            v-if="topOptionBtn"
            class="btn-option-top"
          >
            <span>
              <i
                class="fa fa-check"
                aria-hidden="true"
                @click="submit"
              />
            </span>
            <span>
              <i
                class="fa fa-times"
                aria-hidden="true"
                @click="cancel"
              />
            </span>
          </div>
        </div>

        <div class="content">
          <slot name="content" />
        </div>
        <div
          v-if="bottomConfirmBtn"
          class="footer"
        >
          <button
            class="btn-confirm font-color-base-10"
            @click="submit"
          >
            确定
          </button>
        </div>
      </div>
    </PopUp>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    topOptionBtn: {
      type: Boolean,
      default: false
    },
    bottomConfirmBtn: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: true
    },
    animationed: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {

    }
  },
  watch: {
    show (val) {
      this.$mask(val)
    }
  },
  mounted () {
    console.log(this.show)

    this.$mask(this.show)
  },
  methods: {
    submit () {
      this.$emit('submit')
    },
    cancel () {
      this.$emit('update:show', false)
      this.$emit('cancel')
    }
  }
}
</script>

<style lang='less'>
.com-popup-box {
  width: 6.5rem;
  position: fixed;
  z-index: 150;
  background-color: white;
  .center-position();

  .title {
    color: white;
    .flex(@align-items: center; @justify-content: space-between);
    font-size: 16px;
    padding: 15px 15px;

    .btn-option-top {
      .flex(@align-items: center);

      span {
        &:first-child {
          margin-right: 15px;
        }
      }
    }
  }

  .content {
    padding: 10px 15px 8px;
  }
  .footer {
    padding: 0 5px;
    margin: 5px 0 10px;

    .btn-confirm {
      width: 100%;
      height: 30px;
      font-size: 14px;
      letter-spacing: 1px;
      border: none;
      background: white;
      box-shadow: 0 2px 1px 1px rgb(238, 238, 238);
      cursor: pointer;
      outline: none;
    }
  }
}
</style>
