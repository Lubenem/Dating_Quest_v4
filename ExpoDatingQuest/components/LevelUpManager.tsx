import { useEffect, useRef } from 'react';
import { useActionsContext } from '../contexts/ActionsContext';
import { usePopup } from '../contexts/PopupContext';
import { StorageService } from '../services/storage';

export const LevelUpManager: React.FC = () => {
  const { currentLevel } = useActionsContext();
  const { showLevelUpPopup } = usePopup();
  const previousLevelRef = useRef<number | null>(null);
  const hasCheckedInitialLevel = useRef(false);

  useEffect(() => {
    const checkAndShowLevelPopup = async () => {
      if (currentLevel === null) return;

      if (!hasCheckedInitialLevel.current) {
        const lastShownLevel = await StorageService.getLevelUpPopupShown();
        
        if (lastShownLevel !== currentLevel) {
          showLevelUpPopup(currentLevel);
          await StorageService.setLevelUpPopupShown(currentLevel);
        }
        
        hasCheckedInitialLevel.current = true;
        previousLevelRef.current = currentLevel;
        return;
      }

      if (previousLevelRef.current !== null && previousLevelRef.current !== currentLevel) {
        showLevelUpPopup(currentLevel);
        await StorageService.setLevelUpPopupShown(currentLevel);
        previousLevelRef.current = currentLevel;
      }
    };

    checkAndShowLevelPopup();
  }, [currentLevel, showLevelUpPopup]);

  return null;
};

