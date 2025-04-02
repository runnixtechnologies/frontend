import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Define the type for waitlist form data
type WaitlistFormData = {
  name: string
  email: string
  role: "merchant" | "users" | "rider"
}

// Create the API slice
export const waitlistApi = createApi({
  reducerPath: "waitlistApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://runnix.africa/api/",
  }),
  endpoints: (builder) => ({
    addToWaitlist: builder.mutation<
      { success: boolean; message: string },
      WaitlistFormData
    >({
      query: (formData) => {
        return {
          url: "waiting_list",
          method: "POST",
          body: formData,
        }
      },
    }),
  }),
})

// Export the auto-generated hooks
export const { useAddToWaitlistMutation } = waitlistApi
