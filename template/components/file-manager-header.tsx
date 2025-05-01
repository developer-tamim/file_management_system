"use client"
import { useFileManager } from "./file-manager-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChevronDown,
  Filter,
  FolderPlus,
  Grid,
  List,
  LogOut,
  Menu,
  Search,
  SlidersHorizontal,
  Upload,
  User,
  UserCircle,
  Lock,
} from "lucide-react"
import { ProfileModal } from "./profile-modal"
import { ChangePasswordModal } from "./change-password-modal"
import { NewFolderModal } from "./new-folder-modal"

interface FileManagerHeaderProps {
  sidebarOpen: boolean
  onSidebarOpenChange: (open: boolean) => void
}

export function FileManagerHeader({ sidebarOpen, onSidebarOpenChange }: FileManagerHeaderProps) {
  const {
    currentCategory,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    categories,
    filterOptions,
    setFilterOptions,
    profileModalOpen,
    setProfileModalOpen,
    changePasswordModalOpen,
    setChangePasswordModalOpen,
    newFolderModalOpen,
    setNewFolderModalOpen,
    uploadModalOpen,
    setUploadModalOpen,
    createFolder,
  } = useFileManager()

  const getCategoryLabel = (categoryId: string) => {
    if (categoryId === "all") return "All Files"

    // Find in top-level categories
    const category = categories.find((c) => c.id === categoryId)
    if (category) return category.label

    // Check in subcategories
    for (const topCategory of categories) {
      if (topCategory.children) {
        const subCategory = topCategory.children.find((c) => c.id === categoryId)
        if (subCategory) return subCategory.label
      }
    }

    return categoryId.charAt(0).toUpperCase() + categoryId.slice(1)
  }

  return (
    <div className="border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <Button variant="ghost" size="icon" className="mr-2" onClick={() => onSidebarOpenChange(!sidebarOpen)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        <h1 className="text-xl font-semibold">{getCategoryLabel(currentCategory)}</h1>

        <div className="ml-auto flex items-center gap-2">
          <Button size="sm" className="gap-2" onClick={() => setUploadModalOpen(true)}>
            <Upload className="h-4 w-4" />
            Upload
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setNewFolderModalOpen(true)}>
            <FolderPlus className="h-4 w-4" />
            New Folder
          </Button>

          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search files..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">File Type</p>
                  <div className="flex flex-wrap gap-1">
                    <DropdownMenuCheckboxItem
                      checked={filterOptions.fileTypes.includes("image")}
                      onCheckedChange={(checked) => {
                        setFilterOptions({
                          ...filterOptions,
                          fileTypes: checked
                            ? [...filterOptions.fileTypes, "image"]
                            : filterOptions.fileTypes.filter((t) => t !== "image"),
                        })
                      }}
                    >
                      Images
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filterOptions.fileTypes.includes("document")}
                      onCheckedChange={(checked) => {
                        setFilterOptions({
                          ...filterOptions,
                          fileTypes: checked
                            ? [...filterOptions.fileTypes, "document"]
                            : filterOptions.fileTypes.filter((t) => t !== "document"),
                        })
                      }}
                    >
                      Documents
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filterOptions.fileTypes.includes("video")}
                      onCheckedChange={(checked) => {
                        setFilterOptions({
                          ...filterOptions,
                          fileTypes: checked
                            ? [...filterOptions.fileTypes, "video"]
                            : filterOptions.fileTypes.filter((t) => t !== "video"),
                        })
                      }}
                    >
                      Videos
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={filterOptions.fileTypes.includes("spreadsheet")}
                      onCheckedChange={(checked) => {
                        setFilterOptions({
                          ...filterOptions,
                          fileTypes: checked
                            ? [...filterOptions.fileTypes, "spreadsheet"]
                            : filterOptions.fileTypes.filter((t) => t !== "spreadsheet"),
                        })
                      }}
                    >
                      Spreadsheets
                    </DropdownMenuCheckboxItem>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="mt-3 space-y-1">
                  <p className="text-sm font-medium">Date Modified</p>
                  <DropdownMenuRadioGroup
                    value={filterOptions.dateModified}
                    onValueChange={(value) => {
                      setFilterOptions({
                        ...filterOptions,
                        dateModified: value,
                      })
                    }}
                  >
                    <DropdownMenuRadioItem value="today">Today</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="week">Last 7 days</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="month">Last 30 days</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="all">All time</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-1">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="size">Size</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
              <ChevronDown className={`h-4 w-4 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />
            </Button>
          </div>

          <div className="flex items-center rounded-md border">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-r-none"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="rounded-l-none"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
          </div>

          <Button variant="ghost" size="icon">
            <SlidersHorizontal className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserCircle className="h-5 w-5" />
                <span className="sr-only">User profile</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setProfileModalOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChangePasswordModalOpen(true)}>
                <Lock className="mr-2 h-4 w-4" />
                Update Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ProfileModal open={profileModalOpen} onOpenChange={setProfileModalOpen} />
      <ChangePasswordModal open={changePasswordModalOpen} onOpenChange={setChangePasswordModalOpen} />
      <NewFolderModal open={newFolderModalOpen} onOpenChange={setNewFolderModalOpen} onCreateFolder={createFolder} />
    </div>
  )
}
