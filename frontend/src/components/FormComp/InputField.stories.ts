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
    required: { control: 'boolean' },
    rules: { control: 'array' }, // updated control type to array for rules
  },
};

const Template: StoryFn = (args) => ({
  components: { InputField },
  setup() {
    return { args };
  },
  template: '<input-field v-bind="args" @update:value="args.value = $event" />', // Added event binding for v-model-like behavior
});

// Default story without validation rules
export const Default = Template.bind({});
Default.args = {
  label: 'Label',
  type: 'text',
  value: '',
  placeholder: 'Enter text',
  width: '100%',
  required: false,
  rules: [], // No rules for the default story
};

// Custom validation rule to simulate required field
const requiredRule = {
  validate: (val: string | number) => !!val,
  message: 'This field is required',
};

const longTextRule = {
  validate: (val: string | number) => (val as string).length <= 10,
  message: 'Text must be less than 10 characters',
};

// Story with a validation rule that shows an error when the field is empty
export const WithValidation = Template.bind({});
WithValidation.args = {
  label: 'Label',
  type: 'text',
  value: '',
  placeholder: 'Enter text',
  width: '100%',
  required: true,
  rules: [
    requiredRule,
    longTextRule
  ], // Apply the required rule
};