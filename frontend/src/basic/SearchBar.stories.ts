// SearchBar.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3';
import SearchBar from './SearchBar.vue';

const meta = {
  title: '検索バー',
  component: SearchBar,
  tags: ['autodocs'],
  argTypes: {
    label: { 
      control: 'text', // テキスト入力用のコントロール
      description: '検索バーのラベル',
    },
    rules: { 
      control: 'object', // 配列やオブジェクト編集用
      description: '入力バリデーションルール',
    },
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args: any) => ({
        components: { SearchBar },
        setup() {
            return { args };
        },
        template: '<SearchBar v-bind="args" />',
    }),
    args: {
        label: '検索',
        rules: [(v: string) => !!v || '検索語を入力してください']
    },
};

export const CustomLabel: Story = {
  args: {
    label: 'キーワードを入力',
    rules: [(v: string) => !!v || '検索語を入力してください']
  },
};

export const HasValidations: Story = {
  args: {
    label: '検索',
    rules: [
      (v: string) => !!v || '検索語を入力してください',
      (v: string) => v.length >= 3 || '3文字以上入力してください'
    ]
  },
};
