import type { Meta, StoryObj } from '@storybook/vue3';
import HeaderSearchBar from './HeaderSearchBar.vue';

const meta: Meta<typeof HeaderSearchBar> = {
  title: 'Components/HeaderSearchBar',
  component: HeaderSearchBar,
  argTypes: {
    placeholder: {
      control: { type: 'text' },
      description: '入力フィールドのプレースホルダー',
    },
    query: {
      control: { type: 'text' },
      description: '初期入力値',
    },
    onSearch: {
      action: 'search',
      description: '検索ボタンがクリックされたときのイベント',
    },
  },
  parameters: {
    docs: {
      description: {
        component: '検索バーコンポーネント',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof HeaderSearchBar>;

// Propsの型を定義します
interface Props {
  query?: string;
  placeholder?: string;
}

export const Default: Story = {
  render: (args: Props) => ({
    components: { HeaderSearchBar },
    setup() {
      return { args };
    },
    template: `<HeaderSearchBar v-bind="args" @update:query="args['update:query']" @search="args['search']" />`,
  }),
  args: {
    placeholder: '検索キーワードを入力',
    query: '',
  },
};

export const WithInitialQuery: Story = {
  render: (args: Props) => ({
    components: { HeaderSearchBar },
    setup() {
      return { args };
    },
    template: `<HeaderSearchBar v-bind="args" @update:query="args['update:query']" @search="args['search']" />`,
  }),
  args: {
    placeholder: '検索キーワードを入力',
    query: '初期値',
  },
};

export const LongText: Story = {
  render: (args: Props) => ({
    components: { HeaderSearchBar },
    setup() {
      return { args };
    },
    template: `<HeaderSearchBar v-bind="args" @update:query="args['update:query']" @search="args['search']" />`,
  }),
  args: {
    placeholder: '検索キーワードを入力',
    query: 'これは150文字を超える長いテキストを入力した場合のテストです。入力されたテキストは自動的に150文字に切り詰められる必要があります。これはその動作を確認するためのストーリーです。さらにテキストを追加して、合計が150文字を超えるようにします。これでどうでしょうか？',
  },
};