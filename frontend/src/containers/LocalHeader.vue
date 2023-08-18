<script setup lang="ts">
import LocalHeaderButton from '@/components/LocalHeaderButton.vue'
import { ref, onMounted, onUnmounted, watchEffect } from 'vue'
import MoreMenu from '@/components/MoreMenu.vue'
import type { BookShelf } from '@/interface'
import { collection, onSnapshot } from 'firebase/firestore'
import { firestore, firebaseAuth } from '@/config/firebase'
import { onAuthStateChanged, type Unsubscribe } from 'firebase/auth'
import { implementBookShelf } from '@/interface'

interface Emits {
  (event: 'clickLocalHeaderBtn', bookshelf: BookShelf): void
}

const buttonsInit: BookShelf[] = []

const buttons = ref(buttonsInit)

const buttonWidth = 100
const buttonMarginEnd = 8
const buttonMarginStart = 8
const sum = buttonWidth + buttonMarginEnd + buttonMarginStart
const windowWidth = ref(window.innerWidth)
//表示するボタンの最大数
let maxButtons = Math.floor(windowWidth.value / sum) - 1

const visibleButtons = ref(buttons.value.slice(0, maxButtons))
const hiddenButtons = ref(buttons.value.slice(maxButtons))

watchEffect(() => {
  maxButtons = Math.floor(windowWidth.value / sum) - 1
  visibleButtons.value = buttons.value.slice(0, maxButtons)
  hiddenButtons.value = buttons.value.slice(maxButtons)
})

const updateWidth = () => {
  windowWidth.value = window.innerWidth
  maxButtons = Math.floor(windowWidth.value / sum) - 1
}

onMounted(() => {
  window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})

let unsubscribe: Unsubscribe

onAuthStateChanged(firebaseAuth, (user) => {
  if (user) {
    unsubscribe = onSnapshot(
      collection(firestore, 'users', user.uid, 'bookshelves'),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const data = change.doc.data()
          if (implementBookShelf(data)) {
            if (change.type === 'added') {
              const bookShelfData: BookShelf = { doc_id: change.doc.id, ...data } // doc_idを設定し直します
              buttons.value.push(bookShelfData)
            }
          }
        })
      }
    )
  }
})

onUnmounted(() => {
  unsubscribe()
})

const emit = defineEmits<Emits>()
//ヘッダーのボタン押されたらさらに上位層へ
const clickLocalHeaderBtn = (bookshelf: BookShelf): void => {
  emit('clickLocalHeaderBtn', bookshelf)
}
</script>

<template>
  <v-app-bar color="white" elevation="0" height="33" class="header-border" v-if="buttons.length > 0">
    <div class="button-container">
      <LocalHeaderButton
        v-for="(button, index) in visibleButtons"
        :key="index"
        :bookshelf="button"
        class="mx-2"
        @clickLocalHeaderBtn="clickLocalHeaderBtn"
      ></LocalHeaderButton>
      <div v-show="hiddenButtons.length > 0">
        <v-spacer></v-spacer>
        <MoreMenu :items="hiddenButtons"></MoreMenu>
      </div>
    </div>
  </v-app-bar>
</template>

<style scoped lang="scss">
.header-border {
  border-top: 1px solid rgb(209, 209, 209);
  border-bottom: 1px solid rgb(209, 209, 209);
}

.button-container {
  display: flex;
  width: 100%;
}
</style>
