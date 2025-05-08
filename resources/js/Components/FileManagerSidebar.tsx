import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
import CategorySection from './sidebar/CategorySection'
import StorageSection from './sidebar/StorageSection'

export default defineComponent({
  name: 'FileManagerSidebar',
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
  emits: ['update:open'],
  setup(props, { emit }) {
    const store = useStore()

    const currentCategory = computed(() => store.state.currentCategory)

    const setCurrentCategory = (category: any) => {
      store.commit('SET_CURRENT_CATEGORY', category)
      store.dispatch('fetchFiles')
    }

    const openConnectStorageModal = () => {
      // Emit an event to open the connect storage modal
      window.dispatchEvent(new CustomEvent('open-modal', { detail: 'connect-storage-modal' }))
    }

    return {
      currentCategory,
      setCurrentCategory,
      openConnectStorageModal,
    }
  },
  render() {
    return (
      <div className="file-manager-sidebar" style={{ width: this.open ? '280px' : '0' }}>
        <div className="sidebar-header">
          <h3>{this.$t('sidebar.title')}</h3>
          <button className="close-button" onClick={() => emit('update:open', false)}>
            ×
          </button>
        </div>

        <CategorySection
          currentCategory={this.currentCategory}
          setCurrentCategory={this.setCurrentCategory}
          class="category-section"
        />

        <StorageSection
          openConnectStorageModal={this.openConnectStorageModal}
          class="storage-section"
        />
      </div>
    )
  },
})
