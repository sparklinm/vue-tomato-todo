<template>
  <div class="list">
    <ListItem class="item">
      <template v-slot:progressBar>
        <ProgressCircle :width="20" />
      </template>
    </ListItem>
  </div>
</template>

<script>
import ListItem from './ListItem'
import ProgressCircle from './ProgressCircle'
export default {
  components: {
    ListItem,
    ProgressCircle
  },
  data () {
    return {

    }
  },
  computed: {

  },
  methods: {

  }
}
</script>

<style lang="less">
.list{
  padding: 0 15px;

  .item{
    margin-top: 5px;
  }
}

</style>
