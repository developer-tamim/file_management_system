import { ref } from "vue"

export default {
  name: "CategoryTree",
  props: {
    categories: {
      type: Array,
      required: true,
    },
    currentCategory: {
      type: String,
      required: true,
    },
  },
  emits: ["update:category", "add-category"],
  setup(props) {
    // Track which categories are expanded
    const expandedCategories = ref({})

    const toggleCategoryExpanded = (categoryId) => {
      expandedCategories.value[categoryId] = !expandedCategories.value[categoryId]
    }

    const isCategoryExpanded = (categoryId) => {
      return expandedCategories.value[categoryId] || props.currentCategory === categoryId
    }

    const hasChildren = (category) => {
      return category.children && category.children.length > 0
    }

    return {
      expandedCategories,
      toggleCategoryExpanded,
      isCategoryExpanded,
      hasChildren,
    }
  },
}
