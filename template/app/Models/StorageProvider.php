<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StorageProvider extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'type',
        'credentials',
        'quota',
        'used',
    ];
    
    protected $casts = [
        'credentials' => 'json',
        'quota' => 'integer',
        'used' => 'integer',
    ];
    
    protected $appends = [
        'usage_percentage',
        'formatted_quota',
        'formatted_used',
    ];
    
    /**
     * Get the user that owns the storage provider.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Get all files stored with this provider.
     */
    public function files()
    {
        return $this->hasMany(File::class);
    }
    
    /**
     * Get the usage percentage.
     */
    public function getUsagePercentageAttribute()
    {
        if ($this->quota === 0) {
            return 0;
        }
        
        return min(100, round(($this->used / $this->quota) * 100));
    }
    
    /**
     * Format the quota for display.
     */
    public function getFormattedQuotaAttribute()
    {
        return $this->formatSize($this->quota);
    }
    
    /**
     * Format the used space for display.
     */
    public function getFormattedUsedAttribute()
    {
        return $this->formatSize($this->used);
    }
    
    /**
     * Format size for display.
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
