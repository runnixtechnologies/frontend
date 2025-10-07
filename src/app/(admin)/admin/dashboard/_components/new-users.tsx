"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronRight } from "lucide-react"
import { getInitials } from "@/lib/utils"
import { useGetNewUsersQuery } from "@/lib/redux/api/dashboard"

export default function NewUserCard({
  role,
  page,
}: {
  role: "merchant" | "rider" | "user"
  page: string
}) {
  const { data: merchants = [], isLoading } = useGetNewUsersQuery({
    role,
    max: 4,
  })

  return (
    <Card className="flex flex-col gap-4 px-6 pt-6 pb-[36px] rounded-[12px] bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <CardTitle className="text-[20px]/[120%] font-figtree font-bold tracking-normal text-[#232323]">
            New {page}
          </CardTitle>
        </div>
        <Link
          href={`/admin/${page}`}
          className="text-[14px]/[120%] font-semibold text-primary -tracking-[2%] hover:underline cursor-pointer"
        >
          See all
        </Link>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <p className="text-sm text-[#525252]">Loading...</p>
        ) : merchants.length === 0 ? (
          <p className="text-sm text-[#525252]">No new {page}</p>
        ) : (
          <div className="space-y-4">
            {merchants.map((m) => (
              <Link
                href={`/admin/${page}/${m.id}`}
                key={m.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-[36px] h-[36px]">
                    <AvatarImage src={m.profileImage ?? ""} alt={m.name} />
                    <AvatarFallback>{getInitials(m.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold font-figtree text-[14px]/[120%] text-[#232323]">
                      {m.name}
                    </div>
                    <div className="text-[12px]/[140%] text-[#525252] font-normal font-figtree">
                      {new Date(m.createdAt).toLocaleDateString()} •{" "}
                      {new Date(m.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-[#525252]" />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
