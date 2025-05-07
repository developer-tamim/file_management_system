@extends('layouts.app')

@section('content')
<div class="flex h-screen overflow-hidden">
    <!-- Sidebar -->
    <div class="h-full border-r bg-white transition-all duration-300 ease-in-out {{ $sidebarOpen ? 'w-64' : 'w-0' }}">
        @if($sidebarOpen)
        <div class="flex h-full flex-col">
            <div class="flex h-14 items-center border-b px-4">
                <h2 class="text-lg font-semibold">File Manager</h2>
            </div>

            <div class="flex-1 overflow-auto px-3">
                <div class="space-y-1 py-2">
                    <a href="{{ route('files.index') }}" class="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium {{ $currentCategory === 'all' ? 'bg-gray-100' : 'hover:bg-gray-50' }}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        All Files
                    </a>

                    <!-- Categories Section -->
                    <div x-data="{ open: true }">
                        <button @click="open = !open" class="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50">
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                Categories
                            </div>
                            <svg x-show="!open" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                            <svg x-show="open" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div x-show="open" class="space-y-1 pl-6">
                            @include('file-manager.partials.category-tree', ['categories' => $categories->whereNull('parent_id')])
                            
                            <div x-data="{ showInput: false, newCategory: '' }">
                                <button x-show="!showInput" @click="showInput = true" class="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Category
                                </button>
                                <div x-show="showInput" class="flex gap-1">
                                    <input x-model="newCategory" @keydown.enter="$refs.addCategoryForm.submit()" @keydown.escape="showInput = false" type="text" class="h-8 w-full rounded-md border border-gray-300 px-3 py-1 text-sm" placeholder="Category name" autofocus>
                                    <button @click="$refs.addCategoryForm.submit()" class="h-8 w-8 rounded-md p-0 hover:bg-gray-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                    <button @click="showInput = false" class="h-8 w-8 rounded-md p-0 hover:bg-gray-50">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                    <form x-ref="addCategoryForm" action="{{ route('categories.store') }}" method="POST" class="hidden">
                                        @csrf
                                        <input type="hidden" name="name" :value="newCategory">
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Storage Section -->
                    <div x-data="{ open: true }">
                        <button @click="open = !open" class="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50">
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                                </svg>
                                Storage
                            </div>
                            <svg x-show="!open" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                            <svg x-show="open" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div x-show="open" class="space-y-1 pl-6">
                            @foreach(auth()->user()->storageProviders as $provider)
                            <div class="space-y-1 py-1">
                                <div class="flex items-center justify-between">
                                    <div class="flex items-center">
                                        @if($provider->type === 'local')
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                                        </svg>
                                        @else
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                        </svg>
                                        @endif
                                        <span class="ml-2 text-sm">{{ $provider->name }}</span>
                                    </div>
                                    <span class="text-xs text-gray-500">{{ $provider->formatted_used }} / {{ $provider->formatted_quota }}</span>
                                </div>
                                <div class="h-1.5 w-full rounded-full bg-gray-200">
                                    <div class="h-full rounded-full bg-blue-500" style="width: {{ $provider->usage_percentage }}%"></div>
                                </div>
                            </div>
                            @endforeach
                            
                            <button @click="$dispatch('open-modal', 'connect-storage-modal')" class="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Connect Storage
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-auto border-t p-4">
                <a href="{{ route('settings.index') }}" class="flex w-full items-center justify-start gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                </a>
            </div>
        </div>
        @endif
    </div>

    <!-- Main Content -->
    <div class="flex flex-1 flex-col overflow-hidden">
        <!-- Header -->
        <div class="border-b bg-white">
            <div class="flex h-16 items-center px-4">
                <button type="button" class="mr-2 rounded-md p-2 hover:bg-gray-100" @click="$dispatch('toggle-sidebar')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span class="sr-only">Toggle sidebar</span>
                </button>

                <h1 class="text-xl font-semibold">{{ $currentCategory === 'all' ? 'All Files' : $categories->firstWhere('id', $currentCategory)?->name ?? 'Files' }}</h1>

                <div class="ml-auto flex items-center gap-2">
                    <a href="{{ route('files.upload.form') }}" class="inline-flex items-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Upload
                    </a>
                    
                    <button type="button" @click="$dispatch('open-modal', 'new-folder-modal')" class="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                        New Folder
                    </button>

                    <div class="relative w-64">
                        <form action="{{ route('files.index') }}" method="GET">
                            <input type="hidden" name="category" value="{{ $currentCategory }}">
                            <input type="hidden" name="view" value="{{ $viewMode }}">
                            <input type="hidden" name="sort" value="{{ $sortBy }}">
                            <input type="hidden" name="order" value="{{ $sortOrder }}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input type="search" name="search" placeholder="Search files..." class="w-full rounded-md border border-gray-300 pl-8 py-2 text-sm" value="{{ $searchQuery }}">
                        </form>
                    </div>

                    <div x-data="{ open: false }" class="relative">
                        <button @click="open = !open" type="button" class="inline-flex items-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium hover:bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span class="hidden sm:inline">Filter</span>
                        </button>
                        <div x-show="open" @click.away="open = false" class="absolute right-0 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                            <div class="p-2">
                                <div class="space-y-1">
                                    <p class="text-sm font-medium">File Type</p>
                                    <div class="flex flex-wrap gap-1">
                                        <form action="{{ route('files.index') }}" method="GET">
                                            <input type="hidden" name="category" value="{{ $currentCategory }}">
                                            <input type="hidden" name="view" value="{{ $viewMode }}">
                                            <input type="hidden" name="sort" value="{{ $sortBy }}">
                                            <input type="hidden" name="order" value="{{ $sortOrder }}">
                                            <input type="hidden" name="search" value="{{ $searchQuery }}">
                                            <input type="hidden" name="type" value="image">
                                            <button type="submit" class="rounded-md px-2 py-1 text-xs {{ request('type') === 'image' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100' }}">Images</button>
                                        </form>
                                        <form action="{{ route('files.index') }}" method="GET">
                                            <input type="hidden" name="category" value="{{ $currentCategory }}">
                                            <input type="hidden" name="view" value="{{ $viewMode }}">
                                            <input type="hidden" name="sort" value="{{ $sortBy }}">
                                            <input type="hidden" name="order" value="{{ $sortOrder }}">
                                            <input type="hidden" name="search" value="{{ $searchQuery }}">
                                            <input type="hidden" name="type" value="document">
                                            <button type="submit" class="rounded-md px-2 py-1 text-xs {{ request('type') === 'document' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100' }}">Documents</button>
                                        </form>
                                        <form action="{{ route('files.index') }}" method="GET">
                                            <input type="hidden" name="category" value="{{ $currentCategory }}">
                                            <input type="hidden" name="view" value="{{ $viewMode }}">
                                            <input type="hidden" name="sort" value="{{ $sortBy }}">
                                            <input type="hidden" name="order" value="{{ $sortOrder }}">
                                            <input type="hidden" name="search" value="{{ $searchQuery }}">
                                            <input type="hidden" name="type" value="video">
                                            <button type="submit" class="rounded-md px-2 py-1 text-xs {{ request('type') === 'video' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100' }}">Videos</button>
                                        </form>
                                    </div>
                                </div>
                                <hr class="my-2">
                                <div class="mt-3 space-y-1">
                                    <p class="text-sm font-medium">Date Modified</p>
                                    <form action="{{ route('files.index') }}" method="GET">
                                        <input type="hidden" name="category" value="{{ $currentCategory }}">
                                        <input type="hidden" name="view" value="{{ $viewMode }}">
                                        <input type="hidden" name="sort" value="{{ $sortBy }}">
                                        <input type="hidden" name="order" value="{{ $sortOrder }}">
                                        <input type="hidden" name="search" value="{{ $searchQuery }}">
                                        <input type="hidden" name="type" value="{{ request('type') }}">
                                        <div class="space-y-1">
                                            <button type="submit" name="date" value="today" class="w-full rounded-md px-2 py-1 text-left text-sm {{ request('date') === 'today' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100' }}">Today</button>
                                            <button type="submit" name="date" value="week" class="w-full rounded-md px-2 py-1 text-left text-sm {{ request('date') === 'week' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100' }}">Last 7 days</button>
                                            <button type="submit" name="date" value="month" class="w-full rounded-md px-2 py-1 text-left text-sm {{ request('date') === 'month' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100' }}">Last 30 days</button>
                                            <button type="submit" name="date" value="all" class="w-full rounded-md px-2 py-1 text-left text-sm {{ request('date') === 'all' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100' }}">All time</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-1">
                        <form action="{{ route('files.index') }}" method="GET" class="inline-flex">
                            <input type="hidden" name="category" value="{{ $currentCategory }}">
                            <input type="hidden" name="view" value="{{ $viewMode }}">
                            <input type="hidden" name="search" value="{{ $searchQuery }}">
                            <input type="hidden" name="type" value="{{ request('type') }}">
                            <input type="hidden" name="date" value="{{ request('date') }}">
                            <select name="sort" onchange="this.form.submit()" class="rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm">
                                <option value="name" {{ $sortBy === 'name' ? 'selected' : '' }}>Name</option>
                                <option value="updated_at" {{ $sortBy === 'updated_at' ? 'selected' : '' }}>Date</option>
                                <option value="size" {{ $sortBy === 'size' ? 'selected' : '' }}>Size</option>
                                <option value="type" {{ $sortBy === 'type' ? 'selected' : '' }}>Type</option>
                            </select>
                        </form>

                        <form action="{{ route('files.index') }}" method="GET" class="inline-flex">
                            <input type="hidden" name="category" value="{{ $currentCategory }}">
                            <input type="hidden" name="view" value="{{ $viewMode }}">
                            <input type="hidden" name="sort" value="{{ $sortBy }}">
                            <input type="hidden" name="search" value="{{ $searchQuery }}">
                            <input type="hidden" name="type" value="{{ request('type') }}">
                            <input type="hidden" name="date" value="{{ request('date') }}">
                            <input type="hidden" name="order" value="{{ $sortOrder === 'asc' ? 'desc' : 'asc' }}">
                            <button type="submit" class="rounded-md p-2 hover:bg-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform {{ $sortOrder === 'desc' ? 'rotate-180' : '' }}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    <div class="flex items-center rounded-md border border-gray-300">
                        <a href="{{ route('files.index', ['category' => $currentCategory, 'view' => 'grid', 'sort' => $sortBy, 'order' => $sortOrder, 'search' => $searchQuery, 'type' => request('type'), 'date' => request('date')]) }}" class="rounded-l-md p-2 {{ $viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50' }}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                            <span class="sr-only">Grid view</span>
                        </a>
                        <a href="{{ route('files.index', ['category' => $currentCategory, 'view' => 'list', 'sort' => $sortBy, 'order' => $sortOrder, 'search' => $searchQuery, 'type' => request('type'), 'date' => request('date')]) }}" class="rounded-r-md p-2 {{ $viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50' }}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            <span class="sr-only">List view</span>
                        </a>
                    </div>

                    <div x-data="{ open: false }" class="relative">
                        <button @click="open = !open" type="button" class="rounded-full p-1 hover:bg-gray-100">
                            <img src="{{ auth()->user()->profile_photo_url }}" alt="{{ auth()->user()->name }}" class="h-8 w-8 rounded-full">
                        </button>
                        <div x-show="open" @click.away="open = false" class="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                            <a href="{{ route('profile.edit') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                                Profile
                            </a>
                            <a href="{{ route('settings.index') }}" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                                Settings
                            </a>
                            <form method="POST" action="{{ route('logout') }}">
                                @csrf
                                <button type="submit" class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                                    Logout
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="flex flex-1 overflow-hidden">
            <div class="flex flex-1 flex-col overflow-hidden">
                <div class="flex-1 overflow-auto p-4">
                    <!-- Tabs -->
                    <div class="mb-4 border-b">
                        <div class="flex space-x-8">
                            <a href="{{ route('files.index') }}" class="{{ $activeTab === 'files' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300' }} whitespace-nowrap px-1 py-4 text-sm font-medium">
                                Files
                            </a>
                            <a href="{{ route('files.recent') }}" class="{{ $activeTab === 'recent' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300' }} whitespace-nowrap px-1 py-4 text-sm font-medium">
                                Recent
                            </a>
                            <a href="{{ route('files.shared') }}" class="{{ $activeTab === 'shared' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300' }} whitespace-nowrap px-1 py-4 text-sm font-medium">
                                Shared
                            </a>
                            <a href="{{ route('files.favorites') }}" class="{{ $activeTab === 'favorites' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700 hover:border-gray-300' }} whitespace-nowrap px-1 py-4 text-sm font-medium">
                                Favorites
                            </a>
                        </div>
                    </div>

                    <!-- File Display -->
                    @if($viewMode === 'grid')
                        @include('file-manager.partials.file-grid')
                    @else
                        @include('file-manager.partials.file-list')
                    @endif
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modals -->
@include('file-manager.modals.new-folder')
@include('file-manager.modals.connect-storage')
@include('file-manager.modals.upload')
@endsection
