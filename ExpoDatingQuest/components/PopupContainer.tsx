import React from 'react';
import { usePopup } from '../contexts/PopupContext';
import { LevelUpPopup } from './ui/LevelUpPopup';
import { MapClusterPopup } from './ui/MapClusterPopup';

export const PopupContainer: React.FC = () => {
  const { levelUpPopup, mapClusterPopup, dismissPopup } = usePopup();

  return (
    <>
      <LevelUpPopup
        visible={levelUpPopup.visible}
        level={levelUpPopup.level}
        onDismiss={dismissPopup}
      />
      
      <MapClusterPopup
        visible={mapClusterPopup.visible}
        actions={mapClusterPopup.actions}
        onDismiss={dismissPopup}
      />
    </>
  );
};

