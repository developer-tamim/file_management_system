<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Store a newly created category.
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
        
        return redirect()->back()->with('success', 'Category created successfully.');
    }
    
    /**
     * Update the specified category.
     */
    public function update(Request $request, Category $category)
    {
        // Check ownership
        if ($category->user_id !== auth()->id()) {
            abort(403);
        }
        
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id'
        ]);
        
        $category->name = $request->name;
        $category->slug = Str::slug($request->name);
        $category->parent_id = $request->parent_id;
        $category->save();
        
        return redirect()->back()->with('success', 'Category updated successfully.');
    }
    
    /**
     * Remove the specified category.
     */
    public function destroy(Category $category)
    {
        // Check ownership
        if ($category->user_id !== auth()->id()) {
            abort(403);
        }
        
        // Check if category has files
        if ($category->files()->count() > 0) {
            return redirect()->back()->with('error', 'Cannot delete category with files. Move or delete the files first.');
        }
        
        // Check if category has children
        if ($category->children()->count() > 0) {
            return redirect()->back()->with('error', 'Cannot delete category with subcategories. Delete the subcategories first.');
        }
        
        $category->delete();
        
        return redirect()->back()->with('success', 'Category deleted successfully.');
    }
}
