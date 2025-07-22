import React, { useState, useEffect } from 'react';
import { useCache } from '../../context/CacheContext';
import { getRateLimitStats } from '../../lib/rateLimiter';

export const PerformanceIndicator: React.FC = () => {
  const { state } = useCache();
  const [rateLimitStats, setRateLimitStats] = useState<any>(null);
  
  // Actualizar estadísticas del rate limiter cada segundo
  useEffect(() => {
    // Solo ejecutar en desarrollo
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    const interval = setInterval(() => {
      const stats = getRateLimitStats();
      setRateLimitStats(stats);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

    const cacheStats = {
        pages: Object.keys(state.pages).length,
        categories: Object.keys(state.categories).length,
        posts: Object.keys(state.posts).length,
        categoryPosts: Object.keys(state.categoryPosts).length,
    };

    const totalCachedItems = cacheStats.pages + cacheStats.categories + cacheStats.posts + cacheStats.categoryPosts;

    return (
        <div style={{
            position: 'fixed',
            bottom: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.9)',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            fontSize: '11px',
            fontFamily: 'monospace',
            zIndex: 9999,
            minWidth: '220px',
            maxWidth: '280px',
        }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: '12px' }}>
                🚀 Performance Monitor
            </div>

            {/* Cache Stats */}
            <div style={{ marginBottom: '8px' }}>
                <div style={{ fontWeight: 'bold', color: '#4CAF50', marginBottom: '3px' }}>📦 Cache:</div>
                <div>Pages: {cacheStats.pages}</div>
                <div>Categories: {cacheStats.categories}</div>
                <div>Posts: {cacheStats.posts}</div>
                <div>Category Posts: {cacheStats.categoryPosts}</div>
                <div style={{
                    marginTop: '3px',
                    fontWeight: 'bold',
                    color: totalCachedItems > 0 ? '#4CAF50' : '#FF9800'
                }}>
                    Total: {totalCachedItems} items
                </div>
            </div>

            {/* Rate Limiter Stats */}
            {rateLimitStats && (
                <div style={{ marginBottom: '8px' }}>
                    <div style={{ fontWeight: 'bold', color: '#2196F3', marginBottom: '3px' }}>⏱️ Rate Limiter:</div>
                    <div>Queue: {rateLimitStats.queueLength}</div>
                    <div>Processing: {rateLimitStats.isProcessing ? 'Yes' : 'No'}</div>
                    <div>Requests: {rateLimitStats.requestCount}</div>
                </div>
            )}

            {/* Status */}
            <div style={{
                fontSize: '10px',
                color: '#888',
                marginTop: '5px',
                paddingTop: '5px',
                borderTop: '1px solid #555'
            }}>
                {state.initialized ? '✅ Initialized' : '⏳ Loading...'}
            </div>
        </div>
    );
}; 