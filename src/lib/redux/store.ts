import {
  configureStore,
  combineReducers,
  type ReducersMapObject,
  type Middleware,
} from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { baseApi } from "./api/baseApi"
import Auth from "@/lib/redux/auth/slice"
import { utilsApi } from "./api/utils"
import { adminApi } from "./api/admin"
import { storeTypeApi } from "./api/storeType"
import { categoryApi } from "./api/category"
import { pricingApi } from "./api/pricing"
import { userApi } from "./api/user"
import { ordersApi } from "./api/orders"
import { dashboardApi } from "./api/dashboard"

// If these are independent createApi instances, keep them here:
const apis = [
  baseApi,
  utilsApi,
  adminApi,
  storeTypeApi,
  categoryApi,
  pricingApi,
  userApi,
  ordersApi,
  dashboardApi,
]

// Build reducers from API instances
const apiReducers = Object.fromEntries(
  apis.map((a) => [a.reducerPath, a.reducer])
) satisfies ReducersMapObject

// ✅ Add your plain slice reducer alongside the APIs
const rootReducer = combineReducers({
  ...apiReducers,
  Auth,
})

// Add all API middlewares
const apiMiddlewares: Middleware[] = apis.map((a) => a.middleware)

export const store = configureStore({
  reducer: rootReducer,
  middleware: (gdm) => gdm().concat(...apiMiddlewares),
  devTools: process.env.NODE_ENV !== "production",
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
