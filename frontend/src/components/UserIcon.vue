<script setup lang="ts">
interface Emits {
  (event: "clickLogout"): void;
}

const emits = defineEmits<Emits>();

const clickLogout = (): void => {
  emits("clickLogout");
}
</script>

<template>
  <div>
    <v-menu>
      <template v-slot:activator="{props}">
        <button class="icon" v-bind="props">
          <v-icon>mdi-account-outline</v-icon>
        </button>
      </template>
      <v-list>
        <v-list-item link @click="clickLogout">
          <v-list-item-title>
            <v-icon>mdi-logout</v-icon>
            ログアウト
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<style scoped lang="scss">
.icon {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0; /* 背景色 */
  border: 1px solid #ccc; /* ボーダー */
  margin-right: 1%;
  transition: filter 0.3s ease; /* アニメーション効果 */

  &:hover {
    filter: brightness(0.8)
  }
}
</style>