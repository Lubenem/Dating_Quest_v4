import React from 'react';

interface WebMapProps {
  latitude: number;
  longitude: number;
  markers?: Array<{
    id: string;
    latitude: number;
    longitude: number;
    title?: string;
  }>;
}

export const WebMap: React.FC<WebMapProps> = () => {
  return null;
};

