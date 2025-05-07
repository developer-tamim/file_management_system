import { ref, computed, onMounted } from "vue"
import { useStore } from "vuex"
import { useRoute } from "vue-router"
import FileManagerSidebar from "./FileManagerSidebar.vue"
import FileManagerHeader from "./FileManagerHeader.vue"
import FileManagerContent from "./FileManagerContent.vue"
import NewFolderModal from "./modals/NewFolderModal.vue"
import ConnectStorageModal from "./modals/ConnectStorageModal.vue"
import UploadModal from "./modals/UploadModal.vue"
import ProfileModal from "./modals/ProfileModal.vue"
import ChangePasswordModal from "./modals/ChangePasswordModal.vue"
import FilePreviewModal from "./modals/FilePreviewModal.vue"

export default {
  name: "FileManager",
  components: {
    FileManagerSidebar,
    FileManagerHeader,
    FileManagerContent,
    NewFolderModal,
    ConnectStorageModal,
    UploadModal,
    ProfileModal,
    ChangePasswordModal,
    FilePreviewModal,
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const sidebarOpen = ref(true)

    const previewFile = computed(() => store.state.previewFile)

    const setSidebarOpen = (value) => {
      sidebarOpen.value = value
    }

    onMounted(async () => {
      // Set active tab based on route
      let activeTab = "files"
      if (route.name === "recent") activeTab = "recent"
      if (route.name === "shared") activeTab = "shared"
      if (route.name === "favorites") activeTab = "favorites"
      store.commit("SET_ACTIVE_TAB", activeTab)

      // Fetch initial data
      await Promise.all([
        store.dispatch("fetchFiles"),
        store.dispatch("fetchCategories"),
        store.dispatch("fetchStorageProviders"),
      ])
    })

    return {
      sidebarOpen,
      setSidebarOpen,
      previewFile,
    }
  },
}
