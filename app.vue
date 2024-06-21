<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>

<script lang="ts" setup>
import { UserDto } from '#utils/dtos/index';

console.log("Shared between server and client", UserDto)
</script>