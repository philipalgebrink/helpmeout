<template>
  <footer>
    <div class="footer-container">
      <p>Terms of Use | Privacy Policy | Cookie Consent Tool</p>
      <div class="footer-spacer"></div>
      <div class="footer-content">
        <span class="left-text">©Help Me Out</span>
        <span class="right-text">Filler</span>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
</script>

<style scoped>
footer {
  width: 800px;
  margin: 25px auto;
  height: 10vh;
}

.footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
}

.footer-spacer {
  width: 100%;
  height: 10px;
  background: radial-gradient(circle, rgba(221,101,32,1) 0%, rgba(255,255,255,0) 100%);
  margin: 10px 0;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
}

.left-text {
  text-align: left;
  letter-spacing: 2px;
}

.right-text {
  text-align: right;
}

h1 {
  font-size: 48px;
  margin: 0;
  text-align: center;
  flex: 2;
}

@media (max-width: 768px) {
  h1 {
    font-size: 32px;
  }

  .auth-button a {
    padding: 8px 16px;
    font-size: 14px;
  }
}
</style>
