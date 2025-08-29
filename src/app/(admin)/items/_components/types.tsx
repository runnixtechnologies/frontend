export interface CategoryData {
  icon: string
  title: string
  categories: string[]
}

export interface Item {
  id: string
  name: string
  category: string
  mainCategory: string
  icon: string
  price: number
  stock: number
  description: string
  status: "active" | "inactive"
}

export interface CreateCategoryData {
  name: string
  mainCategory: string
  description: string
  image?: string
  icon?: string
  isNewMainCategory?: boolean
}

export interface NotificationData {
  message: string
  type: "success" | "error"
}
