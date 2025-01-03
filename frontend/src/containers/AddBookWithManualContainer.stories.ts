import type { Meta, StoryObj } from '@storybook/vue3';
import AddBookContainer from '@/containers/AddBookWithManualContainer.vue';
import type { BookItem, SelectSeriesItem } from '@/interface';

const meta: Meta<typeof AddBookContainer> = {
    title: 'Containers/AddBookContainer',
    component: AddBookContainer,
    argTypes: {
        submit: {
            action: 'submit',
            description: '本を追加するときのイベント'
          },
        seriesList: {
            control: 'object',
            description: 'シリーズのリスト'
        }
    },
};

export default meta;

type Story = StoryObj<typeof AddBookContainer>;

interface Props {
    submit: (book: BookItem, selectedRadio: string, selectedSeriesId: string) => void;
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
      submit: (book: BookItem, selectedRadio: string, selectedSeriesId: string) => {
        console.log("test", book, selectedRadio, selectedSeriesId);
      },
      seriesList: [
        { seriesId: '1', pic: 'https://m.media-amazon.com/images/I/71rCvdkABYL._SY466_.jpg', seriesTitle: 'Series 1' },
        { seriesId: '2', pic: 'https://m.media-amazon.com/images/I/71VwOPsrD4L._SY342_.jpg', seriesTitle: 'Series 2' }
      ]
    }
  };