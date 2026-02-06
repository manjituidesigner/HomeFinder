// Forgot Password Screen
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { forgotPasswordInitiate } from '../../services/authService';

const ForgotPasswordScreen = ({ navigation }) => {
  const [selectedMethod, setSelectedMethod] = useState('phone');
  const [phoneValue, setPhoneValue] = useState('');
  const [emailValue, setEmailValue] = useState('');

  const normalizeIndianPhone = (localNumber) => {
    const digits = String(localNumber || '').replace(/\D/g, '');
    if (digits.length !== 10) return null;
    return `+91${digits}`;
  };

  const handleSendOTP = async () => {
    const wantsPhone = selectedMethod === 'phone';
    const wantsEmail = selectedMethod === 'email';

    if (!wantsPhone && !wantsEmail) {
      Alert.alert('Error', 'Please select a recovery method');
      return;
    }

    const normalizedPhone = wantsPhone ? normalizeIndianPhone(phoneValue) : undefined;
    const normalizedEmail = String(emailValue || '').trim().toLowerCase();

    if (wantsPhone && !normalizedPhone) {
      Alert.alert('Error', 'Please enter your 10-digit phone number');
      return;
    }
    if (wantsEmail && !normalizedEmail) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const payload = {
      ...(wantsPhone ? { phone: normalizedPhone } : {}),
      ...(wantsEmail ? { email: normalizedEmail } : {}),
      otpVia: selectedMethod,
    };
    try {
      const res = await forgotPasswordInitiate(payload);
      navigation.navigate('OtpVerification', {
        from: 'forgot',
        forgotPayload: {
          email: res?.email || normalizedEmail,
          phone: res?.phone || normalizedPhone,
          otpVia: res?.otpVia || payload.otpVia,
        },
      });
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.error || error?.message || 'Failed to send OTP');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backButton}>
          <MaterialIcons name="chevron-left" size={32} color="#8B5CF6" />
          <Text style={styles.backText}>Login</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.main}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Forgot{'\n'}Password</Text>
          <Text style={styles.subtitle}>
            Choose a recovery method to receive your security code.
          </Text>
        </View>
        <View style={styles.cards}>
          <TouchableOpacity
            style={[styles.card, selectedMethod === 'phone' && styles.activeCard]}
            onPress={() => setSelectedMethod('phone')}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="smartphone" size={28} color="#8B5CF6" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Phone Number</Text>
                <Text style={styles.cardDesc}>SMS verification</Text>
              </View>
              <View style={[styles.radio, selectedMethod === 'phone' && styles.radioActive]}>
                {selectedMethod === 'phone' && <View style={styles.radioInner} />}
              </View>
            </View>
            {selectedMethod === 'phone' && (
              <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.countryCode}>+91</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter Your Phone Number"
                    value={phoneValue}
                    onChangeText={setPhoneValue}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.card, selectedMethod === 'email' && styles.activeCard]}
            onPress={() => setSelectedMethod('email')}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconContainer}>
                <MaterialIcons name="alternate-email" size={28} color="#8B5CF6" />
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>Email Address</Text>
                <Text style={styles.cardDesc}>Link to your inbox</Text>
              </View>
              <View style={[styles.radio, selectedMethod === 'email' && styles.radioActive]}>
                {selectedMethod === 'email' && <View style={styles.radioInner} />}
              </View>
            </View>
            {selectedMethod === 'email' && (
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="example@domain.com"
                  value={emailValue}
                  onChangeText={setEmailValue}
                  keyboardType="email-address"
                  autoFocus
                />
              </View>
            )}
          </TouchableOpacity>

        </View>
        <Pressable style={styles.sendButton} onPress={handleSendOTP}>
          <Text style={styles.sendText}>Send OTP</Text>
        </Pressable>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Suddenly remembered?{' '}
          <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
            Back to Login
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#8B5CF6',
    marginLeft: -4,
  },
  main: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  titleContainer: {
    marginBottom: 48,
  },
  title: {
    fontSize: 52,
    fontWeight: '900',
    color: '#000000',
    lineHeight: 52,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#6B7280',
    lineHeight: 24,
    maxWidth: '85%',
  },
  cards: {
    gap: 20,
    marginBottom: 48,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 28,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activeCard: {
    borderColor: '#8B5CF6',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#8B5CF620',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
    marginLeft: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
  },
  cardDesc: {
    fontSize: 14,
    color: '#6B7280',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: '#8B5CF6',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#8B5CF6',
  },
  inputContainer: {
    marginTop: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#8B5CF620',
  },
  countryCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    paddingVertical: 8,
  },
  sendButton: {
    height: 64,
    backgroundColor: '#8B5CF6',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 10,
    pointerEvents: 'auto',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  sendText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    paddingTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  loginLink: {
    color: '#8B5CF6',
    fontWeight: '800',
  },
});

export default ForgotPasswordScreen;