import { baseApi } from "./baseApi"

export type Role = { id: string; name: string }

export const utilsApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    getRoles: b.query<Role[], void>({
      query: () => ({
        url: "/utils/roles" /* or "/roles" if that’s your route */,
      }),
      providesTags: ["Roles"],
    }),
  }),
})

export const { useGetRolesQuery } = utilsApi
