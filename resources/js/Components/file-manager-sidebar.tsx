"use client"

import type React from "react"

import { useState } from "react"
import { useFileManager } from "./file-manager-provider"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ChevronDown,
  ChevronRight,
  Cloud,
  Folder,
  FolderOpen,
  HardDrive,
  Home,
  LayoutGrid,
  Plus,
  Settings,
  X,
} from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ConnectStorageModal } from "./connect-storage-modal"

interface FileManagerSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FileManagerSidebar({ open, onOpenChange }: FileManagerSidebarProps) {
  const { currentCategory, setCurrentCategory, connectStorageModalOpen, setConnectStorageModalOpen } = useFileManager()

  return (
    <div className={cn("h-full border-r bg-background transition-all duration-300 ease-in-out", open ? "w-64" : "w-0")}>
      {open && (
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center border-b px-4">
            <h2 className="text-lg font-semibold">File Manager</h2>
          </div>

          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1 py-2">
              <Button
                variant={currentCategory === "all" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setCurrentCategory("all")}
              >
                <Home className="mr-2 h-4 w-4" />
                All Files
              </Button>

              <CategorySection
                title="Categories"
                currentCategory={currentCategory}
                onCategoryChange={setCurrentCategory}
              />

              <StorageSection onConnectStorage={() => setConnectStorageModalOpen(true)} />
            </div>
          </ScrollArea>

          <div className="mt-auto border-t p-4">
            <Button variant="outline" className="w-full justify-start gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      )}

      <ConnectStorageModal open={connectStorageModalOpen} onOpenChange={setConnectStorageModalOpen} />
    </div>
  )
}

interface CategorySectionProps {
  title: string
  currentCategory: string
  onCategoryChange: (category: any) => void
}

function CategorySection({ title, currentCategory, onCategoryChange }: CategorySectionProps) {
  const [open, setOpen] = useState(true)
  const [showInput, setShowInput] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [addingToParentId, setAddingToParentId] = useState<string | undefined>(undefined)
  const { categories, addCategory } = useFileManager()

  // Track which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  const toggleCategoryExpanded = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const isCategoryExpanded = (categoryId: string) => {
    return expandedCategories[categoryId] || currentCategory === categoryId
  }

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      addCategory(newCategory.trim(), addingToParentId)
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

  // Pre-compute all category items to avoid hooks in render functions
  const categoryItems = categories.map((item) => {
    return renderCategoryItemTree(item, 0, {
      currentCategory,
      onCategoryChange,
      expandedCategories,
      toggleCategoryExpanded,
      setAddingToParentId,
      setShowInput,
    })
  })

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="space-y-1">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          <div className="flex items-center">
            <LayoutGrid className="mr-2 h-4 w-4" />
            {title}
          </div>
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pl-6">
        {categoryItems}

        {showInput ? (
          <div className="flex gap-1">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder={addingToParentId ? "Subcategory name" : "Category name"}
              className="h-8"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCategory()
                if (e.key === "Escape") handleCancelAddCategory()
              }}
              autoFocus
            />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleAddCategory}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCancelAddCategory}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            onClick={() => {
              setShowInput(true)
              setAddingToParentId(undefined)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        )}
      </CollapsibleContent>
    </Collapsible>
  )
}

// Helper function to render category items without using hooks
function renderCategoryItemTree(item: any, depth = 0, props: any) {
  const {
    currentCategory,
    onCategoryChange,
    expandedCategories,
    toggleCategoryExpanded,
    setAddingToParentId,
    setShowInput,
  } = props

  const hasChildren = item.children && item.children.length > 0
  const isExpanded = expandedCategories[item.id] || currentCategory === item.id

  return (
    <div key={item.id} className="space-y-1">
      <div className="group flex items-center">
        {hasChildren ? (
          <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={() => toggleCategoryExpanded(item.id)}>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        ) : (
          <div className="w-6" />
        )}
        <Button
          variant={currentCategory === item.id ? "secondary" : "ghost"}
          className={cn("h-8 w-full justify-start", depth > 0 && "pl-2")}
          onClick={() => onCategoryChange(item.id)}
        >
          {isExpanded ? <FolderOpen className="mr-2 h-4 w-4" /> : <Folder className="mr-2 h-4 w-4" />}
          <span className="ml-2">{item.label}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
          onClick={() => {
            setAddingToParentId(item.id)
            setShowInput(true)
          }}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {isExpanded && hasChildren && (
        <div className={cn("pl-6 space-y-1", depth > 0 && "pl-2")}>
          {item.children.map((child: any) => renderCategoryItemTree(child, depth + 1, props))}
        </div>
      )}
    </div>
  )
}

interface StorageSectionProps {
  onConnectStorage: () => void
}

function StorageSection({ onConnectStorage }: StorageSectionProps) {
  const [open, setOpen] = useState(true)

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="space-y-1">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="w-full justify-between">
          <div className="flex items-center">
            <HardDrive className="mr-2 h-4 w-4" />
            Storage
          </div>
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pl-6">
        <StorageItem name="Local Drive" icon={<HardDrive className="h-4 w-4" />} used={75} total={100} />
        <StorageItem name="Google Drive" icon={<Cloud className="h-4 w-4" />} used={15} total={30} />
        <StorageItem name="Dropbox" icon={<Cloud className="h-4 w-4" />} used={5} total={20} />
        <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={onConnectStorage}>
          <Plus className="mr-2 h-4 w-4" />
          Connect Storage
        </Button>
      </CollapsibleContent>
    </Collapsible>
  )
}

interface StorageItemProps {
  name: string
  icon: React.ReactNode
  used: number
  total: number
}

function StorageItem({ name, icon, used, total }: StorageItemProps) {
  const percentage = (used / total) * 100

  return (
    <div className="space-y-1 py-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {icon}
          <span className="ml-2 text-sm">{name}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {used}GB / {total}GB
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-secondary">
        <div className="h-full rounded-full bg-primary" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
