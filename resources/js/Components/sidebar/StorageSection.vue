import { ref, computed } from "vue"
import { useStore } from "vuex"
import StorageItem from "./StorageItem.vue"

export default {
  name: "StorageSection",
  components: {
    StorageItem,
  },
  emits: ["connect-storage"],
  setup() {
    const store = useStore()
    const isOpen = ref(true)

    const storageProviders = computed(() => store.state.storageProviders)

    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }

    return {
      isOpen,
      storageProviders,
      toggleOpen,
    }
  },
}
