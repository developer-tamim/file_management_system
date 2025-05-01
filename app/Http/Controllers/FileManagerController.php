<?php

namespace App\Http\Controllers;

use App\Models\File;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileManagerController extends Controller
{
    /**
     * Display the file manager.
     */
    public function index(Request $request)
    {
        $categoryId = $request->query('category', 'all');
        $viewMode = $request->query('view', 'grid');
        $sortBy = $request->query('sort', 'name');
        $sortOrder = $request->query('order', 'asc');
        $search = $request->query('search', '');
        
        $query = File::query()->where('user_id', auth()->id());
        
        // Apply category filter
        if ($categoryId !== 'all') {
            $query->where('category_id', $categoryId);
        }
        
        // Apply search
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }
        
        // Apply sorting
        $query->orderBy($sortBy, $sortOrder);
        
        $files = $query->get();
        $categories = Category::where('user_id', auth()->id())->get();
        
        return view('file-manager.index', [
            'files' => $files,
            'categories' => $categories,
            'currentCategory' => $categoryId,
            'viewMode' => $viewMode,
            'sortBy' => $sortBy,
            'sortOrder' => $sortOrder,
            'searchQuery' => $search,
            'activeTab' => 'files'
        ]);
    }
    
    /**
     * Display recent files.
     */
    public function recent()
    {
        $files = File::where('user_id', auth()->id())
                    ->where('recently_opened', true)
                    ->orderBy('updated_at', 'desc')
                    ->get();
        
        $categories = Category::where('user_id', auth()->id())->get();
        
        return view('file-manager.index', [
            'files' => $files,
            'categories' => $categories,
            'currentCategory' => 'all',
            'viewMode' => 'grid',
            'sortBy' => 'updated_at',
            'sortOrder' => 'desc',
            'searchQuery' => '',
            'activeTab' => 'recent'
        ]);
    }
    
    /**
     * Display shared files.
     */
    public function shared()
    {
        $files = File::where('user_id', auth()->id())
                    ->where('shared', true)
                    ->orderBy('name', 'asc')
                    ->get();
        
        $categories = Category::where('user_id', auth()->id())->get();
        
        return view('file-manager.index', [
            'files' => $files,
            'categories' => $categories,
            'currentCategory' => 'all',
            'viewMode' => 'grid',
            'sortBy' => 'name',
            'sortOrder' => 'asc',
            'searchQuery' => '',
            'activeTab' => 'shared'
        ]);
    }
    
    /**
     * Display favorite files.
     */
    public function favorites()
    {
        $files = File::where('user_id', auth()->id())
                    ->where('favorite', true)
                    ->orderBy('name', 'asc')
                    ->get();
        
        $categories = Category::where('user_id', auth()->id())->get();
        
        return view('file-manager.index', [
            'files' => $files,
            'categories' => $categories,
            'currentCategory' => 'all',
            'viewMode' => 'grid',
            'sortBy' => 'name',
            'sortOrder' => 'asc',
            'searchQuery' => '',
            'activeTab' => 'favorites'
        ]);
    }
    
    /**
     * Upload a new file.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'category_id' => 'required|exists:categories,id'
        ]);
        
        $uploadedFile = $request->file('file');
        $fileName = $uploadedFile->getClientOriginalName();
        $fileSize = $uploadedFile->getSize();
        $fileType = $this->determineFileType($uploadedFile);
        
        // Store the file
        $path = $uploadedFile->store('files/' . auth()->id());
        
        // Create file record
        $file = new File();
        $file->name = $fileName;
        $file->path = $path;
        $file->type = $fileType;
        $file->size = $this->formatSize($fileSize);
        $file->category_id = $request->category_id;
        $file->user_id = auth()->id();
        $file->synced = true;
        $file->save();
        
        return redirect()->back()->with('success', 'File uploaded successfully.');
    }
    
    /**
     * Display a file.
     */
    public function show(File $file)
    {
        // Check ownership
        if ($file->user_id !== auth()->id()) {
            abort(403);
        }
        
        // Mark as recently opened
        $file->recently_opened = true;
        $file->save();
        
        return view('file-manager.show', [
            'file' => $file
        ]);
    }
    
    /**
     * Update a file.
     */
    public function update(Request $request, File $file)
    {
        // Check ownership
        if ($file->user_id !== auth()->id()) {
            abort(403);
        }
        
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'category_id' => 'sometimes|exists:categories,id',
            'description' => 'sometimes|nullable|string'
        ]);
        
        $file->fill($request->only(['name', 'category_id', 'description']));
        $file->save();
        
        return redirect()->back()->with('success', 'File updated successfully.');
    }
    
    /**
     * Delete a file.
     */
    public function destroy(File $file)
    {
        // Check ownership
        if ($file->user_id !== auth()->id()) {
            abort(403);
        }
        
        // Delete the actual file
        Storage::delete($file->path);
        
        // Delete the record
        $file->delete();
        
        return redirect()->route('files.index')->with('success', 'File deleted successfully.');
    }
    
    /**
     * Toggle favorite status.
     */
    public function toggleFavorite(File $file)
    {
        // Check ownership
        if ($file->user_id !== auth()->id()) {
            abort(403);
        }
        
        $file->favorite = !$file->favorite;
        $file->save();
        
        return redirect()->back()->with('success', 'File updated successfully.');
    }
    
    /**
     * Determine file type based on mime type.
     */
    private function determineFileType($file)
    {
        $mimeType = $file->getMimeType();
        
        if (Str::startsWith($mimeType, 'image/')) {
            return 'image';
        } elseif (Str::startsWith($mimeType, 'video/')) {
            return 'video';
        } elseif ($mimeType === 'application/pdf') {
            return 'pdf';
        } elseif (in_array($mimeType, [
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ])) {
            return 'document';
        } elseif (in_array($mimeType, [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ])) {
            return 'spreadsheet';
        } elseif (in_array($mimeType, [
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        ])) {
            return 'presentation';
        }
        
        return 'file';
    }
    
    /**
     * Format file size for display.
     */
    private function formatSize($bytes)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        $bytes /= (1 << (10 * $pow));
        
        return round($bytes, 2) . ' ' . $units[$pow];
    }
}
