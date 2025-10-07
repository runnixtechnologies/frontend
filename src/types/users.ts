export interface User {
  id: number
  name: string
  type: string
  email: string
  phone: string
  earning: string
  gender: string
  joined: string
  trips: number
  imgUrl: string
  category: string
  status: "Active" | "Inactive" | "Suspended"
}
