import DropdownMenu from './DropdownMenu.vue'
import type { Meta, StoryFn } from '@storybook/vue3'
import type { SelectSeriesItem } from '@/interface'

export default {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  argTypes: {},
} as Meta<typeof DropdownMenu>

const Template: StoryFn<typeof DropdownMenu> = (args) => ({
  components: { DropdownMenu },
  setup() {
    return { args }
  },
  template: `
    <DropdownMenu
      v-bind="args"
    />
  `,
})

export const Default = Template.bind({})
Default.args = {
  seriesList: [
    {
      seriesId: '1',
      seriesTitle: 'シリーズ1',
      pic: 'http://books.google.com/books/content?id=EAknEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
    },
    {
      seriesId: '2',
      seriesTitle: 'シリーズ2',
      pic: 'https://via.placeholder.com/60x80?text=Series2',
    },
  ] as SelectSeriesItem[],
  isDisabled: false,
  selectedSeriesId: '',
}