import type { Meta, StoryObj } from '@storybook/vue3';
import AddBookContainer from '@/containers/AddBookWithManualContainer.vue';
import type { BookItem } from '@/interface';

const meta: Meta<typeof AddBookContainer> = {
    title: 'Containers/AddBookContainer',
    component: AddBookContainer,
    argTypes: {
        createBook: {
            action: 'createBook',
            description: '本を追加するときのイベント'
        }
    },
};

export default meta;

type Story = StoryObj<typeof AddBookContainer>;

interface Props {
    createBook: (book: BookItem) => void;
}

export const Default: Story = {
    render: (args: Props) => ({
        components: { AddBookContainer },
        setup() {
            return { args };
        },
        template: '<add-book-container v-bind="args"/>',
    }),
    args: {
        createBook: (book: BookItem) => {
            console.log("test")
            console.log(book);
        }
    }
};