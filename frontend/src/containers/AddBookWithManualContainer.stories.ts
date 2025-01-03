import type { Meta, StoryObj } from '@storybook/vue3';
import AddBookContainer from '@/containers/AddBookWithManualContainer.vue';
import type { BookItem, SelectSeriesItem } from '@/interface';

const meta: Meta<typeof AddBookContainer> = {
    title: 'Containers/AddBookContainer',
    component: AddBookContainer,
    argTypes: {
        createBook: {
            action: 'createBook',
            description: '本を追加するときのイベント'
        },
        seriesList: {
            control: 'array',
            description: 'シリーズのリスト'
        }
    },
};

export default meta;

type Story = StoryObj<typeof AddBookContainer>;

interface Props {
    createBook: (book: BookItem) => void;
    seriesList: SelectSeriesItem[];
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
        },
        seriesList: [
            { seriesId: '1', pic: 'https://m.media-amazon.com/images/I/71rCvdkABYL._SY466_.jpg', seriesTitle: 'Series 1' },
            { seriesId: '2', pic: 'https://m.media-amazon.com/images/I/71VwOPsrD4L._SY342_.jpg', seriesTitle: 'Series 2' }
        ]
    }
};