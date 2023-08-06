interface BookItem {
    isbn: number
    title: string
    image_url: string | undefined
    author: string
    detail: string
    public_date: Date
}

export type { BookItem }