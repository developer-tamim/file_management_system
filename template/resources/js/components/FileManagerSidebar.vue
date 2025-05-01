import { computed } from "vue"
import { useStore } from "vuex"
import CategorySection from "./sidebar/CategorySection.vue"
import StorageSection from "./sidebar/StorageSection.vue"

export default {
  name: "FileManagerSidebar",
  components: {
    CategorySection,
    StorageSection,
  },
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:open"],
  setup(props, { emit }) {
    const store = useStore()

    const currentCategory = computed(() => store.state.currentCategory)

    const setCurrentCategory = (category) => {
      store.commit("SET_CURRENT_CATEGORY", category)
      store.dispatch("fetchFiles")
    }

    const openConnectStorageModal = () => {
      // Emit an event to open the connect storage modal
      window.dispatchEvent(new CustomEvent("open-modal", { detail: "connect-storage-modal" }))
    }

    return {
      currentCategory,
      setCurrentCategory,
      openConnectStorageModal,
    }
  },
}
