"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useFileManager } from "./file-manager-provider"
import { FileUp, Folder, X } from "lucide-react"

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadModal({ open, onOpenChange }: UploadModalProps) {
  const { categories, currentCategory } = useFileManager()
  const [uploadCategory, setUploadCategory] = useState(currentCategory)
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleUpload = () => {
    if (files.length === 0) return

    setUploading(true)

    // Simulate upload progress
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += 5
      setProgress(currentProgress)

      if (currentProgress >= 100) {
        clearInterval(interval)
        setUploading(false)
        onOpenChange(false)
        setFiles([])
        setProgress(0)
      }
    }, 200)
  }

  const flattenCategories = (categories: any[]): { id: string; label: string }[] => {
    let result: { id: string; label: string }[] = []

    categories.forEach((category) => {
      result.push({ id: category.id, label: category.label })

      if (category.children && category.children.length > 0) {
        const childCategories = flattenCategories(category.children)
        result = [...result, ...childCategories]
      }
    })

    return result
  }

  const allCategories = [{ id: "all", label: "All Files" }, ...flattenCategories(categories)]

  return (
    <Dialog open={open} onOpenChange={uploading ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>Select files to upload to your file manager.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="category">Upload to Category</Label>
            <Select value={uploadCategory} onValueChange={setUploadCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="files">Files</Label>
            <div className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed border-input bg-muted/50 p-4">
              {files.length === 0 ? (
                <>
                  <FileUp className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drag and drop files here or click to browse</p>
                  <Input id="files" type="file" multiple className="hidden" onChange={handleFileChange} />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => document.getElementById("files")?.click()}
                  >
                    Browse Files
                  </Button>
                </>
              ) : (
                <div className="w-full space-y-2 overflow-auto">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between rounded-md bg-background p-2">
                      <div className="flex items-center">
                        <Folder className="mr-2 h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Upload Progress</Label>
                <span className="text-sm">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={files.length === 0 || uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
