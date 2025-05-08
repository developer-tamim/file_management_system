import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import CategoryTree from "./CategoryTree"
import type { RootState, AppDispatch } from "../store" // Adjust to your store location

interface CategorySectionProps {
  title?: string
  currentCategory: string
  onUpdateCategory: (id: string) => void
}

const CategorySection: React.FC<CategorySectionProps> = ({
  title = "Categories",
  currentCategory,
  onUpdateCategory,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const categories = useSelector((state: RootState) => state.categories)
  const [isOpen, setIsOpen] = useState(true)
  const [showInput, setShowInput] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [addingToParentId, setAddingToParentId] = useState<string | undefined>(undefined)
  const categoryInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    dispatch({ type: "fetchCategories" }) // Replace with fetchCategories() thunk if defined
  }, [dispatch])

  const toggleOpen = () => setIsOpen(!isOpen)

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      await dispatch({
        type: "createCategory",
        payload: {
          name: newCategory.trim(),
          parentId: addingToParentId,
        },
      })
      setNewCategory("")
      setShowInput(false)
      setAddingToParentId(undefined)
    }
  }

  const handleCancelAddCategory = () => {
    setNewCategory("")
    setShowInput(false)
    setAddingToParentId(undefined)
  }

  const addCategory = (parentId: string) => {
    setAddingToParentId(parentId)
    setShowInput(true)
    setTimeout(() => {
      categoryInputRef.current?.focus()
    }, 0)
  }

  return (
    <div className="p-4 border rounded-md shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button onClick={toggleOpen} className="text-sm text-blue-500">
          {isOpen ? "Hide" : "Show"}
        </button>
      </div>

      {isOpen && (
        <>
          <CategoryTree
            categories={categories}
            currentCategory={currentCategory}
            onUpdateCategory={onUpdateCategory}
            onAddCategory={addCategory}
          />

          {showInput && (
            <div className="mt-4 flex gap-2 items-center">
              <input
                ref={categoryInputRef}
                type="text"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="border p-2 rounded w-full"
                placeholder="New category name"
              />
              <button
                onClick={handleAddCategory}
                className="px-3 py-2 bg-blue-500 text-white rounded"
              >
                Add
              </button>
              <button
                onClick={handleCancelAddCategory}
                className="px-3 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default CategorySection
