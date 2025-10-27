import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { TrendingUp, Award } from 'lucide-react-native';
import { Colors, App as AppConstants } from '../../constants';

interface LevelUpPopupProps {
  visible: boolean;
  level: number | null;
  onDismiss: () => void;
}

export const LevelUpPopup: React.FC<LevelUpPopupProps> = ({ visible, level, onDismiss }) => {
  const effectiveLevel = level ?? 1;
  const levelConfig = AppConstants.levels.find(l => l.level === effectiveLevel);
  
  if (!levelConfig) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            {effectiveLevel === 0 ? (
              <TrendingUp size={48} color={Colors.accent} />
            ) : (
              <Award size={48} color={Colors.accent} />
            )}
          </View>
          
          <Text style={styles.title}>
            {effectiveLevel === 0 ? 'Back to Start' : `Level ${effectiveLevel} Reached!`}
          </Text>
          
          <Text style={styles.subtitle}>
            Your new daily goal: {levelConfig.goal} approaches
          </Text>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={onDismiss}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Let's Go!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    opacity: 0.8,
  },
  button: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: 140,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
});

