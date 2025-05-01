"use client"

import { useState } from "react"
import { FileManagerSidebar } from "./file-manager-sidebar"
import { FileManagerHeader } from "./file-manager-header"
import { FileManagerContent } from "./file-manager-content"
import { FileManagerProvider } from "./file-manager-provider"

export function FileManager() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <FileManagerProvider>
      <div className="flex h-screen overflow-hidden">
        <FileManagerSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <FileManagerHeader sidebarOpen={sidebarOpen} onSidebarOpenChange={setSidebarOpen} />
          <FileManagerContent />
        </div>
      </div>
    </FileManagerProvider>
  )
}
