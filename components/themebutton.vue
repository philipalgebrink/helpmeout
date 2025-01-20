<template>  
    <select v-model="$colorMode.preference">
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
</template>

<script lang="ts" setup>


</script>

<style>

.themeselect {
  position: fixed;
  top: 0;
  right: 0;
  padding: 0.5rem;
  font-size: 1rem;
  border: none;
  background: none;
  color: var(--color-text);
  cursor: pointer;
}

.themeselect option {
  color: black;
}

</style>