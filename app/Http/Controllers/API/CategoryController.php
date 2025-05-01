<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Get all categories.
     */
    public function index()
    {
        $categories = Category::where('user_id', auth()->id())
                        ->with('children')
                        ->whereNull('parent_id')
                        ->get();
                        
        return response()->json($categories);
    }
    
    /**
     * Create a new category.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id'
        ]);
        
        $category = new Category();
        $category->name = $request->name;
        $category->slug = Str::slug($request->name);
        $category->parent_id = $request->parent_id;
        $category->user_id = auth()->id();
        $category->save();
        
        return response()->json($category->load('children'));
    }
    
    /**
     * Update a category.
     */
    public function update(Request $request, Category $category)
    {
        // Check ownership
        if ($category->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id'
        ]);
        
        // Prevent circular references
        if ($request->parent_id && $category->id == $request->parent_id) {
            return response()->json(['message' => 'A category cannot be its own parent'], 422);
        }
        
        $category->name = $request->name;
        $category->slug = Str::slug($request->name);
        $category->parent_id = $request->parent_id;
        $category->save();
        
        return response()->json($category->load('children'));
    }
    
    /**
     * Delete a category.
     */
    public function destroy(Category $category)
    {
        // Check ownership
        if ($category->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Check if category has files
        if ($category->files()->count() > 0) {
            return response()->json(['message' => 'Cannot delete category with files. Move or delete the files first.'], 422);
        }
        
        // Check if category has children
        if ($category->children()->count() > 0) {
            return response()->json(['message' => 'Cannot delete category with subcategories. Delete the subcategories first.'], 422);
        }
        
        $category->delete();
        
        return response()->json(['message' => 'Category deleted successfully']);
    }
}
