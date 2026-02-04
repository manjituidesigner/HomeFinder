import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OwnerDashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Owner Dashboard</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
});

export default OwnerDashboard;
