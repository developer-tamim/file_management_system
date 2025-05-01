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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useMemo } from "react"
import { Button } from "@/components/ui/button"

interface FileListProps {
  files: any[]
  onFileClick?: (fileId: string) => void
}

export function FileList({ files, onFileClick }: FileListProps) {
  const { sortBy, sortOrder, selectedFiles, toggleFileSelection, setSelectedFiles, toggleFileFavorite } =
    useFileManager()

  // Sort files
  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
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
  }, [files, sortBy, sortOrder])

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FilePdf className="h-4 w-4 text-red-500" />
      case "image":
        return <FileImage className="h-4 w-4 text-blue-500" />
      case "video":
        return <FileVideo className="h-4 w-4 text-purple-500" />
      case "document":
        return <FileText className="h-4 w-4 text-yellow-500" />
      case "spreadsheet":
        return <FileText className="h-4 w-4 text-green-500" />
      case "presentation":
        return <FileText className="h-4 w-4 text-orange-500" />
      default:
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  return (
    <div className="relative">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox
                checked={selectedFiles.length > 0 && selectedFiles.length === files.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    // Select all files
                    const allFileIds = files.map((file) => file.id)
                    setSelectedFiles(allFileIds)
                  } else {
                    // Deselect all files
                    setSelectedFiles([])
                  }
                }}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Modified</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedFiles.map((file) => (
            <TableRow
              key={file.id}
              className={cn("cursor-pointer", selectedFiles.includes(file.id) && "bg-accent")}
              onClick={() => toggleFileSelection(file.id)}
              onDoubleClick={() => onFileClick?.(file.id)}
            >
              <TableCell>
                <Checkbox
                  checked={selectedFiles.includes(file.id)}
                  onCheckedChange={() => toggleFileSelection(file.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getFileIcon(file.type)}
                  <span>{file.name}</span>
                  {!file.synced && (
                    <Badge variant="outline" className="ml-2 px-1 text-xs">
                      Syncing...
                    </Badge>
                  )}
                  {file.favorite && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                </div>
              </TableCell>
              <TableCell>{file.modified}</TableCell>
              <TableCell>{file.size}</TableCell>
              <TableCell className="capitalize">{file.category}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4 cursor-pointer" />
                      <span className="sr-only">More options</span>
                    </Button>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ContextMenu>
        <ContextMenuTrigger className="contents">
          <div className="absolute inset-0 z-[-1]" />
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <Download className="mr-2 h-4 w-4" />
            Download Selected
          </ContextMenuItem>
          <ContextMenuItem>
            <Share2 className="mr-2 h-4 w-4" />
            Share Selected
          </ContextMenuItem>
          <ContextMenuItem>
            <Copy className="mr-2 h-4 w-4" />
            Copy Selected
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
