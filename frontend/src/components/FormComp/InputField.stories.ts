import type { StoryFn } from '@storybook/vue3';
import InputField from '@/components/FormComp/InputField.vue';

export default {
  title: 'Components/InputField',
  component: InputField,
  argTypes: {
    label: { control: 'text' },
    type: { control: 'text' },
    value: { control: 'text' },
    placeholder: { control: 'text' },
    width: { control: 'text' },
    errorMessage: { control: 'text' },
    required: { control: 'boolean' },
  },
};

const Template: StoryFn = (args) => ({
  components: { InputField },
  setup() {
    return { args };
  },
  template: '<input-field v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  label: 'Label',
  type: 'text',
  value: '',
  placeholder: 'Enter text',
  width: '100%',
  errorMessage: '',
};