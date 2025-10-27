import React, { ReactNode } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { Colors } from '../../constants';

interface BasePopupProps {
  visible: boolean;
  onDismiss: () => void;
  children: ReactNode;
  maxHeight?: string;
  scrollable?: boolean;
}

export const BasePopup: React.FC<BasePopupProps> = ({ 
  visible, 
  onDismiss, 
  children,
  maxHeight = '80%',
  scrollable = false,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity 
          style={styles.backdropTouchable}
          activeOpacity={1} 
          onPress={onDismiss}
        />
        <View style={[styles.container, { maxHeight }]}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onDismiss}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={24} color={Colors.text} />
          </TouchableOpacity>

          {scrollable ? (
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
            >
              {children}
            </ScrollView>
          ) : (
            <View style={styles.content}>
              {children}
            </View>
          )}
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
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingTop: 8,
  },
  content: {
    paddingTop: 8,
  },
});

