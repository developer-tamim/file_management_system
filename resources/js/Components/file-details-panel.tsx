"use client"

import { useFileManager } from "./file-manager-provider"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X } from "lucide-react"
import { FileIcon as FilePdf, FileText, FileVideo } from "lucide-react"

// Sample data for demonstration - same as in file-grid.tsx
const files = [
  {
    id: "1",
    name: "Property Listing.pdf",
    type: "pdf",
    size: "2.4 MB",
    modified: "2023-04-15",
    category: "residential",
    synced: true,
    source: "Google Drive",
    created: "2023-03-10",
    owner: "John Doe",
    shared: ["Jane Smith", "Mike Johnson"],
    description: "Detailed property listing for 123 Main St.",
  },
  {
    id: "2",
    name: "Marketing Brochure.pdf",
    type: "pdf",
    size: "3.8 MB",
    modified: "2023-04-10",
    category: "marketing",
    synced: true,
    source: "Local Drive",
    created: "2023-03-05",
    owner: "Jane Smith",
    shared: ["John Doe"],
    description: "Marketing materials for spring campaign.",
  },
  {
    id: "3",
    name: "Property Photo 1.jpg",
    type: "image",
    size: "1.2 MB",
    modified: "2023-04-08",
    category: "residential",
    synced: true,
    source: "Dropbox",
    created: "2023-04-01",
    owner: "John Doe",
    shared: [],
    description: "Front view of 123 Main St property.",
  },
  {
    id: "4",
    name: "Property Photo 2.jpg",
    type: "image",
    size: "1.5 MB",
    modified: "2023-04-08",
    category: "residential",
    synced: false,
    source: "Dropbox",
    created: "2023-04-01",
    owner: "John Doe",
    shared: [],
    description: "Backyard view of 123 Main St property.",
  },
  {
    id: "5",
    name: "Commercial Lease.docx",
    type: "document",
    size: "567 KB",
    modified: "2023-04-05",
    category: "commercial",
    synced: true,
    source: "Local Drive",
    created: "2023-03-20",
    owner: "Mike Johnson",
    shared: ["John Doe", "Jane Smith"],
    description: "Standard commercial lease agreement template.",
  },
  {
    id: "6",
    name: "Property Video.mp4",
    type: "video",
    size: "24.8 MB",
    modified: "2023-04-01",
    category: "marketing",
    synced: false,
    source: "Google Drive",
    created: "2023-03-25",
    owner: "Jane Smith",
    shared: [],
    description: "Virtual tour of 123 Main St property.",
  },
  {
    id: "7",
    name: "Financial Report.xlsx",
    type: "spreadsheet",
    size: "845 KB",
    modified: "2023-03-28",
    category: "commercial",
    synced: true,
    source: "Local Drive",
    created: "2023-03-15",
    owner: "Mike Johnson",
    shared: ["John Doe"],
    description: "Q1 financial analysis for commercial properties.",
  },
  {
    id: "8",
    name: "Client List.xlsx",
    type: "spreadsheet",
    size: "1.1 MB",
    modified: "2023-03-25",
    category: "real-estate",
    synced: true,
    source: "Google Drive",
    created: "2023-02-10",
    owner: "John Doe",
    shared: ["Jane Smith", "Mike Johnson"],
    description: "Master list of all current clients and their properties.",
  },
  {
    id: "9",
    name: "Market Analysis.pdf",
    type: "pdf",
    size: "4.2 MB",
    modified: "2023-03-20",
    category: "real-estate",
    synced: true,
    source: "Dropbox",
    created: "2023-02-15",
    owner: "Jane Smith",
    shared: [],
    description: "Analysis of current real estate market trends.",
  },
  {
    id: "10",
    name: "Property Valuation.docx",
    type: "document",
    size: "723 KB",
    modified: "2023-03-15",
    category: "residential",
    synced: true,
    source: "Local Drive",
    created: "2023-02-28",
    owner: "Mike Johnson",
    shared: ["John Doe"],
    description: "Valuation report for 123 Main St property.",
  },
  {
    id: "11",
    name: "Neighborhood Map.jpg",
    type: "image",
    size: "2.8 MB",
    modified: "2023-03-10",
    category: "residential",
    synced: true,
    source: "Google Drive",
    created: "2023-02-20",
    owner: "John Doe",
    shared: [],
    description: "Map showing amenities near 123 Main St property.",
  },
  {
    id: "12",
    name: "Sales Presentation.pptx",
    type: "presentation",
    size: "5.7 MB",
    modified: "2023-03-05",
    category: "marketing",
    synced: true,
    source: "Dropbox",
    created: "2023-02-25",
    owner: "Jane Smith",
    shared: ["John Doe", "Mike Johnson"],
    description: "Presentation for potential buyers of luxury properties.",
  },
]

interface FileDetailsPanelProps {
  onClose: () => void
}

export function FileDetailsPanel({ onClose }: FileDetailsPanelProps) {
  const { selectedFiles } = useFileManager()

  // Get the first selected file for details
  const fileId = selectedFiles[0]
  const file = files.find((f) => f.id === fileId)

  if (!file) {
    return null
  }

  return (
    <div className="w-80 border-l bg-background">
      <div className="flex h-16 items-center justify-between border-b px-4">
        <h3 className="font-semibold">File Details</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>

      <Tabs defaultValue="details">
        <div className="border-b px-4">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">
              Details
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex-1">
              Activity
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="details" className="p-0">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-4">
              <div className="mb-4 flex flex-col items-center">
                <div className="mb-2 h-32 w-32 rounded-lg border bg-muted flex items-center justify-center">
                  {file.type === "image" ? (
                    <img
                      src={`/placeholder.svg?height=128&width=128&text=${file.name}`}
                      alt={file.name}
                      className="h-full w-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <div className="flex justify-center">
                        {file.type === "pdf" && <FilePdf className="h-12 w-12 text-red-500" />}
                        {file.type === "document" && <FileText className="h-12 w-12 text-yellow-500" />}
                        {file.type === "spreadsheet" && <FileText className="h-12 w-12 text-green-500" />}
                        {file.type === "presentation" && <FileText className="h-12 w-12 text-orange-500" />}
                        {file.type === "video" && <FileVideo className="h-12 w-12 text-purple-500" />}
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">{file.type.toUpperCase()}</p>
                    </div>
                  )}
                </div>
                <h3 className="text-center font-medium">{file.name}</h3>
                <p className="text-sm text-muted-foreground">{file.size}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground">{file.description}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <span className="text-sm capitalize">{file.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Category</span>
                    <span className="text-sm capitalize">{file.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Created</span>
                    <span className="text-sm">{file.created}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Modified</span>
                    <span className="text-sm">{file.modified}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Source</span>
                    <span className="text-sm">{file.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Owner</span>
                    <span className="text-sm">{file.owner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sync Status</span>
                    <span className="text-sm">{file.synced ? "Synced" : "Syncing..."}</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-2 text-sm font-medium">Shared With</h4>
                  {file.shared.length > 0 ? (
                    <ul className="space-y-1">
                      {file.shared.map((person, index) => (
                        <li key={index} className="text-sm">
                          {person}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not shared with anyone</p>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="mb-2 text-sm font-medium">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    <Button variant="outline" size="sm" className="h-6 text-xs">
                      Add Tag
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="activity" className="p-0">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    JD
                  </div>
                  <div>
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">Modified this file</p>
                    <p className="text-xs text-muted-foreground">{file.modified}</p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    JD
                  </div>
                  <div>
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">Created this file</p>
                    <p className="text-xs text-muted-foreground">{file.created}</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
