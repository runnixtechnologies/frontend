"use client"

import type React from "react"

import {
  DashboardIcon,
  DeliveryIcon,
  MoneyReceivedIcon,
  ShopIcon,
} from "@/components/svgs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ChevronDown, LayoutDashboard, Menu, Search, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

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
  {
    title: "Dashboard",
    href: "/merchant/dashboard",
    icon: DashboardIcon,
  },
  {
    title: "Orders",
    href: "/merchant/orders",
    icon: ShopIcon,
    badge: "#F83B3B",
  },
  {
    title: "Products",
    href: "/merchant/products",
    icon: DashboardIcon,
    badge: "#F83B3B",
  },
  {
    title: "Wallet",
    href: "/merchant/wallet",
    icon: MoneyReceivedIcon,
  },
  {
    title: "Profile",
    href: "/merchant/profile",
    icon: User,
  },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  )

  // Initialize expanded state based on current path
  useEffect(() => {
    setExpandedItems({
      orders: pathname?.startsWith("/orders") || false,
      products: pathname?.startsWith("/products") || false,
    })
  }, [pathname])

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  // Get the current page title based on the pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname === "/orders") return "Orders"
    if (pathname === "/products") return "Products"
    if (pathname === "/wallet") return "Wallet"
    if (pathname === "/profile") return "Profile"
    return "Dashboard"
  }

  // Get the current page icon based on the pathname
  const getPageIcon = () => {
    if (pathname === "/dashboard")
      return <DashboardIcon className="text-primary" />
    if (pathname === "/orders") return <DeliveryIcon className="text-primary" />
    if (pathname?.startsWith("/orders"))
      return <ShopIcon className="text-primary" />
    if (pathname?.startsWith("/products"))
      return <DashboardIcon className="text-primary" />
    if (pathname === "/wallet")
      return <MoneyReceivedIcon className="text-primary" />
    if (pathname === "/profile") return <User className="text-primary" />
    return <LayoutDashboard />
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="w-full flex h-16 items-center border-b px-4">
        <div className="w-[190px] flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src="/images/merchants/merchant-3.png"
              alt="Palmy Mart"
              className="w-9 h-9"
            />
            <AvatarFallback className="bg-primary/20 text-[10px]/[20px] font-figtree font-normal text-black/900">
              PM
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block">
            <p className="text-[18px]/[120%] font-semibold font-figtree text-black-900">
              Palmy Mart
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {navItems.map((item, index) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/")

            return (
              <div key={index} className="flex flex-col">
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => toggleExpanded(item.title)}
                      className={cn(
                        "w-full h-[44px] flex gap-2 items-center justify-between rounded-[50px] p-3 text-sm/[20px] tracking-normal align-middle font-medium hover:bg-accent ",
                        isActive
                          ? "bg-primary text-white hover:bg-primary"
                          : "text-[#7C7C7C]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon />
                        <span>{item.title}</span>
                        {item.badge && (
                          <span className="ml-auto mr-2 h-2 w-2 rounded-full bg-#F83B3B-500" />
                        )}
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          expandedItems[item.title] ? "rotate-180" : ""
                        )}
                      />
                    </button>

                    {expandedItems[item.title] && (
                      <div className="ml-9 mt-1 space-y-1">
                        {item.subItems.map((subItem, subIndex) => {
                          const isSubActive = pathname === subItem.href
                          return (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className={cn(
                                "block rounded-md p-3 text-sm/[20px] hover:bg-accent",
                                isSubActive
                                  ? "bg-purple-50 text-primary"
                                  : "text-muted-foreground"
                              )}
                            >
                              {subItem.title}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "h-[44px] flex items-center gap-3 rounded-[50px] p-3 text-sm/[20px] font-medium hover:bg-accent cursor-pointer",
                      isActive
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "text-[#7C7C7C]"
                    )}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                    {item.badge && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-#F83B3B-500" />
                    )}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#F7F6FC]">
      {/* Fixed Sidebar - 100% height */}
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

      {/* Main Content Area */}
      <div className="flex w-full flex-col lg:ml-[222px]">
        {/* App Bar - Separate from sidebar */}
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
            <Button
              variant="outline"
              size="icon"
              className="rounded-full cursor-pointer"
            >
              <Search className="h-[20.27px] w-[20.27px]" />
              <span className="sr-only">Search</span>
            </Button>
            <div className="w-[165px] h-[34px] flex items-center justify-between gap-6">
              <div className="w-[123px] flex items-center gap-1">
                <Avatar>
                  <AvatarImage
                    src="/images/mr_Keneth.png"
                    alt="Keneth Smith"
                    className="w-8 h-8"
                  />
                  <AvatarFallback className="bg-primary/20 text-[10px]/[20px] font-figtree font-normal text-black/900">
                    KS
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <p className="text-sm/[20px] font-semibold font-figtree text-black-900">
                    Keneth Smith
                  </p>
                  <p className="text-[10px]/[20px] font-figtree font-normal text-[#666666]">
                    Owner
                  </p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
