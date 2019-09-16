<template>
  <div
    class="progress-bar-circle"
    :style="{width:width+'px',height:width+'px'}"
  >
    <svg>
      <circle
        :cx="centreX"
        :cy="centreY"
        :r="radius"
        fill="gray"
      />
      <path
        :d="pathSector"
        fill="rgb(19, 206, 102)"
      />
      <text
        :x="centreX"
        :y="centreY"
        fill="white"
        style="font-size:8px;dominant-baseline:middle;text-anchor:middle;"
      >{{ progress }}%</text>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      default: 100
    },
    progress: {
      type: Number,
      default: 60
    }
  },
  data () {
    return {

    }
  },
  computed: {
    radius () {
      return this.width / 2
    },
    centreX () {
      return this.width / 2
    },
    centreY () {
      return this.width / 2
    },
    pathSector () {
      const angle = this.progress / 100 * Math.PI * 2
      const endX = Math.sin(angle) * this.radius + this.centreX
      const endY = this.centreY - Math.cos(angle) * this.radius
      // 决定弧线是大角度还是小角度
      const largeArcFlag = angle > Math.PI ? 1 : 0
      return `M ${this.centreX} ${this.centreY} L ${this.centreX} 0 A ${this.radius} ${this.radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`
    }
  },
  methods: {

  }
}
</script>

<style lang="less">
.progress-bar-circle {
  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
