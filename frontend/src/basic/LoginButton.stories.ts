import type { Meta, StoryObj } from '@storybook/vue3'
import LoginButton from './LoginButton.vue'

const meta: Meta<typeof LoginButton> = {
  component: LoginButton,
  title: 'Components/LoginButton',
}

export default meta
type Story = StoryObj<typeof LoginButton>

export const Default: Story = {
  render: (args: any) => ({
    components: { LoginButton },
    setup() {
      return { args }
    },
    template: '<LoginButton v-bind="args" @clickLoginButton="onClickLoginButton" />',
  }),
  args: {},
}

export const WithCustomText: Story = {
  render: (args: any) => ({
    components: { LoginButton },
    setup() {
      return { args }
    },
    template: '<LoginButton v-bind="args">カスタムテキスト</LoginButton>',
  }),
  args: {},
}
