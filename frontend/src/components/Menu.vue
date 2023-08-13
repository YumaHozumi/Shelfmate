<script setup lang="ts">
import { ref } from 'vue';

interface Props {
    icon: string
    items: string[];
}

const props = defineProps<Props>()

const currentSelect = ref(props.items[0]);

const selectItem = (item: string) => {
    currentSelect.value = item;
}
</script>

<template>
    <v-menu>
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props">
                <v-icon>{{icon}}</v-icon>
                {{ currentSelect }}
            </v-btn>
        </template>

        <v-list>
            <v-list-item link v-for="(key, index) in items" :key="index"
                @click="() => selectItem(key)">
                <v-list-item-title>
                    {{ key }}
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>

</template>