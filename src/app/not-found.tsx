"use client"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function PageNotFound() {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-primary">404 - Not found</h1>
      <p className="text-gray-600">
        The page you&apos;re trying to access is not found.
      </p>
      <Button onClick={() => router.back()} className="mt-8">
        Go back
      </Button>
    </div>
  )
}
