"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Share2, Star, X } from "lucide-react"
import { FileIcon as FilePdf, FileText, FileVideo } from "lucide-react"

interface FilePreviewModalProps {
  file: any
  onClose: () => void
}

export function FilePreviewModal({ file, onClose }: FilePreviewModalProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [file])

  const renderPreview = () => {
    if (loading) {
      return (
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      )
    }

    switch (file.type) {
      case "image":
        return (
          <div className="flex h-full items-center justify-center bg-black/5">
            <img
              src={`/placeholder.svg?height=400&width=600&text=${file.name}`}
              alt={file.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        )
      case "pdf":
        return (
          <div className="flex h-full flex-col items-center justify-center bg-black/5 p-8">
            <FilePdf className="h-20 w-20 text-red-500" />
            <p className="mt-4 text-center text-lg font-medium">{file.name}</p>
            <p className="text-center text-sm text-muted-foreground">PDF Preview Not Available</p>
            <Button className="mt-4" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download to View
            </Button>
          </div>
        )
      case "video":
        return (
          <div className="flex h-full flex-col items-center justify-center bg-black/5 p-8">
            <FileVideo className="h-20 w-20 text-purple-500" />
            <p className="mt-4 text-center text-lg font-medium">{file.name}</p>
            <p className="text-center text-sm text-muted-foreground">Video Preview Not Available</p>
            <Button className="mt-4" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download to View
            </Button>
          </div>
        )
      default:
        return (
          <div className="flex h-full flex-col items-center justify-center bg-black/5 p-8">
            <FileText className="h-20 w-20 text-blue-500" />
            <p className="mt-4 text-center text-lg font-medium">{file.name}</p>
            <p className="text-center text-sm text-muted-foreground">Preview Not Available</p>
            <Button className="mt-4" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download to View
            </Button>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-3xl border-l bg-background shadow-xl">
      <div className="flex h-16 items-center justify-between border-b px-4">
        <h3 className="font-semibold">File Preview</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Download className="h-4 w-4" />
            <span className="sr-only">Download</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Star className="h-4 w-4" />
            <span className="sr-only">Favorite</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)] flex-col">
        <div className="flex-1 overflow-hidden">{renderPreview()}</div>

        <Tabs defaultValue="details" className="border-t">
          <div className="border-b px-4">
            <TabsList className="w-full">
              <TabsTrigger value="details" className="flex-1">
                Details
              </TabsTrigger>
              <TabsTrigger value="comments" className="flex-1">
                Comments
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="details" className="p-0">
            <ScrollArea className="h-64">
              <div className="space-y-4 p-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">{file.description || "No description available."}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground">Type</h4>
                    <p className="text-sm capitalize">{file.type}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground">Size</h4>
                    <p className="text-sm">{file.size}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground">Created</h4>
                    <p className="text-sm">{file.created || file.modified}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground">Modified</h4>
                    <p className="text-sm">{file.modified}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground">Category</h4>
                    <p className="text-sm capitalize">{file.category}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-muted-foreground">Owner</h4>
                    <p className="text-sm">{file.owner || "You"}</p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="comments" className="p-0">
            <ScrollArea className="h-64">
              <div className="p-4">
                <p className="text-center text-sm text-muted-foreground">No comments yet.</p>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
