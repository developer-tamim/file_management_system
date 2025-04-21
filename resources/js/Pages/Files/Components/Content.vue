<template>
    <div class="flex flex-1 overflow-hidden">
      <div class="flex flex-1 flex-col overflow-hidden">
        <Tabs defaultValue="files" class="flex-1 overflow-hidden">
          <div class="border-b px-4">
            <TabsList>
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="files" class="flex-1 overflow-hidden p-0">
            <div class="flex h-full flex-col">
              <FileToolbar :detailsPanelOpen="detailsPanelOpen" @update:detailsPanelOpen="setDetailsPanelOpen" />
              <ScrollArea class="flex-1 p-4">
                <FileGrid v-if="viewMode === 'grid'" @fileClick="setPreviewFile" />
                <FileList v-else @fileClick="setPreviewFile" />
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="recent" class="flex-1 overflow-hidden p-0">
            <div class="flex h-full items-center justify-center">
              <p class="text-muted-foreground">Recent files will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="shared" class="flex-1 overflow-hidden p-0">
            <div class="flex h-full items-center justify-center">
              <p class="text-muted-foreground">Shared files will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="favorites" class="flex-1 overflow-hidden p-0">
            <div class="flex h-full items-center justify-center">
              <p class="text-muted-foreground">Favorite files will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <FileDetailsPanel v-if="detailsPanelOpen && selectedFiles.length > 0" @close="setDetailsPanelOpen(false)" />

      <FilePreviewModal v-if="fileToPreview" :file="fileToPreview" @close="setPreviewFile(null)" />
    </div>
  </template>

  <script setup>
  import { ref, computed } from 'vue'
  import { useFileManager } from './Provider.vue'
  import { Tabs, TabsList, TabsTrigger, TabsContent } from './Layout/ui/tabs.tsx'
  import { ScrollArea } from './Layout/ui/scroll-area.tsx'
  import FileGrid from './file-grid.vue'
  import FileList from './file-list.vue'
  import FileToolbar from './file-toolbar.vue'
  import FileDetailsPanel from './file-details-panel.vue'
  import FilePreviewModal from './file-preview-modal.vue'

  const { viewMode, selectedFiles, previewFile } = useFileManager()
  const detailsPanelOpen = ref(false)

  const setDetailsPanelOpen = (value) => {
    detailsPanelOpen.value = value
  }

  const setPreviewFile = (fileId) => {
    previewFile.value = fileId
  }

  const fileToPreview = computed(() => {
    if (!previewFile.value) return null
    return files.find((f) => f.id === previewFile.value)
  })

  // Sample files data
  const files = [
    {
      id: "1",
      name: "Property Listing.pdf",
      type: "pdf",
      size: "2.4 MB",
      modified: "2023-04-15",
      category: "residential",
      synced: true,
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
      description: "Virtual tour of 123 Main St property.",
    },
  ]
  </script>
