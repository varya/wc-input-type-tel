<template>
  <div class="custom-component">
    <ao-button>{{ msg }}</ao-button>
  </div>
</template>

<script>
export default {
  name: 'CustomComponent',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.custom-component {
  background-color: var(--color-data-risk-medium);
  padding: var(--spacing-8);
}
</style>
