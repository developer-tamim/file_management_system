import React, { useState } from "react"

interface Category {
  id: string
  name: string
  children?: Category[]
}

interface CategoryTreeProps {
  categories: Category[]
  currentCategory: string
  onUpdateCategory: (categoryId: string) => void
  onAddCategory: (parentId: string) => void
}

const CategoryTree: React.FC<CategoryTreeProps> = ({
  categories,
  currentCategory,
  onUpdateCategory,
  onAddCategory,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const toggleCategoryExpanded = (categoryId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const isCategoryExpanded = (categoryId: string) =>
    expandedCategories[categoryId] || currentCategory === categoryId

  const hasChildren = (category: Category) =>
    category.children && category.children.length > 0

  const renderCategories = (categories: Category[], depth = 0) => (
    <ul className={`pl-${depth * 4}`}>
      {categories.map(category => (
        <li key={category.id}>
          <div className="flex items-center gap-2">
            {hasChildren(category) && (
              <button onClick={() => toggleCategoryExpanded(category.id)}>
                {isCategoryExpanded(category.id) ? "−" : "+"}
              </button>
            )}
            <span
              className={`cursor-pointer ${
                currentCategory === category.id ? "font-bold" : ""
              }`}
              onClick={() => onUpdateCategory(category.id)}
            >
              {category.name}
            </span>
            <button onClick={() => onAddCategory(category.id)}>➕</button>
          </div>
          {hasChildren(category) && isCategoryExpanded(category.id) && category.children && (
            renderCategories(category.children, depth + 1)
          )}
        </li>
      ))}
    </ul>
  )

  return <div>{renderCategories(categories)}</div>
}

export default CategoryTree
