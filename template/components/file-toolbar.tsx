"use client"

import { useFileManager } from "./file-manager-provider"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Copy, Download, Info, MoreHorizontal, Pencil, Share2, Star, Trash2 } from "lucide-react"

interface FileToolbarProps {
  detailsPanelOpen: boolean
  onDetailsPanelOpenChange: (open: boolean) => void
  onUpload: () => void
}

export function FileToolbar({ detailsPanelOpen, onDetailsPanelOpenChange, onUpload }: FileToolbarProps) {
  const { selectedFiles, setSelectedFiles, toggleFileFavorite } = useFileManager()

  return (
    <div className="border-b px-4 py-2">
      <div className="flex items-center gap-2">
        {selectedFiles.length > 0 ? (
          <>
            <Button variant="ghost" size="sm" onClick={() => setSelectedFiles([])}>
              Clear selection ({selectedFiles.length})
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">Download</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Rename</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => selectedFiles.forEach((id) => toggleFileFavorite(id))}>
              <Star className="h-4 w-4" />
              <span className="sr-only">Favorite</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
            <Button
              variant={detailsPanelOpen ? "secondary" : "ghost"}
              size="icon"
              onClick={() => onDetailsPanelOpenChange(!detailsPanelOpen)}
            >
              <Info className="h-4 w-4" />
              <span className="sr-only">Info</span>
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>Move to folder</DropdownMenuItem>
                <DropdownMenuItem>Add tag</DropdownMenuItem>
                <DropdownMenuItem>Archive</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Delete permanently</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">Select files to perform actions</div>
        )}
      </div>
    </div>
  )
}
