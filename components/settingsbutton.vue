<template>
    <div class="settingsButton">
        <NuxtLink>
            <img src="https://www.freeiconspng.com/uploads/options-icon-30.png" alt="settings" />
        </NuxtLink>
    </div>
</template>

<script lang="ts" setup>

</script>

<style>
.settingsButton {
    display: flex;
    justify-content: end;
    width: 32px;
    height: 32px;
    background-color: black;
    border-radius: 0 0 0 10px;
}

.settingsButton img {
    width: 32px;
    height: 32px;
    filter: invert(1);
 }
</style>