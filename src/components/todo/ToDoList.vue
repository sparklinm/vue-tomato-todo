<template>
  <div class="list test">
    <ListItem>
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

<style>


</style>
