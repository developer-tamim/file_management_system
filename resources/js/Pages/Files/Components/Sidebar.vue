
<template>
    <div :class="cn('h-full border-r bg-background transition-all duration-300 ease-in-out', open ? 'w-64' : 'w-0')">
      <div v-if="open" class="flex h-full flex-col">
        <div class="flex h-14 items-center border-b px-4">
          <h2 class="text-lg font-semibold">File Manager</h2>
        </div>

        <div class="p-4">
          <Button class="w-full justify-start gap-2" variant="default">
            <Upload class="h-4 w-4" />
            Upload Files
          </Button>
        </div>

        <ScrollArea class="flex-1 px-3">
          <div class="space-y-1 py-2">
            <Button
              :variant="currentCategory === 'all' ? 'secondary' : 'ghost'"
              class="w-full justify-start"
              @click="setCurrentCategory('all')"
            >
              <Home class="mr-2 h-4 w-4" />
              All Files
            </Button>

            <CategorySection
              title="Categories"
              :currentCategory="currentCategory"
              :onCategoryChange="setCurrentCategory"
            />

            <StorageSection />
          </div>
        </ScrollArea>

        <div class="mt-auto border-t p-4">
          <Button variant="outline" class="w-full justify-start gap-2">
            <Settings class="h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  </template>

  <script>
  import { ref } from 'vue'
  import { cn } from '@/lib/utils'
  import { Button, Input, ScrollArea } from '@/components/ui'
  import { Upload, Home, Settings } from 'lucide-react'
  import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
  import { useFileManager } from './Provider.vue'

  export default {
    components: {
      Button,
      Input,
      ScrollArea,
      Upload,
      Home,
      Settings,
      Collapsible,
      CollapsibleContent,
      CollapsibleTrigger
    },
    props: {
      open: {
        type: Boolean,
        required: true
      },
      onOpenChange: {
        type: Function,
        required: true
      }
    },
    setup(props) {
      const { currentCategory, setCurrentCategory, categories, addCategory } = useFileManager()

      return {
        currentCategory,
        setCurrentCategory,
        categories,
        addCategory
      }
    },
    methods: {
      cn(...classes) {
        return classes.filter(Boolean).join(' ')
      }
    }
  }
  </script>
