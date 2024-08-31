import type { Meta, StoryObj } from '@storybook/vue3'
import ErrorMessage from './ErrorMessage.vue'

const meta: Meta<typeof ErrorMessage> = {
  component: ErrorMessage,
  title: 'Components/ErrorMessage',
}

export default meta
type Story = StoryObj<typeof ErrorMessage>

export const Default: Story = {
  args: {
    errorMessage: 'エラーが発生しました．',
  },
}

export const LongMessage: Story = {
  args: {
    errorMessage: 'これは長いエラーメッセージです．複数行にわたる場合もあります．',
  },
}
