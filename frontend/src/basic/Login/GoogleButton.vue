<script setup lang="ts">
interface Emits {
  (event: 'clickGoogleButton'): void
}

const emit = defineEmits<Emits>()

interface Props {
  text: string
}

defineProps<Props>()

const clickGoogleButton = (): void => {
  emit('clickGoogleButton')
}
</script>

<template>
  <v-btn class="justify-start" @click="clickGoogleButton" width="100%">
    <v-avatar size="24">
      <img src="@/assets/google.png" class="button" />
    </v-avatar>
    <p class="ms-2">
      {{ text }}
    </p>
  </v-btn>
</template>

<style scoped>
.button {
  height: 100%;
  widows: 100%;
  object-fit: contain;
}
</style>
