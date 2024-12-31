import type { Meta, StoryObj } from '@storybook/vue3';
import AddBookContainer from '@/containers/AddBookWithManualContainer.vue';

const meta: Meta<typeof AddBookContainer> = {
    title: 'Containers/AddBookContainer',
    component: AddBookContainer,
};

export default meta;

type Story = StoryObj<typeof AddBookContainer>;

export const Default: Story = {
    render: () => ({
        components: { AddBookContainer },
        template: '<add-book-container />',
    }),
};