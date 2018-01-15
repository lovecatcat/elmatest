<template>
    <div class="header">
      <div class="fn-left" @click="back">back</div>
      <p class="fn-left">{{title}}</p>

    </div>
</template>

<script>
  export default {
    name: 'header',
    props: ['title'],
    data() {
      return {
        aaa: ''
      }
    },
    methods: {
      back() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>

</style>
