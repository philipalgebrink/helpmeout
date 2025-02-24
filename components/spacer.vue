<template>  
    <div class="spacer"></div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.spacer {
    height: 10px;
    width: 100%;
    background: linear-gradient(to right, rgba(221, 101, 32, 0.5), transparent);
    margin: 10px 0;
    animation: fillSpacer var(--spacer-animation-duration, 1.5s) ease-out forwards;
}

@keyframes fillSpacer {
    from {
        width: 0;
    }
    to {
        width: 100%;
    }
}
</style>