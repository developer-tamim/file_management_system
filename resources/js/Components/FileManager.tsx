import { defineComponent, ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import FileManagerSidebar from "./FileManagerSidebar";
import FileManagerHeader from "./FileManagerHeader";
import FileManagerContent from "./FileManagerContent.vue";
import NewFolderModal from "./modals/NewFolderModal.vue";
import ConnectStorageModal from "./modals/ConnectStorageModal.vue";
import UploadModal from "./modals/UploadModal.vue";
import ProfileModal from "./modals/ProfileModal.vue";
import ChangePasswordModal from "./modals/ChangePasswordModal.vue";
import FilePreviewModal from "./modals/FilePreviewModal.vue";

export default defineComponent({
  name: "FileManager",
  setup() {
    const store = useStore();
    const route = useRoute();
    const sidebarOpen = ref(true);

    const previewFile = computed(() => store.state.previewFile);

    const setSidebarOpen = (value: boolean) => {
      sidebarOpen.value = value;
    };

    onMounted(async () => {
      let activeTab = "files";
      if (route.name === "recent") activeTab = "recent";
      if (route.name === "shared") activeTab = "shared";
      if (route.name === "favorites") activeTab = "favorites";
      store.commit("SET_ACTIVE_TAB", activeTab);

      await Promise.all([
        store.dispatch("fetchFiles"),
        store.dispatch("fetchCategories"),
        store.dispatch("fetchStorageProviders"),
      ]);
    });

    return () => (
      <>
        <FileManagerSidebar open={sidebarOpen.value} onUpdate:open={setSidebarOpen} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <FileManagerHeader />
          <FileManagerContent />
        </div>

        <NewFolderModal />
        <ConnectStorageModal />
        <UploadModal />
        <ProfileModal />
        <ChangePasswordModal />
        {previewFile.value && <FilePreviewModal />}
      </>
    );
  },
});
