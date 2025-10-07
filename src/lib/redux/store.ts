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
import { accountApi } from "./api/account"
import { pricingApi } from "./api/pricing"
import { usersApi } from "./api/users"
import { ordersApi } from "./api/orders"
import { dashboardApi } from "./api/dashboard"
import { deliveriesApi } from "./api/deliveries"
import { issuesApi } from "./api/issues"
import { ridersApi } from "./api/riders"
import { productsApi } from "./api/products"

// 1) Collect all API instances (some may be injected clones of baseApi)
const allApis = [
  baseApi,
  utilsApi,
  adminApi,
  storeTypeApi,
  deliveriesApi,
  categoryApi,
  pricingApi,
  usersApi,
  ordersApi,
  dashboardApi,
  accountApi,
  issuesApi,
  ridersApi,
  productsApi,
]

// 2) DEDUPE by reducerPath (so baseApi + any injected endpoints only appear once)
const uniqueApis = Object.values(
  allApis.reduce<Record<string, typeof baseApi>>((acc, api) => {
    acc[api.reducerPath] = api
    return acc
  }, {})
)

// 3) Build reducers & middlewares from unique APIs only
const apiReducers = uniqueApis.reduce<ReducersMapObject>((acc, api) => {
  acc[api.reducerPath] = api.reducer
  return acc
}, {})

const apiMiddlewares: Middleware[] = uniqueApis.map((api) => api.middleware)

// 4) Configure store
const rootReducer = combineReducers({
  ...apiReducers,
  Auth,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (gdm) => gdm().concat(...apiMiddlewares),
  devTools: process.env.NODE_ENV !== "production",
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
