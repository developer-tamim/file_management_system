import { defineComponent, ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import debounce from "lodash/debounce";

export default defineComponent({
  name: "FileManagerHeader",
  props: {
    sidebarOpen: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["update:sidebar-open"],
  setup(_, { emit }) {
    const store = useStore();
    const router = useRouter();

    const filterDropdownOpen = ref(false);
    const userDropdownOpen = ref(false);

    const user = computed(() => store.getters.currentUser);
    const userAvatarUrl = computed(() => {
      return (
        user.value?.profile_photo_url ||
        "https://ui-avatars.com/api/?name=" +
          encodeURIComponent(user.value?.name || "User")
      );
    });

    const currentCategory = computed(() => store.state.currentCategory);
    const categories = computed(() => store.state.categories);

    const viewMode = computed({
      get: () => store.state.viewMode,
      set: (value: string) => store.commit("SET_VIEW_MODE", value),
    });

    const sortBy = computed({
      get: () => store.state.sortBy,
      set: (value: string) => store.commit("SET_SORT_BY", value),
    });

    const sortOrder = computed({
      get: () => store.state.sortOrder,
      set: (value: string) => store.commit("SET_SORT_ORDER", value),
    });

    const searchQuery = computed({
      get: () => store.state.searchQuery,
      set: (value: string) => store.commit("SET_SEARCH_QUERY", value),
    });

    const fileTypes = computed<string[]>({
      get: () => store.state.filterOptions.fileTypes,
      set: (value: string[]) =>
        store.commit("SET_FILTER_OPTIONS", {
          ...store.state.filterOptions,
          fileTypes: value,
        }),
    });

    const dateModified = computed({
      get: () => store.state.filterOptions.dateModified,
      set: (value: string) =>
        store.commit("SET_FILTER_OPTIONS", {
          ...store.state.filterOptions,
          dateModified: value,
        }),
    });

    const categoryLabel = computed(() => {
      if (currentCategory.value === "all") return "All Files";

      const category = categories.value.find(
        (c: any) => c.id === currentCategory.value
      );
      if (category) return category.name;

      for (const topCategory of categories.value) {
        if (topCategory.children) {
          const subCategory = topCategory.children.find(
            (c: any) => c.id === currentCategory.value
          );
          if (subCategory) return subCategory.name;
        }
      }

      return (
        currentCategory.value.charAt(0).toUpperCase() +
        currentCategory.value.slice(1)
      );
    });

    const setViewMode = (mode: string) => {
      viewMode.value = mode;
    };

    const toggleSortOrder = () => {
      sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
      store.dispatch("fetchFiles");
    };

    const handleSort = () => {
      store.dispatch("fetchFiles");
    };

    const handleSearch = debounce(() => {
      store.dispatch("fetchFiles");
    }, 300);

    const toggleFileType = (type: string) => {
      const types = [...fileTypes.value];
      const index = types.indexOf(type);

      if (index === -1) {
        types.push(type);
      } else {
        types.splice(index, 1);
      }

      fileTypes.value = types;
      store.dispatch("fetchFiles");
    };

    const setDateModified = (date: string) => {
      dateModified.value = date;
      store.dispatch("fetchFiles");
    };

    const closeFilterDropdown = () => {
      filterDropdownOpen.value = false;
    };

    const closeUserDropdown = () => {
      userDropdownOpen.value = false;
    };

    const openNewFolderModal = () => {
      window.dispatchEvent(
        new CustomEvent("open-modal", { detail: "new-folder-modal" })
      );
    };

    const openUploadModal = () => {
      window.dispatchEvent(
        new CustomEvent("open-modal", { detail: "upload-modal" })
      );
    };

    const openProfileModal = () => {
      userDropdownOpen.value = false;
      window.dispatchEvent(
        new CustomEvent("open-modal", { detail: "profile-modal" })
      );
    };

    const openChangePasswordModal = () => {
      userDropdownOpen.value = false;
      window.dispatchEvent(
        new CustomEvent("open-modal", { detail: "change-password-modal" })
      );
    };

    const logout = async () => {
      try {
        await store.dispatch("logout");
        router.push({ name: "login" });
      } catch (error) {
        console.error("Error logging out:", error);
      }
    };

    watch(
      () => router.currentRoute.value.name,
      (routeName) => {
        if (
          routeName === "recent" ||
          routeName === "shared" ||
          routeName === "favorites"
        ) {
          store.commit("SET_ACTIVE_TAB", routeName);
        } else {
          store.commit("SET_ACTIVE_TAB", "files");
        }
        store.dispatch("fetchFiles");
      }
    );

    return {
      user,
      userAvatarUrl,
      categoryLabel,
      viewMode,
      sortBy,
      sortOrder,
      searchQuery,
      filterDropdownOpen,
      userDropdownOpen,
      fileTypes,
      dateModified,
      setViewMode,
      toggleSortOrder,
      handleSort,
      handleSearch,
      toggleFileType,
      setDateModified,
      closeFilterDropdown,
      closeUserDropdown,
      openNewFolderModal,
      openUploadModal,
      openProfileModal,
      openChangePasswordModal,
      logout,
    };
  },
});
