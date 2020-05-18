<template>
  <ComPopup
    :show.sync="curShow"
    :z-index="3000"
    no-header
    @close="handleClose"
    @closed="$emit('closed', curValue)"
  >
    <div class="radio-list">
      <div
        v-if="title"
        class="radio-list__title"
      >
        {{ title }}
      </div>
      <ul class="radio-list__inline">
        <ComGroup
          v-model="curValue"
          @change="handleChange"
        >
          <li
            v-for="(item, index) in data"
            :key="index"
            class="radio-list__item"
            :style="{ 'background-image': `url(${item.backgroundImg})` }"
          >
            <ComRadio
              :label="item.value"
              :content="item.text"
              type="custom"
              :name="name"
            />
          </li>
        </ComGroup>
      </ul>
    </div>
  </ComPopup>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number, Object, Array],
      default: 0
    },
    data: {
      type: Array,
      default: () => []
    },
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'name'
    },
    hideOnSelect: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      curValue: this.value,
      curShow: this.show
    }
  },
  watch: {
    show (val) {
      this.curShow = val
    },
    value (val) {
      this.curValue = val
    }
  },
  methods: {
    handleChange (val) {
      if (this.hideOnSelect) {
        this.curShow = false
      }
      this.$emit('input', val)
      this.$emit('change', val)
    },
    handleClose () {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="less">
.radio-list {
  max-height: 300px;
  overflow-y: scroll;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */

  &::-webkit-scrollbar {
    display: none;
  }

  .custom-radio__text {
    font-size: 12px;
    padding: 0;
  }

  .custom-radio__icon {
    margin-right: 20px;
  }

  .custom-radio {
    display: inline-block;
    width: 100%;
    padding: 8px 0;
  }
}

.radio-list__title {
  font-size: 14px;
  margin-bottom: 10px;
}

.radio-list__inline {
}

.radio-list__item {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 50% 50%;
}

.radio-list__item:first-child {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
}

.radio-list__item:last-child {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
</style>
