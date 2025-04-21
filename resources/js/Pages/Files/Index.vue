<template>
    <Provider>
      <div class="flex h-screen overflow-hidden">
        <Sidebar :open="sidebarOpen" @openChange="setSidebarOpen" />
        <div class="flex flex-col flex-1 overflow-hidden">
          <Header :sidebarOpen="sidebarOpen" @sidebarOpenChange="setSidebarOpen" />
          <Content />
        </div>
      </div>
    </Provider>
  </template>

  <script>
  import { ref } from 'vue'
  import Sidebar from './Components/Sidebar.vue'
  import Header from './Components/Header.vue'
  import Content from './Components/Content.vue'
  import Provider from './Components/Provider.vue'

  export default {
    components: {
      Sidebar,
      Header,
      Content,
      Provider
    },
    setup() {
      const sidebarOpen = ref(true)
      const setSidebarOpen = (value) => {
        sidebarOpen.value = value
      }

      return {
        sidebarOpen,
        setSidebarOpen
      }
    }
  }
  </script>
