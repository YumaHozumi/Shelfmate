import { mount } from '@vue/test-utils'
import SearchResult from '@/components/SearchBook/SearchResult.vue'
import imageURL from '@/assets/no-image.png'
import { describe, test, expect } from 'vitest'

describe('SearchResult.vue', () => {
  test('renders with default image when image prop is not provided', () => {
    const propsData = {
        book: {
            isbn: 1111111111,
            title: "2.5次元の誘惑",
            image_url: undefined,
            author: "あああ",
            detail: "hoge",
            public_date: new Date()
        }
    }

    const wrapper = mount(SearchResult, {
      props: propsData
    })

    const book = propsData.book
    // Check if the title, author and detail are rendered correctly
    expect(wrapper.get('.book-title').text()).toBe(book.title)
    expect(wrapper.get('.book-author').text()).toBe(book.author)
    expect(wrapper.get('.book-detail').text()).toBe(book.detail)

    // Check if the image is rendered with correct src
    expect(wrapper.get('.book-cover').attributes('src')).toBe(imageURL)
  })

  test('renders with provided image when image prop is provided', () => {

    const propsData = {
        book: {
            isbn: 1111111111,
            title: "2.5次元の誘惑",
            image_url: "https://www.iwanami.co.jp/files/kojien/kojien6img5.jpg",
            author: "あああ",
            detail: "hoge",
            public_date: new Date()
        }
    }
    const wrapper = mount(SearchResult, {
      props: propsData
    })

    const book = propsData.book;

    // Check if the title, author and detail are rendered correctly
    expect(wrapper.get('.book-title').text()).toBe(book.title)
    expect(wrapper.get('.book-author').text()).toBe(book.author)
    expect(wrapper.get('.book-detail').text()).toBe(book.detail)
    expect(wrapper.find('.book-cover').attributes('src')).toBe(book.image_url)
  })
})
