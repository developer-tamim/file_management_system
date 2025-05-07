<?php

namespace App\Http\Controllers;

use App\Models\StorageProvider;
use Illuminate\Http\Request;

class StorageController extends Controller
{
    /**
     * Display a listing of storage providers.
     */
    public function index()
    {
        $providers = StorageProvider::where('user_id', auth()->id())->get();
        
        return view('storage.index', [
            'providers' => $providers
        ]);
    }
    
    /**
     * Store a newly created storage provider.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:local,google_drive,dropbox',
            'credentials' => 'nullable|json',
            'quota' => 'required|numeric',
            'used' => 'required|numeric'
        ]);
        
        $provider = new StorageProvider();
        $provider->name = $request->name;
        $provider->type = $request->type;
        $provider->credentials = $request->credentials;
        $provider->quota = $request->quota;
        $provider->used = $request->used;
        $provider->user_id = auth()->id();
        $provider->save();
        
        return redirect()->back()->with('success', 'Storage provider added successfully.');
    }
    
    /**
     * Connect to a storage provider.
     */
    public function connect(Request $request)
    {
        $request->validate([
            'type' => 'required|in:local,google_drive,dropbox',
            'credentials' => 'nullable|json'
        ]);
        
        // In a real application, this would handle OAuth flow or API key validation
        // For this example, we'll just create a dummy provider
        
        $provider = new StorageProvider();
        $provider->name = ucfirst($request->type);
        $provider->type = $request->type;
        $provider->credentials = $request->credentials;
        $provider->quota = 100 * 1024 * 1024 * 1024; // 100 GB
        $provider->used = 0;
        $provider->user_id = auth()->id();
        $provider->save();
        
        return redirect()->back()->with('success', 'Storage provider connected successfully.');
    }
}
