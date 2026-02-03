// Password Updated Screen
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const PasswordUpdatedScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View style={styles.successBadge}>
          <View style={styles.checkContainer}>
            <MaterialIcons name="check" size={48} color="#FFFFFF" />
          </View>
          <View style={styles.starContainer}>
            <MaterialIcons name="star" size={20} color="#6366F1" />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Password{'\n'}Updated</Text>
          <Text style={styles.subtitle}>
            Your account is now secure and ready to use.
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('OwnerProfile')} activeOpacity={0.8}>
            <Text style={styles.loginText}>Back to Login</Text>
          </TouchableOpacity>
          <View style={styles.sessionCard}>
            <Image
              source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVHxkjRZDuJpljHc1ocEWzk1QjYi8_mFcfKQREboL5w5h5eRnWl8b9hlmvVGs45aFsiMm_c4UU9gRHtoeGo2dZIOLQubs5EqG7QUL_FT44jDXOwEHA5ii686mDWq80VOCNFID_w914_9ioTVAMDbdXZ7Zg-4sZgC_FnLkOVJ6d2CWfJ9TS7w_tGH3FkVqa6rMc5xfAGmm8wGTR8HhWqfihM1Jp4RZIvYFfyRbWxymHx3ZUJFmZf60N2158GUu1Dm_hmEmFw_kA38Q' }}
              style={styles.avatar}
            />
            <View style={styles.sessionInfo}>
              <Text style={styles.sessionLabel}>Active Session</Text>
              <Text style={styles.sessionTitle}>Property Management Portal</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#94A3B8" />
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.helpButton}>
          <MaterialIcons name="help" size={20} color="#64748B" />
          <Text style={styles.helpText}>Need assistance?</Text>
        </TouchableOpacity>
        <View style={styles.indicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9F1FF',
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingTop: 56,
    paddingBottom: 48,
  },
  successBadge: {
    position: 'relative',
    width: 160,
    height: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.05,
    shadowRadius: 40,
    elevation: 10,
    transform: [{ rotate: '3deg' }],
  },
  checkContainer: {
    width: 96,
    height: 96,
    backgroundColor: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    transform: [{ rotate: '-3deg' }],
  },
  starContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ rotate: '12deg' }],
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 64,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 44,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
  actions: {
    width: '100%',
    marginTop: 48,
  },
  loginButton: {
    width: '100%',
    height: 64,
    backgroundColor: '#8B5CF6',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 32,
  },
  loginText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 32,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  sessionInfo: {
    flex: 1,
    marginLeft: 16,
  },
  sessionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(99, 102, 241, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
    marginBottom: 2,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 32,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  helpText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(100, 116, 139, 0.8)',
    marginLeft: 8,
  },
  indicator: {
    width: 128,
    height: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.1)',
    borderRadius: 3,
  },
});

export default PasswordUpdatedScreen;