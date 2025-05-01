<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileController extends Controller
{
    /**
     * Get all files or filter by category.
     */
    public function index(Request $request)
    {
        $query = File::query()->where('user_id', auth()->id());
        
        // Apply category filter
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category_id', $request->category);
        }
        
        // Apply search
        if ($request->has('search') && !empty($request->search)) {
            $query->where('name', 'like', "%{$request->search}%");
        }
        
        // Apply file type filter
        if ($request->has('type') && !empty($request->type)) {
            $query->where('type', $request->type);
        }
        
        // Apply date filter
        if ($request->has('date') && !empty($request->date)) {
            $now = now();
            
            switch ($request->date) {
                case 'today':
                    $query->whereDate('updated_at', $now->format('Y-m-d'));
                    break;
                case 'week':
                    $query->where('updated_at', '>=', $now->subDays(7));
                    break;
                case 'month':
                    $query->where('updated_at', '>=', $now->subDays(30));
                    break;
            }
        }
        
        // Apply sorting
        $sortBy = $request->input('sort', 'name');
        $sortOrder = $request->input('order', 'asc');
        $query->orderBy($sortBy, $sortOrder);
        
        return response()->json($query->with('category')->get());
    }
    
    /**
     * Get recent files.
     */
    public function recent()
    {
        $files = File::where('user_id', auth()->id())
                    ->where('recently_opened', true)
                    ->orderBy('updated_at', 'desc')
                    ->with('category')
                    ->get();
                    
        return response()->json($files);
    }
    
    /**
     * Get shared files.
     */
    public function shared()
    {
        $files = File::where('user_id', auth()->id())
                    ->where('shared', true)
                    ->orderBy('name', 'asc')
                    ->with('category')
                    ->get();
                    
        return response()->json($files);
    }
    
    /**
     * Get favorite files.
     */
    public function favorites()
    {
        $files = File::where('user_id', auth()->id())
                    ->where('favorite', true)
                    ->orderBy('name', 'asc')
                    ->with('category')
                    ->get();
                    
        return response()->json($files);
    }
    
    /**
     * Get a specific file.
     */
    public function show(File $file)
    {
        // Check ownership
        if ($file->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Mark as recently opened
        $file->recently_opened = true;
        $file->save();
        
        return response()->json($file->load('category'));
    }
    
    /**
     * Upload a file.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
            'category_id' => 'nullable|exists:categories,id'
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
        
        return response()->json($file->load('category'));
    }
    
    /**
     * Update a file.
     */
    public function update(Request $request, File $file)
    {
        // Check ownership
        if ($file->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'category_id' => 'sometimes|nullable|exists:categories,id',
            'description' => 'sometimes|nullable|string'
        ]);
        
        $file->fill($request->only(['name', 'category_id', 'description']));
        $file->save();
        
        return response()->json($file->load('category'));
    }
    
    /**
     * Delete a file.
     */
    public function destroy(File $file)
    {
        // Check ownership
        if ($file->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        // Delete the actual file
        Storage::delete($file->path);
        
        // Delete the record
        $file->delete();
        
        return response()->json(['message' => 'File deleted successfully']);
    }
    
    /**
     * Toggle favorite status.
     */
    public function toggleFavorite(File $file)
    {
        // Check ownership
        if ($file->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        $file->favorite = !$file->favorite;
        $file->save();
        
        return response()->json($file);
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
