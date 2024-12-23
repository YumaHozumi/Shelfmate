import type { Preview } from "@storybook/vue3";
import { setup } from '@storybook/vue3'
import vuetify from "../src/plugins/vuetify";

setup((app) => {
  if (app) {
    app.use(vuetify)
  }
})

export const decorators = [
  (story: any) => ({
    components: { story },
    template: '<v-app><story /></v-app>',
  }),
];

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
