<template>
  <v-toolbar-title class="title no-copy">
    <span class="clickable"> ShelfMate </span>
  </v-toolbar-title>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Lato&family=Tektur:wght@600&display=swap');

.title {
  font-size: 24px;
  font-family: 'Lato', sans-serif;
  font-family: 'Tektur', cursive;

  &.no-copy {
    user-select: none; /* standard syntax */
    -webkit-user-select: none; /* Chrome and Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
  }

  .clickable {
    cursor: pointer;
  }
}
</style>
