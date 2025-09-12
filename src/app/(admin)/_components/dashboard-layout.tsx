"use client"

import type React from "react"
import {
  BagIcon,
  DashboardIcon,
  DeliveryIcon,
  MessagesIconAlt,
  MoneyReceivedIcon,
  RidersIcon,
  SecurityUserIcon,
  ShopIcon,
  UsersIcon,
} from "@/components/svgs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import AppLogo from "@/components/svgs/logo"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ChevronDown, LayoutDashboard, Menu, Search } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/hooks/useAuth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface NavSubItem {
  title: string
  href: string
}

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: string
  subItems?: NavSubItem[]
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/admin/dashboard", icon: DashboardIcon },
  { title: "Deliveries", href: "/admin/deliveries", icon: DeliveryIcon },
  {
    title: "Merchants",
    href: "/admin/merchants",
    icon: ShopIcon,
    badge: "#F83B3B",
  },
  {
    title: "Riders",
    href: "/admin/riders",
    icon: RidersIcon,
    badge: "#F83B3B",
  },
  { title: "Users", href: "/admin/users", icon: UsersIcon },
  { title: "Items", href: "/admin/items", icon: BagIcon },
  { title: "Pricing", href: "/admin/pricing", icon: MoneyReceivedIcon },
  {
    title: "Administration",
    href: "/admin/administration",
    icon: SecurityUserIcon,
  },
  { title: "Issues", href: "/admin/issues", icon: MessagesIconAlt },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  // const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
  //   {}
  // )

  // Handle logout
  async function handleLogout() {
    try {
      await fetch("/api/auth/session", { method: "DELETE" })
      localStorage.removeItem("auth:token")
      localStorage.removeItem("auth:user")
      router.replace("/login/admin")
    } catch {
      router.replace("/login/admin")
    }
  }

  // Init expanded state based on current path
  // useEffect(() => {
  //   setExpandedItems({
  //     Merchants: pathname?.startsWith("/merchants") || false,
  //     Riders: pathname?.startsWith("/riders") || false,
  //   })
  // }, [pathname])

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname === "/deliveries") return "Deliveries"
    if (pathname?.startsWith("/merchants")) return "Merchants"
    if (pathname?.startsWith("/riders")) return "Riders"
    if (pathname === "/users") return "Users"
    if (pathname === "/items") return "Items"
    if (pathname === "/pricing") return "Pricing"
    if (pathname === "/admin") return "Administration"
    if (pathname === "/issues") return "Issues"
    return "Dashboard"
  }

  const getPageIcon = () => {
    if (pathname === "/dashboard")
      return <DashboardIcon className="text-primary" />
    if (pathname === "/deliveries")
      return <DeliveryIcon className="text-primary" />
    if (pathname?.startsWith("/merchants"))
      return <ShopIcon className="text-primary" />
    if (pathname?.startsWith("/riders"))
      return <RidersIcon className="text-primary" />
    if (pathname === "/users") return <UsersIcon className="text-primary" />
    if (pathname === "/items") return <BagIcon className="text-primary" />
    if (pathname === "/pricing")
      return <MoneyReceivedIcon className="text-primary" />
    if (pathname === "/admin")
      return <SecurityUserIcon className="text-primary" />
    if (pathname === "/issues")
      return <MessagesIconAlt className="text-primary" />
    return <LayoutDashboard />
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/landing" className="flex items-center gap-2">
          <AppLogo className="w-[114.23px] h-[36px]" />
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/")
            return (
              <div key={index} className="flex flex-col">
                <Link
                  href={item.href}
                  className={cn(
                    "h-[44px] flex items-center gap-3 rounded-[50px] p-3 text-sm/[20px] font-medium hover:bg-[#f5f5f4]",
                    isActive
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "text-[#7C7C7C]"
                  )}
                >
                  <item.icon />
                  <span>{item.title}</span>
                  {item.badge && (
                    <span className="ml-auto h-2 w-2 rounded-full bg-[#F83B3B]" />
                  )}
                </Link>
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#F7F6FC]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-full w-[222px] border-r bg-white lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed left-4 top-3 z-40 lg:hidden"
            >
              <Menu />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content */}
      <div className="flex w-full flex-col lg:ml-[222px]">
        {/* App Bar */}
        <header className="sticky top-0 z-20 flex h-[66px] items-center gap-4 border-b bg-white py-4 pl-6 pr-9">
          <div className="flex items-center gap-2 lg:ml-0">
            {isMobile && (
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            )}
            <div className="flex items-center gap-2">
              {getPageIcon()}
              <h1 className="font-figtree tracking-normal text-2xl/[28px] font-bold text-primary">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          <div className="w-[199px] ml-auto flex items-center gap-4">
            {/* Search */}
            <Button
              variant="outline"
              size="icon"
              className="rounded-full cursor-pointer"
            >
              <Search className="h-[20.27px] w-[20.27px]" />
              <span className="sr-only">Search</span>
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-[165px] h-[34px] flex items-center justify-between gap-2 rounded-full hover:bg-muted/40 px-2">
                  <div className="w-[123px] flex items-center gap-2">
                    <Avatar>
                      <AvatarImage
                        src="/images/mr_Keneth.png"
                        alt={`${user?.firstname ?? ""} ${user?.lastname ?? ""}`}
                        className="w-8 h-8"
                      />
                      <AvatarFallback className="bg-primary/20 text-[10px]/[20px] font-figtree font-normal text-black/900">
                        {`${user?.firstname?.[0] ?? ""}${
                          user?.lastname?.[0] ?? ""
                        }`.toUpperCase() || "AD"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm/[20px] font-semibold font-figtree text-black-900 truncate">
                        {`${user?.firstname ?? ""} ${user?.lastname ?? ""}`}
                      </p>
                      <p className="text-[10px]/[20px] font-figtree font-normal text-[#666666] capitalize">
                        {user?.role?.name ?? ""}
                      </p>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">
                  {user?.email ?? "Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
