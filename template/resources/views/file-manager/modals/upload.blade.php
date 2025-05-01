<div x-data="{ open: false, files: [], uploading: false, progress: 0 }" x-show="open" @open-modal.window="if ($event.detail === 'upload-modal') open = true" @keydown.escape.window="if (!uploading) open = false" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div x-show="open" x-transition:enter="ease-out duration-300" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100" x-transition:leave="ease-in duration-200" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        
        <div x-show="open" x-transition:enter="ease-out duration-300" x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100" x-transition:leave="ease-in duration-200" x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100" x-transition:leave-end="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" class="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
            <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                <button @click="if (!uploading) open = false" type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <span class="sr-only">Close</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <div>
                <div class="text-center sm:text-left">
                    <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">Upload Files</h3>
                    <div class="mt-2">
                        <p class="text-sm text-gray-500">Select files to upload to your file manager.</p>
                    </div>
                </div>
                
                <form action="{{ route('files.upload') }}" method="POST" enctype="multipart/form-data" @submit.prevent="uploadFiles" class="mt-4">
                    @csrf
                    <div class="space-y-4">
                        <div>
                            <label for="upload-category" class="block text-sm font-medium text-gray-700">Upload to Category</label>
                            <select name="category_id" id="upload-category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                <option value="">All Files</option>
                                @foreach($categories as $category)
                                    <option value="{{ $category->id }}" {{ $currentCategory === $category->id ? 'selected' : '' }}>{{ $category->name }}</option>
                                @endforeach
                            </select>
                        </div>
                        
                        <div>
                            <label for="upload-files" class="block text-sm font-medium text-gray-700">Files</label>
                            <div class="mt-1 flex h-32 flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 p-4">
                                <template x-if="files.length === 0">
                                    <div class="space-y-2 text-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p class="text-sm text-gray-500">Drag and drop files here or click to browse</p>
                                        <input id="upload-files" name="files[]" type="file" multiple class="hidden" @change="files = Array.from($event.target.files)">
                                        <button type="button" @click="document.getElementById('upload-files').click()" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                                            Browse Files
                                        </button>
                                    </div>
                                </template>
                                <template x-if="files.length > 0">
                                    <div class="w-full space-y-2 overflow-auto">
                                        <template x-for="(file, index) in files" :key="index">
                                            <div class="flex items-center justify-between rounded-md bg-white p-2 shadow-sm">
                                                <div class="flex items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                                    </svg>
                                                    <span class="text-sm" x-text="file.name"></span>
                                                </div>
                                                <button type="button" @click="files = files.filter((_, i) => i !== index)" class="rounded-md p-1 hover:bg-gray-100">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </template>
                                    </div>
                                </template>
                            </div>
                        </div>
                        
                        <template x-if="uploading">
                            <div class="space-y-2">
                                <div class="flex justify-between">
                                    <label class="block text-sm font-medium text-gray-700">Upload Progress</label>
                                    <span class="text-sm" x-text="progress + '%'"></span>
                                </div>
                                <div class="h-2 w-full rounded-full bg-gray-200">
                                    <div class="h-2 rounded-full bg-blue-600 transition-all duration-300" :style="{ width: progress + '%' }"></div>
                                </div>
                            </div>
                        </template>
                    </div>
                    
                    <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                        <button type="submit" :disabled="files.length === 0 || uploading" class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm">
                            <span x-text="uploading ? 'Uploading...' : 'Upload'"></span>
                        </button>
                        <button @click="if (!uploading) open = false" type="button" :disabled="uploading" class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 sm:mt-0 sm:w-auto sm:text-sm">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
