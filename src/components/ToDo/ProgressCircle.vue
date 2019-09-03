<template>
  <div class="progress-bar-circle">
    <svg :style="{width:width+'px',height:width+'px'}">
      <circle
        :cx="radius"
        :cy="radius"
        :r="radius"
        fill="gray"
      />
    </svg>
    <svg :style="{width:width+'px',height:width+'px'}">
      <path
        :d="pathSector"
        fill="rgb(19, 206, 102)"
      />
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
      return `M ${this.centreX} ${this.centreY} L ${this.centreX} 0 A ${this.radius} ${this.radius} 0 0 1 ${endX} ${endY} Z`
    }
  },
  methods: {

  }
}
</script>

<style lang="less">
.progress-bar-circle {
  svg {
    // position: absolute;
  }
}
</style>
