import { describe, test, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Results from '@/components/SearchBook/Results.vue'
import type { BookItem } from '@/interface'
import SearchResult from '@/components/SearchBook/SearchResult.vue'

describe("Results.vue", () => {
    test("should render items", () => {
        const items: BookItem[] = [
            {
                isbn: 1111111111,
                title: "2.5次元の誘惑",
                image_url: "https://www.iwanami.co.jp/files/kojien/kojien6img5.jpg",
                author: "あああ",
                detail: "hoge",
                public_date: new Date()
            },
            {
                isbn: 1111111112,
                title: "3.5次元の誘惑",
                image_url: "https://www.iwanami.co.jp/files/kojien/kojien6img5.jpg",
                author: "あiiああ",
                detail: "hogeaaa",
                public_date: new Date()
            },
        ]

        // Resultsコンポーネントをマウントします
        const wrapper = mount(Results, {
            props: { items }
        })

        // 期待通りに2つのアイテムがレンダリングされることを確認します
        expect(wrapper.findAllComponents(SearchResult).length).toBe(2)
        
        // 各アイテムが正しくレンダリングされていることを確認します
        items.forEach((item, index) => {
            const result = wrapper.findAllComponents(SearchResult)[index]
            expect(result.props().book.title).toBe(item.title)
            expect(result.props().book.image_url).toBe(item.image_url)
        })
    })
})
