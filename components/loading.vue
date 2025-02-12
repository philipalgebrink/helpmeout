<template>
  <div class="loading-container">
    <div class="spinner"></div>
  </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.loading-container {
  height: 245px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
}

.spinner {
  border: 16px solid #313131;
  border-top: 16px ridge rgba(221, 101, 32, 1);
  border-radius: 50%;
  width: 120px;
  height: 120px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>