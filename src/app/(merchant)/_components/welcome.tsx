"use client"

import { LockIcon } from "@/components/svgs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface TodoItem {
  id: string
  title: string
  actionText: string
  completed: boolean
  href: string
}

export default function WelcomeOnboard() {
  const router = useRouter()

  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: "kyc",
      title: "Complete KYC",
      actionText: "Start KYC",
      completed: false,
      href: "/kyc",
    },
    {
      id: "products",
      title: "Upload Products",
      actionText: "Add Products",
      completed: false,
      href: "/products",
    },
    {
      id: "address",
      title: "Verify Address",
      actionText: "Enable Location",
      completed: false,
      href: "/address",
    },
    {
      id: "profile",
      title: "Complete Store Profile",
      actionText: "Setup Profile",
      completed: false,
      href: "/profile",
    },
  ])

  const completedCount = todos.filter((todo) => todo.completed).length
  const totalCount = todos.length
  const completionPercentage = Math.round((completedCount / totalCount) * 100)

  const handleNavigateToSetup = (href: string) => {
    router.push(href)
  }

  const toggleTodoCompletion = (todoId: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    )
  }

  return (
    <div className="w-full bg-[#F7F6FC] p-9">
      <div className="w-full flex flex-col gap-6 bg-white rounded-[12px] p-9">
        <div className="w-full flex flex-col gap-2">
          {/* Header Section */}

          <h1 className="text-4xl/[40px] -tracking-[2%] font-bold font-figtree text-[#181719]">
            Welcome Onboard{" "}
            <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-[#636066] text-base/[140%] font-figtree font-normal -tracking-[2%]">
            You must complete your business profile before you can be verified
            to receive orders
          </p>
        </div>

        {/* Todo Section */}
        <div className="bg-[#F7F6FC] w-full py-[48px] px-9 rounded-3xl flex flex-col  gap-[36px]">
          <div className="w-full flex flex-col gap-5">
            {/* Lock Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full">
              <LockIcon />
            </div>

            <div className="flex items-center justify-between gap-[48px]">
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl/[120%] font-figtree font-semibold text-[#232323] -tracking-[2%]">
                  Here are your to-dos
                </h2>
                <p className="text-[#7C7C7C] font-figtree font-normal text-base/[120%] -tracking-[2%]">
                  Here are actions to take to verify your profile
                </p>
              </div>
              <Badge className="font-figtree font-normal bg-primary text-white px-2 py-1 text-[18px]/[140%] tracking-normal">
                {completionPercentage}% Complete [{completedCount}/{totalCount}]
              </Badge>
            </div>

            {/* Progress Bar */}
            <Progress value={completionPercentage} className="h-2" />
          </div>
          {/* Todo List */}
          <div className="w-full flex flex-col gap-[32px]">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="h-6 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer transition-colors ${
                      todo.completed
                        ? "bg-[#01B833] border-[#01B833]"
                        : "border-[#BDBDBD]"
                    }`}
                    onClick={() => toggleTodoCompletion(todo.id)}
                  >
                    {todo.completed && (
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-[#181719] font-figtree font-semibold text-[16px]/[120%] -tracking-[2%]`}
                  >
                    {todo.title}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  className="text-primary hover:bg-transparent font-medium text-[16px]/[120%] -tracking-[2%] hover:underline cursor-pointer"
                  onClick={() => handleNavigateToSetup(todo.href)}
                >
                  {todo.actionText}
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
