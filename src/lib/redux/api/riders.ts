import { baseApi } from "./baseApi"

export type VehicleView = "front" | "side" | "back"

export type UploadVehicleImageArgs = {
  userId: number | string
  view: VehicleView
  file: File
  userType?: "rider" // default rider
}

export type RemoveVehicleImageArgs = {
  userId: number | string
  view: VehicleView
  userType?: "rider" // default rider
}

export type UploadVehicleImageResponse = {
  status: string
  message: string
  data: {
    url: string // final CDN/asset URL returned by backend
    view?: VehicleView
  }
  errors: unknown[]
}

export type RemoveVehicleImageResponse = {
  status: string
  message: string
  data: boolean
  errors: unknown[]
}

/**
 * NOTE: Adjust the URLs if your backend uses a different path.
 * This follows your pattern: /users/:id?user-type=rider
 * - POST   /users/:id/vehicle-images?user-type=rider   (multipart: view, image)
 * - DELETE /users/:id/vehicle-images?user-type=rider&view=front
 */
export const ridersApi = baseApi.injectEndpoints({
  endpoints: (b) => ({
    uploadVehicleImage: b.mutation<
      UploadVehicleImageResponse["data"],
      UploadVehicleImageArgs
    >({
      query: ({ userId, view, file, userType = "rider" }) => {
        const form = new FormData()
        form.append("view", view)
        form.append("image", file)
        return {
          url: `/users/${userId}/vehicle-images`,
          method: "POST",
          params: { "user-type": userType },
          body: form,
        }
      },
      transformResponse: (res: UploadVehicleImageResponse) => res.data,
      // Refetch user so latest vehicle images are reflected everywhere
      invalidatesTags: (_res, _err, { userId }) => [
        { type: "Users" as const, id: userId },
      ],
    }),

    removeVehicleImage: b.mutation<boolean, RemoveVehicleImageArgs>({
      query: ({ userId, view, userType = "rider" }) => ({
        url: `/users/${userId}/vehicle-images`,
        method: "DELETE",
        params: { "user-type": userType, view },
      }),
      transformResponse: (res: RemoveVehicleImageResponse) =>
        Boolean(res?.data),
      invalidatesTags: (_res, _err, { userId }) => [
        { type: "Users" as const, id: userId },
      ],
    }),
  }),
  overrideExisting: false,
})

export const { useUploadVehicleImageMutation, useRemoveVehicleImageMutation } =
  ridersApi
