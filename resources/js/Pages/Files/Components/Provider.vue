<template>
    <div>
      <slot />
    </div>
  </template>

  <script setup>
  import { reactive, provide } from 'vue'

  // Define the context object
  const fileManagerState = reactive({
    currentCategory: 'all',
    categories: [
      { id: 'residential', label: 'Residential' },
      { id: 'commercial', label: 'Commercial' },
      { id: 'marketing', label: 'Marketing' },
      { id: 'real-estate', label: 'Real Estate' }
    ],
    viewMode: 'grid',
    searchQuery: '',
    sortBy: 'name',
    sortOrder: 'asc',
    selectedFiles: [],
    previewFile: null,
    newFolderModalOpen: false
  })

  // Define functions
  const setCurrentCategory = (category) => {
    fileManagerState.currentCategory = category
  }

  const addCategory = (category) => {
    const id = category.toLowerCase().replace(/\s+/g, '-')
    if (!fileManagerState.categories.some(c => c.id === id)) {
      fileManagerState.categories.push({ id, label: category })
    }
  }

  const setViewMode = (mode) => {
    fileManagerState.viewMode = mode
  }

  const setSearchQuery = (query) => {
    fileManagerState.searchQuery = query
  }

  const setSortBy = (sort) => {
    fileManagerState.sortBy = sort
  }

  const setSortOrder = (order) => {
    fileManagerState.sortOrder = order
  }

  const setSelectedFiles = (files) => {
    fileManagerState.selectedFiles = files
  }

  const toggleFileSelection = (fileId) => {
    const index = fileManagerState.selectedFiles.indexOf(fileId)
    if (index > -1) {
      fileManagerState.selectedFiles.splice(index, 1)
    } else {
      fileManagerState.selectedFiles.push(fileId)
    }
  }

  const setPreviewFile = (fileId) => {
    fileManagerState.previewFile = fileId
  }

  const setNewFolderModalOpen = (open) => {
    fileManagerState.newFolderModalOpen = open
  }

  const createFolder = (name, category) => {
    console.log(`Created folder "${name}" in category "${category}"`)
  }

  // Combine state and functions into a context object
  const fileManagerContext = {
    ...fileManagerState,
    setCurrentCategory,
    addCategory,
    setViewMode,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setSelectedFiles,
    toggleFileSelection,
    setPreviewFile,
    setNewFolderModalOpen,
    createFolder
  }

  // Provide the context
  provide('fileManager', fileManagerContext)
  </script>
