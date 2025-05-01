import { createStore } from "vuex"
import axios from "axios"

export default createStore({
  state: {
    user: null,
    files: [],
    categories: [],
    storageProviders: [],
    currentCategory: "all",
    viewMode: "grid",
    sortBy: "name",
    sortOrder: "asc",
    searchQuery: "",
    selectedFiles: [],
    previewFile: null,
    filterOptions: {
      fileTypes: [],
      dateModified: "",
    },
    activeTab: "files",
  },
  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user,
    filteredFiles: (state) => {
      let files = [...state.files]

      // Apply file type filters
      if (state.filterOptions.fileTypes.length > 0) {
        files = files.filter((file) => state.filterOptions.fileTypes.includes(file.type))
      }

      // Apply date filter
      if (state.filterOptions.dateModified) {
        const now = new Date()
        let cutoffDate = new Date()

        switch (state.filterOptions.dateModified) {
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

        if (state.filterOptions.dateModified !== "all") {
          files = files.filter((file) => {
            const fileDate = new Date(file.updated_at)
            return fileDate >= cutoffDate
          })
        }
      }

      // Apply tab-specific filters
      switch (state.activeTab) {
        case "recent":
          return files.filter((file) => file.recently_opened)
        case "shared":
          return files.filter((file) => file.shared)
        case "favorites":
          return files.filter((file) => file.favorite)
        default:
          return files
      }
    },
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_FILES(state, files) {
      state.files = files
    },
    SET_CATEGORIES(state, categories) {
      state.categories = categories
    },
    SET_STORAGE_PROVIDERS(state, providers) {
      state.storageProviders = providers
    },
    SET_CURRENT_CATEGORY(state, category) {
      state.currentCategory = category
    },
    SET_VIEW_MODE(state, mode) {
      state.viewMode = mode
    },
    SET_SORT_BY(state, sortBy) {
      state.sortBy = sortBy
    },
    SET_SORT_ORDER(state, order) {
      state.sortOrder = order
    },
    SET_SEARCH_QUERY(state, query) {
      state.searchQuery = query
    },
    SET_SELECTED_FILES(state, files) {
      state.selectedFiles = files
    },
    TOGGLE_FILE_SELECTION(state, fileId) {
      const index = state.selectedFiles.indexOf(fileId)
      if (index === -1) {
        state.selectedFiles.push(fileId)
      } else {
        state.selectedFiles.splice(index, 1)
      }
    },
    SET_PREVIEW_FILE(state, fileId) {
      state.previewFile = fileId
    },
    SET_FILTER_OPTIONS(state, options) {
      state.filterOptions = options
    },
    SET_ACTIVE_TAB(state, tab) {
      state.activeTab = tab
    },
    TOGGLE_FILE_FAVORITE(state, fileId) {
      const file = state.files.find((f) => f.id === fileId)
      if (file) {
        file.favorite = !file.favorite
      }
    },
    ADD_FILE(state, file) {
      state.files.push(file)
    },
    UPDATE_FILE(state, updatedFile) {
      const index = state.files.findIndex((f) => f.id === updatedFile.id)
      if (index !== -1) {
        state.files.splice(index, 1, updatedFile)
      }
    },
    REMOVE_FILE(state, fileId) {
      state.files = state.files.filter((f) => f.id !== fileId)
    },
    ADD_CATEGORY(state, category) {
      if (category.parent_id) {
        // Add as a child to an existing category
        const findAndAddChild = (categories) => {
          for (let i = 0; i < categories.length; i++) {
            if (categories[i].id === category.parent_id) {
              if (!categories[i].children) {
                categories[i].children = []
              }
              categories[i].children.push(category)
              return true
            }
            if (categories[i].children && findAndAddChild(categories[i].children)) {
              return true
            }
          }
          return false
        }

        findAndAddChild(state.categories)
      } else {
        // Add as a top-level category
        state.categories.push(category)
      }
    },
  },
  actions: {
    async fetchUser({ commit }) {
      try {
        const response = await axios.get("/api/user")
        commit("SET_USER", response.data)
        return response.data
      } catch (error) {
        commit("SET_USER", null)
        throw error
      }
    },
    async login({ dispatch }, credentials) {
      await axios.get("/sanctum/csrf-cookie")
      await axios.post("/login", credentials)
      return dispatch("fetchUser")
    },
    async logout({ commit }) {
      await axios.post("/logout")
      commit("SET_USER", null)
    },
    async register({ dispatch }, userData) {
      await axios.get("/sanctum/csrf-cookie")
      await axios.post("/register", userData)
      return dispatch("fetchUser")
    },
    async fetchFiles({ commit, state }) {
      try {
        const params = {
          category: state.currentCategory,
          sort: state.sortBy,
          order: state.sortOrder,
          search: state.searchQuery,
        }

        if (state.filterOptions.fileTypes.length > 0) {
          params.type = state.filterOptions.fileTypes.join(",")
        }

        if (state.filterOptions.dateModified) {
          params.date = state.filterOptions.dateModified
        }

        let url = "/api/files"
        if (state.activeTab === "recent") {
          url = "/api/files/recent"
        } else if (state.activeTab === "shared") {
          url = "/api/files/shared"
        } else if (state.activeTab === "favorites") {
          url = "/api/files/favorites"
        }

        const response = await axios.get(url, { params })
        commit("SET_FILES", response.data)
        return response.data
      } catch (error) {
        console.error("Error fetching files:", error)
        throw error
      }
    },
    async fetchCategories({ commit }) {
      try {
        const response = await axios.get("/api/categories")
        commit("SET_CATEGORIES", response.data)
        return response.data
      } catch (error) {
        console.error("Error fetching categories:", error)
        throw error
      }
    },
    async fetchStorageProviders({ commit }) {
      try {
        const response = await axios.get("/api/storage-providers")
        commit("SET_STORAGE_PROVIDERS", response.data)
        return response.data
      } catch (error) {
        console.error("Error fetching storage providers:", error)
        throw error
      }
    },
    async uploadFile({ commit }, { file, categoryId }) {
      try {
        const formData = new FormData()
        formData.append("file", file)
        if (categoryId) {
          formData.append("category_id", categoryId)
        }

        const response = await axios.post("/api/files/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

        commit("ADD_FILE", response.data)
        return response.data
      } catch (error) {
        console.error("Error uploading file:", error)
        throw error
      }
    },
    async toggleFileFavorite({ commit }, fileId) {
      try {
        await axios.post(`/api/files/${fileId}/favorite`)
        commit("TOGGLE_FILE_FAVORITE", fileId)
      } catch (error) {
        console.error("Error toggling file favorite:", error)
        throw error
      }
    },
    async deleteFile({ commit }, fileId) {
      try {
        await axios.delete(`/api/files/${fileId}`)
        commit("REMOVE_FILE", fileId)
      } catch (error) {
        console.error("Error deleting file:", error)
        throw error
      }
    },
    async createCategory({ commit }, { name, parentId }) {
      try {
        const response = await axios.post("/api/categories", {
          name,
          parent_id: parentId,
        })

        commit("ADD_CATEGORY", response.data)
        return response.data
      } catch (error) {
        console.error("Error creating category:", error)
        throw error
      }
    },
    async connectStorageProvider({ commit }, { type, credentials }) {
      try {
        const response = await axios.post("/api/storage-providers/connect", {
          type,
          credentials,
        })

        commit("SET_STORAGE_PROVIDERS", [...this.state.storageProviders, response.data])
        return response.data
      } catch (error) {
        console.error("Error connecting storage provider:", error)
        throw error
      }
    },
  },
})
