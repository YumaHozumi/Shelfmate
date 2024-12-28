<script setup lang="ts">
import { computed, ref } from 'vue'
import { debounce } from 'lodash'

interface Props {
  label?: string
  rules: Array<(value: string) => true | string> //バリデーション
}

const props = defineProps<Props>()

interface Emits {
  (event: 'search', searchText: string): void
}

const emit = defineEmits<Emits>()

const inputText = ref('')
const valid = ref(true)

const debouncedSearch = debounce((searthText: string) => {
  emit('search', searthText)
}, 300)

//検索ボタン押したら
const searchClick = (): void => {
  if (inputText.value === '' || !valid.value) return
  debouncedSearch(inputText.value)
}

// バリデーションの結果を計算
const validationResults = computed(() => {
  return props.rules.map((rule) => rule(inputText.value))
})

// 全てのバリデーションが成功したかどうかをチェック
const allValid = computed(() => {
  return validationResults.value.every((result) => result === true)
})
</script>

<template>
  <v-text-field
    v-model="inputText"
    @keyup.enter="searchClick"
    :label="label"
    :rules="rules"
    @input="() => (valid = allValid)"
  ></v-text-field>
  <v-btn :disabled="!valid" icon @click="searchClick" class="btn-pos">
    <v-icon>mdi-magnify</v-icon>
  </v-btn>

</template>

<style scoped lang="scss">
.btn-pos {
  margin-bottom: 2%;
}
</style>
