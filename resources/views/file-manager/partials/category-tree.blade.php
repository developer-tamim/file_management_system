@foreach($categories as $category)
    <div x-data="{ expanded: false, showInput: false, newCategory: '' }">
        <div class="group flex items-center">
            @if($category->children->count() > 0)
                <button @click="expanded = !expanded" class="h-6 w-6 p-0 hover:bg-gray-50">
                    <svg x-show="!expanded" xmlns="http://www.w3.org/2000/svg" class="mx-auto h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                    <svg x-show="expanded"  d="M9 5l7 7-7 7" />
                    </svg>
                    <svg x-show="expanded" xmlns="http://www.w3.org/2000/svg" class="mx-auto h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            @else
                <div class="w-6"></div>
            @endif
            <a href="{{ route('files.index', ['category' => $category->id]) }}" class="flex h-8 w-full items-center rounded-md px-3 py-2 text-sm font-medium {{ $currentCategory === $category->id ? 'bg-gray-100' : 'hover:bg-gray-50' }}">
                <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <span class="ml-2">{{ $category->name }}</span>
            </a>
            <button @click="showInput = true" class="h-6 w-6 p-0 opacity-0 hover:bg-gray-50 group-hover:opacity-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
        </div>
        
        <div x-show="expanded" class="pl-6 space-y-1">
            @if($category->children->count() > 0)
                @include('file-manager.partials.category-tree', ['categories' => $category->children])
            @endif
        </div>
        
        <div x-show="showInput" class="pl-6 flex gap-1 mt-1">
            <input x-model="newCategory" @keydown.enter="$refs.addSubCategoryForm.submit()" @keydown.escape="showInput = false" type="text" class="h-8 w-full rounded-md border border-gray-300 px-3 py-1 text-sm" placeholder="Subcategory name" autofocus>
            <button @click="$refs.addSubCategoryForm.submit()" class="h-8 w-8 rounded-md p-0 hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
            <button @click="showInput = false" class="h-8 w-8 rounded-md p-0 hover:bg-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <form x-ref="addSubCategoryForm" action="{{ route('categories.store') }}" method="POST" class="hidden">
                @csrf
                <input type="hidden" name="name" :value="newCategory">
                <input type="hidden" name="parent_id" value="{{ $category->id }}">
            </form>
        </div>
    </div>
@endforeach
