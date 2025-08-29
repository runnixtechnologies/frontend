import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { initialCategoryData } from "../../constants"
import { CreateCategoryData } from "../../types"
import { CreateCategoryForm } from "./form"

export default function NewCategory() {
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false)

  const handleCreateCategory = (newCategory: CreateCategoryData) => {
    if (newCategory.isNewMainCategory) {
      // Create new main category
      if (initialCategoryData[newCategory.name]) {
        toast.error("Main category already exists!")
        return
      }

      toast.success(`Main category "${newCategory.name}" created successfully!`)
    } else {
      toast.success(`Category "${newCategory.name}" created successfully!`)
    }

    setIsCreateCategoryOpen(false)
  }
  return (
    <Dialog open={isCreateCategoryOpen} onOpenChange={setIsCreateCategoryOpen}>
      <DialogTrigger asChild>
        <Button className="cursor-pointer">
          <PlusCircle /> Create Category
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <CreateCategoryForm
          onSubmit={handleCreateCategory}
          onClose={() => setIsCreateCategoryOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
