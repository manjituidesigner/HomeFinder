import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ComingSoonScreen = ({ route }) => {
  const title = route?.name || 'Coming Soon';

  return (
    <View style={styles.container}>
      <MaterialIcons name="construction" size={80} color="#8B5CF6" />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>We are actively working on this feature.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#140d1b',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default ComingSoonScreen;
