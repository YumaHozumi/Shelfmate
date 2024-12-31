// TextAreaField.stories.ts
import type { Meta, StoryFn } from '@storybook/vue3';
import TextAreaField from './TextAreaField.vue';

export default {
  title: 'Components/TextAreaField',
  component: TextAreaField,
  argTypes: {
    label: { control: 'text', description: 'ラベルのテキスト' },
    value: { control: 'text', description: 'テキストエリアの値' },
    placeholder: { control: 'text', description: 'プレースホルダーのテキスト' },
    width: { control: 'text', description: 'コンポーネントの幅（CSSの幅指定）' },
    errorMessage: { control: 'text', description: 'エラーメッセージのテキスト' },
    required: { control: 'boolean', description: '必須項目かどうか' },
    rows: { control: 'number', description: '行数' },
    cols: { control: 'number', description: '列数' },
  },
} as Meta<typeof TextAreaField>;

const Template: StoryFn<typeof TextAreaField> = (args) => ({
  components: { TextAreaField },
  setup() {
    return { args };
  },
  template: `<TextAreaField v-bind="args" v-model="args.value" />`,
});

export const Default = Template.bind({});
Default.args = {
  label: 'テキストエリア',
  value: '',
  placeholder: 'ここにテキストを入力してください',
};

export const Required = Template.bind({});
Required.args = {
  label: '必須のテキストエリア',
  value: '',
  placeholder: 'ここにテキストを入力してください',
  required: true,
};

export const WithError = Template.bind({});
WithError.args = {
  label: 'エラー表示',
  value: '',
  placeholder: 'ここにテキストを入力してください',
  errorMessage: '入力が必須です',
  required: true,
};

export const CustomSize = Template.bind({});
CustomSize.args = {
  label: 'カスタムサイズ',
  value: '',
  placeholder: 'ここにテキストを入力してください',
  rows: 6,
  cols: 80,
};

export const FullFeatures = Template.bind({});
FullFeatures.args = {
  label: '全ての機能',
  value: '初期値が設定されています',
  placeholder: 'ここにテキストを入力してください',
  required: true,
  errorMessage: 'エラーメッセージを表示します',
  rows: 8,
  cols: 100,
  width: '100%',
};