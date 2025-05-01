"use client"

import { useFileManager } from "./file-manager-provider"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Copy,
  Download,
  File,
  FileImage,
  FileIcon as FilePdf,
  FileText,
  FileVideo,
  MoreHorizontal,
  Pencil,
  Share2,
  Star,
  Trash2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface FileGridProps {
  files: any[]
  onFileClick?: (fileId: string) => void
}

export function FileGrid({ files, onFileClick }: FileGridProps) {
  const { currentCategory, searchQuery, selectedFiles, toggleFileSelection, sortBy, sortOrder } = useFileManager()

  // Sort files
  const sortedFiles = [...files].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
      case "date":
        comparison = new Date(b.modified).getTime() - new Date(a.modified).getTime()
        break
      case "size":
        // Simple string comparison for demo purposes
        comparison = a.size.localeCompare(b.size)
        break
      case "type":
        comparison = a.type.localeCompare(b.type)
        break
      default:
        comparison = 0
    }

    return sortOrder === "asc" ? comparison : -comparison
  })

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {sortedFiles.map((file) => (
        <FileGridItem
          key={file.id}
          file={file}
          selected={selectedFiles.includes(file.id)}
          onSelect={() => toggleFileSelection(file.id)}
          onDoubleClick={() => onFileClick?.(file.id)}
        />
      ))}
    </div>
  )
}

interface FileGridItemProps {
  file: any
  selected: boolean
  onSelect: () => void
  onDoubleClick?: () => void
}

function FileGridItem({ file, selected, onSelect, onDoubleClick }: FileGridItemProps) {
  const { toggleFileFavorite } = useFileManager()

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FilePdf className="h-8 w-8 text-red-500" />
      case "image":
        return <FileImage className="h-8 w-8 text-blue-500" />
      case "video":
        return <FileVideo className="h-8 w-8 text-purple-500" />
      case "document":
        return <FileText className="h-8 w-8 text-yellow-500" />
      case "spreadsheet":
        return <FileText className="h-8 w-8 text-green-500" />
      case "presentation":
        return <FileText className="h-8 w-8 text-orange-500" />
      default:
        return <File className="h-8 w-8 text-gray-500" />
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            "group relative flex flex-col items-center rounded-lg border p-4 transition-colors hover:bg-accent",
            selected && "border-primary bg-accent",
          )}
          onClick={(e) => {
            if (!e.defaultPrevented) {
              onSelect()
            }
          }}
          onDoubleClick={onDoubleClick}
        >
          <div className="absolute right-2 top-2">
            <Checkbox checked={selected} onCheckedChange={() => onSelect()} onClick={(e) => e.stopPropagation()} />
          </div>

          <div className="mb-2 mt-2">{getFileIcon(file.type)}</div>

          <div className="mb-1 w-full truncate text-center font-medium">{file.name}</div>

          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            <span>{file.size}</span>
            <div className="flex items-center">
              {!file.synced && (
                <Badge variant="outline" className="mr-1 px-1 text-xs">
                  Syncing...
                </Badge>
              )}
              {file.favorite && <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />}
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-4 w-4 cursor-pointer" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Pencil className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toggleFileFavorite(file.id)}>
                    <Star className={cn("mr-2 h-4 w-4", file.favorite && "fill-yellow-400 text-yellow-400")} />
                    {file.favorite ? "Remove from Favorites" : "Add to Favorites"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>
          <Download className="mr-2 h-4 w-4" />
          Download
        </ContextMenuItem>
        <ContextMenuItem>
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </ContextMenuItem>
        <ContextMenuItem>
          <Pencil className="mr-2 h-4 w-4" />
          Rename
        </ContextMenuItem>
        <ContextMenuItem>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </ContextMenuItem>
        <ContextMenuItem onClick={() => toggleFileFavorite(file.id)}>
          <Star className={cn("mr-2 h-4 w-4", file.favorite && "fill-yellow-400 text-yellow-400")} />
          {file.favorite ? "Remove from Favorites" : "Add to Favorites"}
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
