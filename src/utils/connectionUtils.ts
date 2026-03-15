/**
 * Connection-aware utilities for optimizing loading based on network conditions
 */

export type ConnectionType = 'slow-2g' | '2g' | '3g' | '4g' | 'unknown';

export interface ConnectionInfo {
  effectiveType: ConnectionType;
  downlink: number; // Mbps
  saveData: boolean;
  isSlowConnection: boolean;
}

/**
 * Get current connection information
 */
export function getConnectionInfo(): ConnectionInfo {
  const nav = navigator as any;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

  if (!connection) {
    return {
      effectiveType: 'unknown',
      downlink: 10, // Assume decent connection if unknown
      saveData: false,
      isSlowConnection: false,
    };
  }

  const effectiveType = (connection.effectiveType || '4g') as ConnectionType;
  const downlink = connection.downlink || 10;
  const saveData = connection.saveData || false;
  const isSlowConnection = effectiveType === 'slow-2g' || effectiveType === '2g' || saveData || downlink < 1.5;

  return {
    effectiveType,
    downlink,
    saveData,
    isSlowConnection,
  };
}

/**
 * Hook to get connection info (updates on change)
 */
export function useConnectionInfo(): ConnectionInfo {
  const [info, setInfo] = React.useState(getConnectionInfo);

  React.useEffect(() => {
    const nav = navigator as any;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

    if (!connection) return;

    const updateConnection = () => {
      setInfo(getConnectionInfo());
    };

    connection.addEventListener('change', updateConnection);

    return () => {
      connection.removeEventListener('change', updateConnection);
    };
  }, []);

  return info;
}

/**
 * Determine video loading strategy based on connection
 */
export function getVideoLoadingStrategy(connectionInfo: ConnectionInfo): {
  preload: 'none' | 'metadata' | 'auto';
  loadImmediately: boolean;
  preloadMargin: string;
} {
  if (connectionInfo.isSlowConnection) {
    return {
      preload: 'none',
      loadImmediately: false,
      preloadMargin: '0px', // Don't preload on slow connections
    };
  }

  if (connectionInfo.effectiveType === '3g') {
    return {
      preload: 'metadata',
      loadImmediately: false,
      preloadMargin: '150px', // Reduced preload margin
    };
  }

  // 4g or unknown (assume good connection)
  return {
    preload: 'metadata',
    loadImmediately: false,
    preloadMargin: '300px', // Full preload margin
  };
}

// Add React import for the hook
import React from 'react';

