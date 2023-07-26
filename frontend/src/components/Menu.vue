<template>
    <v-menu>
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" color="black">
                <v-icon>mdi-sort</v-icon>
            </v-btn>
        </template>

        <v-list>
        <v-list-item>
            <v-list-item-title>
            aaa
            </v-list-item-title>
        </v-list-item>
        <v-list-item>
            <v-list-item-title>
                bbb
            </v-list-item-title>
        </v-list-item>
        <v-list-item>
            <v-list-item-title>
                bbb
            </v-list-item-title>
        </v-list-item>
        </v-list>
    </v-menu>

</template>