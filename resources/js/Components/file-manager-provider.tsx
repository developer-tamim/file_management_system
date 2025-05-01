"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"

type Category = "all" | "residential" | "commercial" | "marketing" | "real-estate" | string
type ViewMode = "grid" | "list"
type SortBy = "name" | "date" | "size" | "type"
type SortOrder = "asc" | "desc"

interface CategoryItem {
  id: string
  label: string
  parentId?: string
  children?: CategoryItem[]
}

interface FileItem {
  id: string
  name: string
  type: string
  size: string
  modified: string
  category: string
  synced: boolean
  description?: string
  favorite?: boolean
  shared?: boolean
  recentlyOpened?: boolean
}

interface FileManagerContextType {
  currentCategory: Category
  setCurrentCategory: (category: Category) => void
  categories: CategoryItem[]
  addCategory: (category: string, parentId?: string) => void
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  sortBy: SortBy
  setSortBy: (sort: SortBy) => void
  sortOrder: SortOrder
  setSortOrder: (order: SortOrder) => void
  selectedFiles: string[]
  setSelectedFiles: (files: string[]) => void
  toggleFileSelection: (fileId: string) => void
  previewFile: string | null
  setPreviewFile: (fileId: string | null) => void
  newFolderModalOpen: boolean
  setNewFolderModalOpen: (open: boolean) => void
  createFolder: (name: string, category: string) => void
  connectStorageModalOpen: boolean
  setConnectStorageModalOpen: (open: boolean) => void
  uploadModalOpen: boolean
  setUploadModalOpen: (open: boolean) => void
  changePasswordModalOpen: boolean
  setChangePasswordModalOpen: (open: boolean) => void
  profileModalOpen: boolean
  setProfileModalOpen: (open: boolean) => void
  files: FileItem[]
  toggleFileFavorite: (fileId: string) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  filterOptions: {
    fileTypes: string[]
    dateModified: string
  }
  setFilterOptions: (options: { fileTypes: string[]; dateModified: string }) => void
}

const FileManagerContext = createContext<FileManagerContextType | undefined>(undefined)

// Sample data for demonstration
const sampleFiles: FileItem[] = [
  {
    id: "1",
    name: "Property Listing.pdf",
    type: "pdf",
    size: "2.4 MB",
    modified: "2023-04-15",
    category: "residential",
    synced: true,
    description: "Detailed property listing for 123 Main St.",
    favorite: true,
    shared: true,
    recentlyOpened: true,
  },
  {
    id: "2",
    name: "Marketing Brochure.pdf",
    type: "pdf",
    size: "3.8 MB",
    modified: "2023-04-10",
    category: "marketing",
    synced: true,
    description: "Marketing materials for spring campaign.",
    favorite: false,
    shared: true,
    recentlyOpened: true,
  },
  {
    id: "3",
    name: "Property Photo 1.jpg",
    type: "image",
    size: "1.2 MB",
    modified: "2023-04-08",
    category: "residential",
    synced: true,
    description: "Front view of 123 Main St property.",
    favorite: true,
    shared: false,
    recentlyOpened: false,
  },
  {
    id: "4",
    name: "Property Photo 2.jpg",
    type: "image",
    size: "1.5 MB",
    modified: "2023-04-08",
    category: "residential",
    synced: false,
    description: "Backyard view of 123 Main St property.",
    favorite: false,
    shared: false,
    recentlyOpened: true,
  },
  {
    id: "5",
    name: "Commercial Lease.docx",
    type: "document",
    size: "567 KB",
    modified: "2023-04-05",
    category: "commercial",
    synced: true,
    description: "Standard commercial lease agreement template.",
    favorite: false,
    shared: true,
    recentlyOpened: false,
  },
  {
    id: "6",
    name: "Property Video.mp4",
    type: "video",
    size: "24.8 MB",
    modified: "2023-04-01",
    category: "marketing",
    synced: false,
    description: "Virtual tour of 123 Main St property.",
    favorite: true,
    shared: true,
    recentlyOpened: true,
  },
  {
    id: "7",
    name: "Financial Report.xlsx",
    type: "spreadsheet",
    size: "845 KB",
    modified: "2023-03-28",
    category: "commercial",
    synced: true,
    description: "Q1 financial analysis for commercial properties.",
    favorite: false,
    shared: false,
    recentlyOpened: false,
  },
  {
    id: "8",
    name: "Client List.xlsx",
    type: "spreadsheet",
    size: "1.1 MB",
    modified: "2023-03-25",
    category: "real-estate",
    synced: true,
    description: "Master list of all current clients and their properties.",
    favorite: true,
    shared: true,
    recentlyOpened: true,
  },
  {
    id: "9",
    name: "Market Analysis.pdf",
    type: "pdf",
    size: "4.2 MB",
    modified: "2023-03-20",
    category: "real-estate",
    synced: true,
    description: "Analysis of current real estate market trends.",
    favorite: false,
    shared: false,
    recentlyOpened: false,
  },
  {
    id: "10",
    name: "Property Valuation.docx",
    type: "document",
    size: "723 KB",
    modified: "2023-03-15",
    category: "residential",
    synced: true,
    description: "Valuation report for 123 Main St property.",
    favorite: false,
    shared: false,
    recentlyOpened: true,
  },
  {
    id: "11",
    name: "Neighborhood Map.jpg",
    type: "image",
    size: "2.8 MB",
    modified: "2023-03-10",
    category: "residential",
    synced: true,
    description: "Map showing amenities near 123 Main St property.",
    favorite: true,
    shared: false,
    recentlyOpened: false,
  },
  {
    id: "12",
    name: "Sales Presentation.pptx",
    type: "presentation",
    size: "5.7 MB",
    modified: "2023-03-05",
    category: "marketing",
    synced: true,
    description: "Presentation for potential buyers of luxury properties.",
    favorite: false,
    shared: true,
    recentlyOpened: true,
  },
]

export function FileManagerProvider({ children }: { children: React.ReactNode }) {
  const [currentCategory, setCurrentCategory] = useState<Category>("all")
  const [categories, setCategories] = useState<CategoryItem[]>([
    {
      id: "residential",
      label: "Residential",
      children: [
        { id: "residential-listings", label: "Listings" },
        { id: "residential-photos", label: "Photos" },
        { id: "residential-documents", label: "Documents" },
      ],
    },
    {
      id: "commercial",
      label: "Commercial",
      children: [
        { id: "commercial-leases", label: "Leases" },
        { id: "commercial-properties", label: "Properties" },
      ],
    },
    {
      id: "marketing",
      label: "Marketing",
      children: [
        { id: "marketing-brochures", label: "Brochures" },
        { id: "marketing-presentations", label: "Presentations" },
        { id: "marketing-videos", label: "Videos" },
      ],
    },
    {
      id: "real-estate",
      label: "Real Estate",
      children: [
        { id: "real-estate-market", label: "Market Analysis" },
        { id: "real-estate-clients", label: "Client Data" },
      ],
    },
  ])
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortBy>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [previewFile, setPreviewFile] = useState<string | null>(null)
  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false)
  const [connectStorageModalOpen, setConnectStorageModalOpen] = useState(false)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [files, setFiles] = useState<FileItem[]>(sampleFiles)
  const [activeTab, setActiveTab] = useState("files")
  const [filterOptions, setFilterOptions] = useState({
    fileTypes: [],
    dateModified: "",
  })

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) => (prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]))
  }

  const toggleFileFavorite = (fileId: string) => {
    setFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, favorite: !file.favorite } : file)))
  }

  const addCategory = (category: string, parentId?: string) => {
    const id = category.toLowerCase().replace(/\s+/g, "-")

    if (parentId) {
      // Add as a child to an existing category
      setCategories((prev) => {
        const newCategories = [...prev]
        const findAndAddChild = (items: CategoryItem[]): boolean => {
          for (let i = 0; i < items.length; i++) {
            if (items[i].id === parentId) {
              if (!items[i].children) {
                items[i].children = []
              }
              items[i].children.push({ id: `${parentId}-${id}`, label: category, parentId })
              return true
            }
            if (items[i].children && findAndAddChild(items[i].children)) {
              return true
            }
          }
          return false
        }

        findAndAddChild(newCategories)
        return newCategories
      })
    } else {
      // Add as a top-level category
      if (!categories.some((c) => c.id === id)) {
        setCategories((prev) => [...prev, { id, label: category }])
      }
    }
  }

  const createFolder = (name: string, category: string) => {
    // In a real app, this would create a folder in the backend
    console.log(`Created folder "${name}" in category "${category}"`)
    // For demo purposes, we'll just log it
  }

  return (
    <FileManagerContext.Provider
      value={{
        currentCategory,
        setCurrentCategory,
        categories,
        addCategory,
        viewMode,
        setViewMode,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        selectedFiles,
        setSelectedFiles,
        toggleFileSelection,
        previewFile,
        setPreviewFile,
        newFolderModalOpen,
        setNewFolderModalOpen,
        createFolder,
        connectStorageModalOpen,
        setConnectStorageModalOpen,
        uploadModalOpen,
        setUploadModalOpen,
        changePasswordModalOpen,
        setChangePasswordModalOpen,
        profileModalOpen,
        setProfileModalOpen,
        files,
        toggleFileFavorite,
        activeTab,
        setActiveTab,
        filterOptions,
        setFilterOptions,
      }}
    >
      {children}
    </FileManagerContext.Provider>
  )
}

export function useFileManager() {
  const context = useContext(FileManagerContext)
  if (!context) {
    throw new Error("useFileManager must be used within a FileManagerProvider")
  }
  return context
}
