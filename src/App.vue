<template>
  <div id="app">
    <Waterfall />
  </div>
</template>

<script>
import Waterfall from './components/Waterfall.vue'

export default {
  name: 'App',
  components: {
    Waterfall
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
