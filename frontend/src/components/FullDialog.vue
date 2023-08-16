<script setup lang="ts">
import { getCurrentUser } from '@/config/firebase';
import type { Series } from '@/interface';
import { ref } from 'vue';

interface Props {
    series: Series
    selectBookshelfId: string;
}

const props = defineProps<Props>();

const dialog = ref(false);

const onClickBook = async() => {
    const user = await getCurrentUser();
    console.log(props.selectBookshelfId)
}
</script>

<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay
    transition="dialog-bottom-transition">
        <template v-slot:activator="{props}">
            <div v-bind="props" @click="onClickBook">
                <slot></slot>
            </div>
        </template>

        <v-card>
            <v-toolbar color="green">
                <v-btn icon @click="dialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-list>
                <v-list-item></v-list-item>
            </v-list>
        </v-card>
    </v-dialog>
</template>