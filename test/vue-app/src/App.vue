<template>
  <div id="app">
    <ao-input
      type="tel"
      value="183720394 483"
      label="American phone"
    ></ao-input>
    <ao-input
      type="tel"
      value="358505750907"
      label="Finnish phone"
      v-on:format-value="myFormatPhone"
    ></ao-input>
  </div>
</template>

<script>

export default {
  name: "App",
  methods: {
    myFormatPhone: function (e) {
      const input = e.target;
      
      // Clean and leave the numbers only
      const valueClean = input.value.replace(/[^0-9]/g, '');

      // Format
      const newValue = valueClean.replace(/(\d{1,3})(\d{1,2})?(\d{1,3})?(\d{1,4})?/, function(_, p1, p2, p3, p4){
        let output = "";
        if (p1) output += `+${p1}`;
        if (p2) output += ` (${p2}`;
        if (p3) output += `) ${p3}`
        if (p4) output += `-${p4}`
        return output;
      });
      input.value = newValue;
    },
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
