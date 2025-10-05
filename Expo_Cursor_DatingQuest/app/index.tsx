import React from 'react';
import { AnimatedGradient } from '../components/ui/AnimatedGradient';
import { SwipeablePages } from '../components/navigation/SwipeablePages';
import { DashboardContent } from '../components/Dashboard/DashboardContent';
import { MapContent } from '../components/Map/MapContent';

export default function HomeScreen() {
  const pages = [
    {
      key: 'dashboard',
      title: 'Dashboard',
      component: <DashboardContent />,
    },
    {
      key: 'map',
      title: 'Map',
      component: <MapContent />,
    },
  ];

  return (
    <AnimatedGradient>
      <SwipeablePages pages={pages} initialPage={0} />
    </AnimatedGradient>
  );
}