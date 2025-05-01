<div x-data="{ open: false, activeTab: 'local' }" x-show="open" @open-modal.window="if ($event.detail === 'connect-storage-modal') open = true" @keydown.escape.window="open = false" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div x-show="open" x-transition:enter="ease-out duration-300" x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100" x-transition:leave="ease-in duration-200" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

        <span class="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>
        
        <div x-show="open" x-transition:enter="ease-out duration-300" x-transition:enter-start="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" x-transition:enter-end="opacity-100 translate-y-0 sm:scale-100" x-transition:leave="ease-in duration-200" x-transition:leave-start="opacity-100 translate-y-0 sm:scale-100" x-transition:leave-end="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" class="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
            <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                <button @click="open = false" type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <span class="sr-only">Close</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            <div>
                <div class="text-center sm:text-left">
                    <h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">Connect Storage</h3>
                    <div class="mt-2">
                        <p class="text-sm text-gray-500">Connect to a storage provider to access your files.</p>
                    </div>
                </div>
                
                <div class="mt-4">
                    <div class="sm:hidden">
                        <label for="storage-tabs" class="sr-only">Select a tab</label>
                        <select id="storage-tabs" name="tabs" class="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500" x-model="activeTab">
                            <option value="local">Local Drive</option>
                            <option value="google">Google Drive</option>
                            <option value="dropbox">Dropbox</option>
                        </select>
                    </div>
                    <div class="hidden sm:block">
                        <nav class="flex space-x-4" aria-label="Tabs">
                            <button @click="activeTab = 'local'" :class="{ 'bg-blue-100 text-blue-700': activeTab === 'local', 'text-gray-500 hover:text-gray-700': activeTab !== 'local' }" class="rounded-md px-3 py-2 text-sm font-medium">Local Drive</button>
                            <button @click="activeTab = 'google'" :class="{ 'bg-blue-100 text-blue-700': activeTab === 'google', 'text-gray-500 hover:text-gray-700': activeTab !== 'google' }" class="rounded-md px-3 py-2 text-sm font-medium">Google Drive</button>
                            <button @click="activeTab = 'dropbox'" :class="{ 'bg-blue-100 text-blue-700': activeTab === 'dropbox', 'text-gray-500 hover:text-gray-700': activeTab !== 'dropbox' }" class="rounded-md px-3 py-2 text-sm font-medium">Dropbox</button>
                        </nav>
                    </div>
                </div>
                
                <div class="mt-4">
                    <div x-show="activeTab === 'local'" class="space-y-4 py-4">
                        <div class="flex items-center justify-center py-8">
                            <div class="text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                                </svg>
                                <h3 class="mt-4 text-lg font-medium">Local Storage</h3>
                                <p class="mt-2 text-sm text-gray-500">Connect to a folder on your local drive.</p>
                                <form action="{{ route('storage.connect') }}" method="POST" class="mt-4">
                                    @csrf
                                    <input type="hidden" name="type" value="local">
                                    <button type="submit" class="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Browse Folders</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    <div x-show="activeTab === 'google'" class="space-y-4 py-4">
                        <form action="{{ route('storage.connect') }}" method="POST" class="space-y-4">
                            @csrf
                            <input type="hidden" name="type" value="google_drive">
                            <div class="flex justify-center py-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                </svg>
                            </div>
                            <div>
                                <label for="google-email" class="block text-sm font-medium text-gray-700">Google Account</label>
                                <input type="email" name="email" id="google-email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="your.email@gmail.com" required>
                            </div>
                            <div>
                                <label for="google-api" class="block text-sm font-medium text-gray-700">API Key (Optional)</label>
                                <input type="text" name="api_key" id="google-api" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Your Google Drive API key">
                            </div>
                            <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                                <button type="submit" class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">Connect</button>
                                <button @click="open = false" type="button" class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
                            </div>
                        </form>
                    </div>
                    
                    <div x-show="activeTab === 'dropbox'" class="space-y-4 py-4">
                        <form action="{{ route('storage.connect') }}" method="POST" class="space-y-4">
                            @csrf
                            <input type="hidden" name="type" value="dropbox">
                            <div class="flex justify-center py-4">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                </svg>
                            </div>
                            <div>
                                <label for="dropbox-email" class="block text-sm font-medium text-gray-700">Dropbox Account</label>
                                <input type="email" name="email" id="dropbox-email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="your.email@example.com" required>
                            </div>
                            <div>
                                <label for="dropbox-api" class="block text-sm font-medium text-gray-700">API Key (Optional)</label>
                                <input type="text" name="api_key" id="dropbox-api" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Your Dropbox API key">
                            </div>
                            <div class="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse">
                                <button type="submit" class="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm">Connect</button>
                                <button @click="open = false" type="button" class="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
