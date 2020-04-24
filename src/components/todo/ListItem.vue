<template>
  <div
    class="list-item"
    @click="edit"
  >
    <div class="left">
      <div class="name">
        {{ name }}
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
  background-size: 100% 100%;
  color: white;
  border-radius: 5px;
  box-shadow: 0 0 5px 0px @gray;
  .flex(@justify-content: space-between);

  .left {
     padding: 12px 0px 8px 20px;
    .flex(@flex-direction: column);
    flex-grow: 1;

    .content {
      margin-top: 15px;
      font-size: 12px;
      opacity: 0.8;
    }

    .card {
      margin-top: 12px;
      font-size: 10px;
      .flex(@align-items: center);

      .description {
        transform-origin: left center;
        transform: scale(0.8);
      }

      .progress {
        list-style: none;
        margin: 0;
        padding-left: 15px;
        .flex(@align-items: center);

        li {
          margin-right: 4px;
        }

        .progress-text {
          font-size: 10px;
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

    .deadline {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      font-size: 10px;
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
  }
}
</style>
