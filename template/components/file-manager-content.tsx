"use client"

import { useState } from "react"
import { useFileManager } from "./file-manager-provider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileGrid } from "./file-grid"
import { FileList } from "./file-list"
import { FileToolbar } from "./file-toolbar"
import { FileDetailsPanel } from "./file-details-panel"
import { FilePreviewModal } from "./file-preview-modal"
import { UploadModal } from "./upload-modal"

export function FileManagerContent() {
  const {
    viewMode,
    selectedFiles,
    previewFile,
    setPreviewFile,
    files,
    activeTab,
    setActiveTab,
    uploadModalOpen,
    setUploadModalOpen,
    filterOptions,
  } = useFileManager()
  const [detailsPanelOpen, setDetailsPanelOpen] = useState(false)

  // Find the file being previewed
  const fileToPreview = previewFile ? files.find((f) => f.id === previewFile) : null

  // Filter files based on the active tab
  const getFilteredFiles = () => {
    let filteredFiles = [...files]

    // Apply file type filters if any are selected
    if (filterOptions.fileTypes.length > 0) {
      filteredFiles = filteredFiles.filter((file) => filterOptions.fileTypes.includes(file.type))
    }

    // Apply date filter
    if (filterOptions.dateModified) {
      const now = new Date()
      let cutoffDate = new Date()

      switch (filterOptions.dateModified) {
        case "today":
          cutoffDate.setHours(0, 0, 0, 0)
          break
        case "week":
          cutoffDate.setDate(now.getDate() - 7)
          break
        case "month":
          cutoffDate.setDate(now.getDate() - 30)
          break
        default:
          // 'all' - no date filtering
          cutoffDate = new Date(0)
      }

      if (filterOptions.dateModified !== "all") {
        filteredFiles = filteredFiles.filter((file) => {
          const fileDate = new Date(file.modified)
          return fileDate >= cutoffDate
        })
      }
    }

    // Apply tab-specific filters
    switch (activeTab) {
      case "recent":
        return filteredFiles.filter((file) => file.recentlyOpened)
      case "shared":
        return filteredFiles.filter((file) => file.shared)
      case "favorites":
        return filteredFiles.filter((file) => file.favorite)
      default:
        return filteredFiles
    }
  }

  const filteredFiles = getFilteredFiles()

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-1 flex-col overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <div className="border-b px-4">
            <TabsList>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="files"
            className="flex-1 overflow-hidden p-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <div className="flex h-full flex-col">
              <FileToolbar
                detailsPanelOpen={detailsPanelOpen}
                onDetailsPanelOpenChange={setDetailsPanelOpen}
                onUpload={() => setUploadModalOpen(true)}
              />
              <ScrollArea className="flex-1 p-4">
                {viewMode === "grid" ? (
                  <FileGrid files={filteredFiles} onFileClick={(fileId) => setPreviewFile(fileId)} />
                ) : (
                  <FileList files={filteredFiles} onFileClick={(fileId) => setPreviewFile(fileId)} />
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent
            value="recent"
            className="flex-1 overflow-hidden p-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <div className="flex h-full flex-col">
              <FileToolbar
                detailsPanelOpen={detailsPanelOpen}
                onDetailsPanelOpenChange={setDetailsPanelOpen}
                onUpload={() => setUploadModalOpen(true)}
              />
              <ScrollArea className="flex-1 p-4">
                {filteredFiles.length > 0 ? (
                  viewMode === "grid" ? (
                    <FileGrid files={filteredFiles} onFileClick={(fileId) => setPreviewFile(fileId)} />
                  ) : (
                    <FileList files={filteredFiles} onFileClick={(fileId) => setPreviewFile(fileId)} />
                  )
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No recent files found</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent
            value="shared"
            className="flex-1 overflow-hidden p-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <div className="flex h-full flex-col">
              <FileToolbar
                detailsPanelOpen={detailsPanelOpen}
                onDetailsPanelOpenChange={setDetailsPanelOpen}
                onUpload={() => setUploadModalOpen(true)}
              />
              <ScrollArea className="flex-1 p-4">
                {filteredFiles.length > 0 ? (
                  viewMode === "grid" ? (
                    <FileGrid files={filteredFiles} onFileClick={(fileId) => setPreviewFile(fileId)} />
                  ) : (
                    <FileList files={filteredFiles} onFileClick={(fileId) => setPreviewFile(fileId)} />
                  )
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No shared files found</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent
            value="favorites"
            className="flex-1 overflow-hidden p-0 data-[state=active]:flex data-[state=active]:flex-col"
          >
            <div className="flex h-full flex-col">
              <FileToolbar
                detailsPanelOpen={detailsPanelOpen}
                onDetailsPanelOpenChange={setDetailsPanelOpen}
                onUpload={() => setUploadModalOpen(true)}
              />
              <ScrollArea className="flex-1 p-4">
                {filteredFiles.length > 0 ? (
                  viewMode === "grid" ? (
                    <FileGrid files={filteredFiles} onFileClick={(fileId) => setPreviewFile(fileId)} />
                  ) : (
                    <FileList files={filteredFiles} onFileClick={(fileId) => setPreviewFile(fileId)} />
                  )
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-muted-foreground">No favorite files found</p>
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {detailsPanelOpen && selectedFiles.length > 0 && <FileDetailsPanel onClose={() => setDetailsPanelOpen(false)} />}

      {fileToPreview && <FilePreviewModal file={fileToPreview} onClose={() => setPreviewFile(null)} />}

      <UploadModal open={uploadModalOpen} onOpenChange={setUploadModalOpen} />
    </div>
  )
}
