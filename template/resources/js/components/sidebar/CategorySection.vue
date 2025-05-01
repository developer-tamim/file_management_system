import { ref, computed, nextTick, onMounted } from "vue"
import { useStore } from "vuex"
import CategoryTree from "./CategoryTree.vue"

export default {
  name: "CategorySection",
  components: {
    CategoryTree,
  },
  props: {
    title: {
      type: String,
      default: "Categories",
    },
    currentCategory: {
      type: String,
      required: true,
    },
  },
  emits: ["update:category"],
  setup() {
    const store = useStore()
    const isOpen = ref(true)
    const showInput = ref(false)
    const newCategory = ref("")
    const addingToParentId = ref(undefined)
    const categoryInput = ref(null)

    const categories = computed(() => store.state.categories)

    const toggleOpen = () => {
      isOpen.value = !isOpen.value
    }

    const handleAddCategory = async () => {
      if (newCategory.value.trim()) {
        await store.dispatch("createCategory", {
          name: newCategory.value.trim(),
          parentId: addingToParentId.value,
        })

        newCategory.value = ""
        showInput.value = false
        addingToParentId.value = undefined
      }
    }

    const handleCancelAddCategory = () => {
      newCategory.value = ""
      showInput.value = false
      addingToParentId.value = undefined
    }

    const addCategory = (parentId) => {
      addingToParentId.value = parentId
      showInput.value = true

      nextTick(() => {
        if (categoryInput.value) {
          categoryInput.value.focus()
        }
      })
    }

    onMounted(() => {
      store.dispatch("fetchCategories")
    })

    return {
      isOpen,
      showInput,
      newCategory,
      categories,
      categoryInput,
      toggleOpen,
      handleAddCategory,
      handleCancelAddCategory,
      addCategory,
    }
  },
}
