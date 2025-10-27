import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';
import { Action } from '../types';

type PopupType = 'levelUp' | 'mapCluster';

interface PopupState {
  type: PopupType;
  visible: boolean;
  data?: any;
}

interface PopupContextType {
  showLevelUpPopup: (level: number | null) => void;
  showMapClusterPopup: (actions: Action[]) => void;
  dismissPopup: () => void;
  dismissAllPopups: () => void;
  
  levelUpPopup: {
    visible: boolean;
    level: number | null;
  };
  mapClusterPopup: {
    visible: boolean;
    actions: Action[];
  };
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (context === undefined) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

interface PopupProviderProps {
  children: ReactNode;
}

export const PopupProvider: React.FC<PopupProviderProps> = ({ children }) => {
  const [activePopup, setActivePopup] = useState<PopupState | null>(null);

  const showLevelUpPopup = useCallback((level: number | null) => {
    setActivePopup({
      type: 'levelUp',
      visible: true,
      data: { level },
    });
  }, []);

  const showMapClusterPopup = useCallback((actions: Action[]) => {
    setActivePopup({
      type: 'mapCluster',
      visible: true,
      data: { actions },
    });
  }, []);

  const dismissPopup = useCallback(() => {
    setActivePopup(null);
  }, []);

  const dismissAllPopups = useCallback(() => {
    setActivePopup(null);
  }, []);

  const contextValue = useMemo<PopupContextType>(() => ({
    showLevelUpPopup,
    showMapClusterPopup,
    dismissPopup,
    dismissAllPopups,
    
    levelUpPopup: {
      visible: activePopup?.type === 'levelUp' && activePopup.visible,
      level: activePopup?.type === 'levelUp' ? activePopup.data?.level : null,
    },
    mapClusterPopup: {
      visible: activePopup?.type === 'mapCluster' && activePopup.visible,
      actions: activePopup?.type === 'mapCluster' ? activePopup.data?.actions || [] : [],
    },
  }), [activePopup, showLevelUpPopup, showMapClusterPopup, dismissPopup, dismissAllPopups]);

  return (
    <PopupContext.Provider value={contextValue}>
      {children}
    </PopupContext.Provider>
  );
};

