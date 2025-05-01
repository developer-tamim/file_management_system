<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'path',
        'type',
        'size',
        'description',
        'category_id',
        'storage_provider_id',
        'synced',
        'favorite',
        'shared',
        'recently_opened',
    ];
    
    protected $casts = [
        'synced' => 'boolean',
        'favorite' => 'boolean',
        'shared' => 'boolean',
        'recently_opened' => 'boolean',
    ];
    
    /**
     * Get the user that owns the file.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Get the category that the file belongs to.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    
    /**
     * Get the storage provider that the file belongs to.
     */
    public function storageProvider()
    {
        return $this->belongsTo(StorageProvider::class);
    }
}
