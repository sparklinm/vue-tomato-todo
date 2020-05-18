<template>
  <div
    class="list-item"
    @click="edit"
  >
    <div
      class="list-item-shadow"
    />
    <div class="left">
      <div
        class="name"
        style=""
      >
        <span
          class="name-inline"
        >
          {{ name }}
          <div
            v-if="completedTime"
            class="line-through"
          />
        </span>
      </div>
      <div class="card">
        <span class="description">{{ description }}</span>
        <ul class="progress">
          <li>
            <slot name="progressBar" />
          </li>
          <li class="progress-text">
            {{ progress }}
          </li>
        </ul>
      </div>
    </div>
    <div class="right">
      <span class="deadline">{{ deadline }}</span>
      <span
        id="btn-start"
        class="btn-start"
        @click="$emit('start')"
      >{{ $t('action.start') }}</span>
      <span class="completed-times">{{ completedTimes }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    progress: {
      type: String,
      default: ''
    },
    deadline: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    completedTimes: {
      type: String,
      default: ''
    },
    completedTime: {
      type: Date,
      default: null
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  mounted () {},
  methods: {
    edit () {
      if (event.target.id !== 'btn-start') {
        this.$emit('edit')
      }
    }
  }
}
</script>

<style lang="less">
.list-item {
  background-color: rgb(49, 159, 202);
  background-image: url('');
  background-size: 100% 100%;
  color: white;
  border-radius: 5px;
  box-shadow: 0 0 5px 0px @gray;
  position: relative;
  transition: background-color 0.2s ease, background-image 0.2s ease;
  .flex(@justify-content: space-between);

  // .list-item-shadow {
  //   position: absolute;
  //   background: rgba(0, 0, 0, 0.2);
  //   width: 100%;
  //   height: 100%;
  //   left: 0;
  // }

  .name-inline {
    display: inline-block;
    position: relative;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 4.4rem;
  }

  .left {
     padding: 0.24rem 0rem 0.16rem 0.4rem;
    .flex(@flex-direction: column);
    flex-grow: 1;
    margin-right: 1rem;

    .content {
      margin-top: 0.3rem;
      font-size: 0.24rem;
      opacity: 0.8;
    }

    .card {
      margin-top: 0.24rem;
      font-size: 12px;
      .flex(@align-items: center);

      .description {
        transform-origin: left center;
        transform: scale(0.8);
      }

      .progress {
        list-style: none;
        margin: 0;
        padding-left: 0.3rem;
        .flex(@align-items: center);

        li {
          margin-right: 0.08rem;
        }

        .progress-text {
          font-size: 12px;
          transform: scale(0.7);
          transform-origin: left center;
        }
      }
    }
  }

  .right {
    position: relative;
    width: 90px;
    padding: 12px 0px 8px 0px;
    flex-shrink: 0;
    text-align: center;

    .deadline {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      font-size: 12px;
      letter-spacing: 1px;
      white-space: nowrap;
    }

    .btn-start {
      font-size: 16px;
      position: absolute;
      top: 50%;
      left: 50%;
      padding: 5px;
      transform: translate(-50%, -50%);
      white-space: nowrap;
    }

    .completed-times {
      position: absolute;
      bottom: 5px;
      font-size: 12px;
      transform: translateX(-50%) scale(0.8);
      letter-spacing: 0px;
      white-space: nowrap;
    }
  }
}
</style>
