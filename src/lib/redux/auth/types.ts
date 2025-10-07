export interface Role {
  id: number
  name: string
  code: "super-admin" | "admin" | "customer-support" | string
  status: number
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  name: string
  type: string
  username: string | null
  email: string
  role_id: number
  remarks: string | null
  photo: string | null
  joined_at: string
  status: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  token: string
  role: Role
  permissions: any[]
}

export interface AuthState {
  user: User | null
  token: string | null
}
