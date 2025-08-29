"use client"

import type * as React from "react"
import {
  BarChart3,
  Users,
  FileText,
  Settings,
  Home,
  PanelLeft,
  Bell,
  Search,
  User,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Menu items for the dashboard
const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    url: "#",
    isActive: true,
  },
  {
    title: "Analytics",
    icon: BarChart3,
    url: "#",
  },
  {
    title: "Customers",
    icon: Users,
    url: "#",
  },
  {
    title: "Reports",
    icon: FileText,
    url: "#",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "#",
  },
]

export function DashboardSidebar({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-4 py-2">
              <PanelLeft className="h-6 w-6" />
              <span className="text-xl font-bold">Dashboard</span>
            </div>
            <div className="px-4 py-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-8 h-9" />
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={item.isActive}
                        tooltip={item.title}
                      >
                        <a href={item.url} className="flex items-center">
                          <item.icon className="mr-2 h-5 w-5" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt="User"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-sm">
                  <span className="font-medium">John Doe</span>
                  <span className="text-xs text-muted-foreground">Admin</span>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <User className="h-4 w-4" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SidebarFooter>

          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-16">
            <SidebarTrigger />
            <div className="flex-1" />
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
