<script setup lang="ts">
import Header from '@/containers/GlobalHeader.vue'
import LocalHeader from '@/containers/LocalHeader.vue';
import BookshelfContainer from '@/containers/BookshelfContainer.vue';
import OptionContainer from '@/containers/OptionContainer.vue';
import router from '@/router'
import Camera from '@/components/Camera.vue';
import { ref } from 'vue';
import { implementBookShelf, type BookShelf } from '@/interface';
import { onMounted } from 'vue';
import { onBeforeMount } from 'vue';
import { firestore, getCurrentUser } from '@/config/firebase';
import { collection, getDoc, getDocs } from 'firebase/firestore';

const onNavigate = (name: string): void => {
  router.push({name: name});
}

const clickLocalHeaderBtn = (bookshelf: BookShelf): void => {
  selectedBookshelf.value = bookshelf;
}

// ...
const selectedBookshelf = ref<BookShelf | undefined>();


const initializeSelectedBookshelf = async () => {
  try {
    const user = await getCurrentUser();
    const bookshelvesRef = collection(firestore, "users", user.uid, "bookshelves");
    const snapshot = await getDocs(bookshelvesRef);
    const firstDoc = snapshot.docs[0];
    if (firstDoc) {
      const data = firstDoc.data();
      if (implementBookShelf(data)) {
        const bookShelfData: BookShelf = { doc_id: firstDoc.id, ...data };
        selectedBookshelf.value = bookShelfData;
      }
    }
  } catch (e) {
    console.log(e);
  }
};

initializeSelectedBookshelf(); // 関数を呼び出し、selectedBookshelfを初期化
</script>

<template>
  <Header @navigate="onNavigate"></Header>
  <LocalHeader @clickLocalHeaderBtn="clickLocalHeaderBtn"></LocalHeader>
  <OptionContainer></OptionContainer>
  <BookshelfContainer :selectedBookshelf="selectedBookshelf" v-if="selectedBookshelf"></BookshelfContainer>
</template>
