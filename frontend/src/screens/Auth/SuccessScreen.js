// Success Screen
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SuccessScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="check-circle" size={80} color="#8B5CF6" />
      </View>
      <Text style={styles.title}>Registration Successful</Text>
      <Text style={styles.text}>
        Thank you for joining our community. Your property management journey starts now.
      </Text>
      <TouchableOpacity style={styles.getStartedButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.getStartedText}>Get Started</Text>
        <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.viewProfileButton}>
        <Text style={styles.viewProfileText}>View my profile</Text>
      </TouchableOpacity>
      <View style={styles.indicator} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    lineHeight: 52.8,
    marginBottom: 24,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22.4,
    marginBottom: 48,
    maxWidth: 300,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    backgroundColor: '#8B5CF6',
    borderRadius: 32,
    paddingHorizontal: 32,
    marginBottom: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
  viewProfileButton: {
    paddingVertical: 8,
  },
  viewProfileText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  indicator: {
    width: 128,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 8,
  },
});

export default SuccessScreen;