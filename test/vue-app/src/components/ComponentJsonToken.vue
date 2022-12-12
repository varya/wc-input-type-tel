<template>
  <div :style="compStyles">
    <ao-button>{{ msg }}</ao-button>
  </div>
</template>


<script>
import colors from "../../../../dist/tokens/colors.json";
import spacing from "../../../../dist/tokens/spacing.json";


export default {
  name: 'ComponentJsonToken',
  props: {
    msg: String
  },
  computed: {
    compStyles() {
      return {
        "background-color": colors.Data.Risk.Medium.value,
        "padding": spacing[8].value,
      };
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.custom-component {

}
</style>