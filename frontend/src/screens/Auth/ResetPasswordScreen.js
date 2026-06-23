// Reset Password Screen
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { resetPassword } from '../../services/authService';

const ResetPasswordScreen = ({ navigation, route }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const { email, phone, resetToken } = route.params || {};

  const handleReset = async () => {
    if (isLoading) return;
    setMessage({ type: '', text: '' });

    if (!password || !confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'PINs do not match' });
      return;
    }
    if (password.length !== 6) {
      setMessage({ type: 'error', text: 'PIN must be exactly 6 digits' });
      return;
    }

    if (!resetToken || (!email && !phone)) {
      setMessage({ type: 'error', text: 'Missing reset session. Please restart the forgot password flow.' });
      return;
    }

    setIsLoading(true);
    try {
      await resetPassword({ email, phone, newPassword: password, resetToken });
      
      setMessage({ type: 'success', text: 'Password saved successfully! Redirecting...' });
      setTimeout(() => {
        navigation.navigate('Login');
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: error?.response?.data?.error || error?.message || 'Failed to save password' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={32} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Save Password</Text>
        <Text style={styles.subtitle}>Enter your new 6-digit PIN to save</Text>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>New 6-Digit PIN</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter 6-digit PIN"
              value={password}
              onChangeText={setPassword}
              keyboardType="numeric"
              maxLength={6}
              secureTextEntry
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm 6-Digit PIN</Text>
            <TextInput
              style={styles.input}
              placeholder="Confirm 6-digit PIN"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              keyboardType="numeric"
              maxLength={6}
              secureTextEntry
            />
          </View>
        </View>
        
        {message.text ? (
          <View style={[styles.messageBox, message.type === 'error' ? styles.errorBox : styles.successBox]}>
            <MaterialIcons 
              name={message.type === 'error' ? "error-outline" : "check-circle-outline"} 
              size={20} 
              color={message.type === 'error' ? "#DC2626" : "#059669"} 
            />
            <Text style={[styles.messageText, message.type === 'error' ? styles.errorText : styles.successText]}>
              {message.text}
            </Text>
          </View>
        ) : null}

        <TouchableOpacity 
          style={[styles.resetButton, isLoading && { opacity: 0.7 }]} 
          onPress={handleReset} 
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <Text style={styles.resetText}>{isLoading ? 'Saving...' : 'Save Password'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 48,
  },
  form: {
    marginBottom: 48,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  input: {
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    fontSize: 16,
    color: '#000000',
  },
  resetButton: {
    height: 64,
    backgroundColor: '#8B5CF6',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  resetText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderColor: '#F87171',
  },
  successBox: {
    backgroundColor: '#D1FAE5',
    borderColor: '#34D399',
  },
  messageText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    flexShrink: 1,
  },
  errorText: {
    color: '#DC2626',
  },
  successText: {
    color: '#059669',
  },
});

export default ResetPasswordScreen;