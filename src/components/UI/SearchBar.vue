<template>
    <input :value="modelValue" @input="updateInput" class="search" type="text">
</template>

<script>
import inputMixin from "@/mixins/inputMixin"

export default {
  name: 'search-bar',
  mixins: [inputMixin]
}
</script>

<style scoped>
.search {
  width: 40%;
  border: 1px solid black;
  border-radius: 12px;
  padding: 5px 15px;
  font-size: large;
}
</style>
