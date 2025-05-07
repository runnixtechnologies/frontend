import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

// Define the type for waitlist form data
type ContactFormData = {
  fullname: string
  email: string
  phone: string
  interest_complaints: (
    | "Deliveries / Order"
    | "Partnership / Business"
    | "Operations / Riders / Vendors"
    | "General Enquiries"
  )[]
  message: string
}

// Create the API slice
export const contactApi = createApi({
  reducerPath: "contactApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.runnix.africa/api/",
  }),
  endpoints: (builder) => ({
    addContact: builder.mutation<
      { success: boolean; message: string },
      ContactFormData
    >({
      query: (formData) => {
        return {
          url: "contact.php",
          method: "POST",
          body: formData,
        }
      },
    }),
  }),
})

// Export the auto-generated hooks
export const { useAddContactMutation } = contactApi
