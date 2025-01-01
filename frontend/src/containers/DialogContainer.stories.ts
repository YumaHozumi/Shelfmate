// DialogContainer.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3';
import DialogContainer from '@/containers/DialogContainer.vue';

const meta = {
    title: 'Containers/Dialog',
    component: DialogContainer,
    tags: ['autodocs'],
    argTypes: {
        modelValue: { control: 'boolean' },
        title: { control: 'text' }
    }
} satisfies Meta<typeof DialogContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: 'サンプルダイアログ',
        modelValue: false
    },
    render: (args) => ({
        components: { DialogContainer },
        setup() {
            return { args };
        },
        template: `
            <div>
                <DialogContainer 
                    v-model:model-value="args.modelValue"
                    :title="args.title"
                >
                    <template #default>
                        ダイアログの内容
                    </template>
                </DialogContainer>
                <v-btn @click="args.modelValue = true">開く</v-btn>
            </div>
        `
    })
};