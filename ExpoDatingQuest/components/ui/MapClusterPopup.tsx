import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Users, MessageCircle, Heart, Clock } from 'lucide-react-native';
import { Colors, ActionColors } from '../../constants';
import { Action } from '../../types';
import { BasePopup } from './BasePopup';

interface MapClusterPopupProps {
  visible: boolean;
  actions: Action[];
  onDismiss: () => void;
}

const getIconForActionType = (type: string) => {
  switch (type) {
    case 'approach':
      return Users;
    case 'contact':
      return MessageCircle;
    case 'instantDate':
      return Heart;
    case 'missedOpportunity':
      return Clock;
    default:
      return Users;
  }
};

const getActionLabel = (type: string): string => {
  switch (type) {
    case 'approach':
      return 'Approach';
    case 'contact':
      return 'Contact';
    case 'instantDate':
      return 'Instant Date';
    case 'missedOpportunity':
      return 'Missed Opportunity';
    default:
      return type;
  }
};

export const MapClusterPopup: React.FC<MapClusterPopupProps> = ({ visible, actions, onDismiss }) => {
  return (
    <BasePopup visible={visible} onDismiss={onDismiss} scrollable={true} maxHeight="70%">
      <View style={styles.content}>
        <Text style={styles.title}>
          {actions.length > 1 ? `${actions.length} Actions Here` : 'Action Details'}
        </Text>
        
        <View style={styles.actionsList}>
          {actions.map((action, index) => {
            const IconComponent = getIconForActionType(action.type);
            const actionColor = ActionColors[action.type];
            const time = new Date(action.timestamp).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            });
            
            return (
              <View 
                key={action.id} 
                style={[
                  styles.actionItem,
                  index === actions.length - 1 && styles.actionItemLast
                ]}
              >
                <View style={[styles.actionIcon, { backgroundColor: actionColor }]}>
                  <IconComponent size={16} color="#ffffff" />
                </View>
                <View style={styles.actionDetails}>
                  <Text style={styles.actionType}>{getActionLabel(action.type)}</Text>
                  <Text style={styles.actionTime}>{time}</Text>
                  {action.notes && (
                    <Text style={styles.actionNotes}>{action.notes}</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </BasePopup>
  );
};

const styles = StyleSheet.create({
  content: {
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  actionsList: {
    width: '100%',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionItemLast: {
    borderBottomWidth: 0,
    marginBottom: 0,
    paddingBottom: 0,
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  actionDetails: {
    flex: 1,
  },
  actionType: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  actionTime: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  actionNotes: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
  },
});

