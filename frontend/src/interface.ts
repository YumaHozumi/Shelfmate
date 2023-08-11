interface BookItem {
    isbn?: number
    title: string
    image_url: string | undefined
    author: string
    detail: string
    public_date: Date
}

interface BookShelf {
    doc_id?: string
    shelf_name: string
}

//ユーザ定義タイプガード
const implementBookShelf = (arg: any): arg is BookShelf => {
    return arg !== null && typeof arg === "object" &&  typeof arg.shelf_name === "string" 
}

export type { BookItem, BookShelf }
export { implementBookShelf }