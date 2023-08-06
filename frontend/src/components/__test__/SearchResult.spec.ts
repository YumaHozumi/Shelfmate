import { mount } from '@vue/test-utils'
import SearchResult from '@/components/SearchBook/SearchResult.vue'
import imageURL from '@/assets/no-image.png'
import { describe, test, expect } from 'vitest'

describe('SearchResult.vue', () => {
  test('renders with default image when image prop is not provided', () => {
    const propsData = {
        title: "きめつ",
        image: undefined
    }

    const wrapper = mount(SearchResult, {
      props: propsData
    })
    console.log(wrapper.find('.book-title').text())

    expect(wrapper.find('.book-title').text()).toBe(propsData.title)
    expect(wrapper.find('.book-cover').attributes('src')).toBe(imageURL)
  })

  test('renders with provided image when image prop is provided', () => {
    const propsData = {
        title: "きめつ",
        image: "https://www.iwanami.co.jp/files/kojien/kojien6img5.jpg"
    }
    const wrapper = mount(SearchResult, {
      props: propsData
    })

    expect(wrapper.find('.book-title').text()).toBe(propsData.title)
    expect(wrapper.find('.book-cover').attributes('src')).toBe(propsData.image)
  })
})
