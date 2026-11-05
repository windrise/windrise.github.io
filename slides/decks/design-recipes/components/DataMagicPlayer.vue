<script setup>
import { useIsSlideActive } from '@slidev/client'
import DataMagicPlayer from '../../../recipes/DataMagicPlayer.vue'
const active = useIsSlideActive()
</script>
<template><DataMagicPlayer v-bind="$attrs" :active="active" /></template>
