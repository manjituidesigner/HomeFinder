// OTP Verification Screen
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { verifySignupOtp, forgotPasswordVerifyOtp, register, forgotPasswordInitiate } from '../../services/authService';

const OtpVerificationScreen = ({ navigation, route }) => {
  const OTP_LENGTH = 4;
  const [otpCode, setOtpCode] = useState(Array(OTP_LENGTH).fill(''));
  const [otpEmailCode, setOtpEmailCode] = useState(Array(OTP_LENGTH).fill(''));
  const [otpSmsCode, setOtpSmsCode] = useState(Array(OTP_LENGTH).fill(''));
  const [timer, setTimer] = useState(45);
  const otpRefs = Array.from({ length: OTP_LENGTH }, () => useRef());
  const otpEmailRefs = Array.from({ length: OTP_LENGTH }, () => useRef());
  const otpSmsRefs = Array.from({ length: OTP_LENGTH }, () => useRef());

  const { from, userData, forgotPayload, otpVia: otpViaParam } = route.params || {};
  const otpVia = otpViaParam || userData?.otpVia || forgotPayload?.otpVia;

  const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

  const normalizePhoneForApi = (value) => {
    const sanitized = String(value || '').trim().replace(/[^\d+]/g, '');
    if (!sanitized) return undefined;
    return sanitized.startsWith('+') ? sanitized : undefined;
  };

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (setter, refs, current, text, index) => {
    const next = [...current];
    next[index] = text;
    setter(next);
    if (text && index < OTP_LENGTH - 1) {
      refs[index + 1]?.current?.focus?.();
    }
  };

  const handleOtpKeyPress = (refs, current, e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !current[index] && index > 0) {
      refs[index - 1]?.current?.focus?.();
    }
  };

  const handleVerifyOTP = async () => {
    try {
      if (from === 'forgot') {
        const normalizedPhone = normalizePhoneForApi(forgotPayload?.phone);
        const normalizedEmail = normalizeEmail(forgotPayload?.email);
        const basePayload = {
          ...(otpVia === 'email' || otpVia === 'both' ? { email: normalizedEmail } : {}),
          ...(otpVia === 'sms' || otpVia === 'both' ? { phone: normalizedPhone } : {}),
          otpVia,
        };

        if (otpVia === 'both') {
          if (otpEmailCode.includes('') || otpSmsCode.includes('')) {
            Alert.alert('Error', 'Please enter both OTPs');
            return;
          }
          const res = await forgotPasswordVerifyOtp({
            ...basePayload,
            otpEmail: otpEmailCode.join(''),
            otpSms: otpSmsCode.join(''),
          });
          navigation.navigate('ResetPassword', { email: res.email, resetToken: res.resetToken });
          return;
        }

        if (otpCode.includes('')) {
          Alert.alert('Error', 'Please enter the complete OTP');
          return;
        }
        const res = await forgotPasswordVerifyOtp({ ...basePayload, otp: otpCode.join('') });
        navigation.navigate('ResetPassword', { email: res.email, resetToken: res.resetToken });
        return;
      }

      const normalizedPhone = normalizePhoneForApi(userData?.phone);
      const normalizedEmail = normalizeEmail(userData?.email);
      const basePayload = {
        ...(userData || {}),
        ...(otpVia === 'email' || otpVia === 'both' ? { email: normalizedEmail } : {}),
        ...(otpVia === 'sms' || otpVia === 'both' ? { phone: normalizedPhone } : {}),
        otpVia,
      };

      if (otpVia === 'both') {
        if (otpEmailCode.includes('') || otpSmsCode.includes('')) {
          Alert.alert('Error', 'Please enter both OTPs');
          return;
        }
        const res = await verifySignupOtp({
          ...basePayload,
          otpEmail: otpEmailCode.join(''),
          otpSms: otpSmsCode.join(''),
        });
        navigation.navigate('Success', { user: res.user, token: res.token });
        return;
      }

      if (otpCode.includes('')) {
        Alert.alert('Error', 'Please enter the complete OTP');
        return;
      }

      const res = await verifySignupOtp({ ...basePayload, otp: otpCode.join('') });
      navigation.navigate('Success', { user: res.user, token: res.token });
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.error || error?.message || 'OTP verification failed');
    }
  };

  const resendOTP = async () => {
    try {
      if (from === 'forgot') {
        const normalizedPhone = normalizePhoneForApi(forgotPayload?.phone);
        const normalizedEmail = normalizeEmail(forgotPayload?.email);
        await forgotPasswordInitiate({
          ...(otpVia === 'email' || otpVia === 'both' ? { email: normalizedEmail } : {}),
          ...(otpVia === 'sms' || otpVia === 'both' ? { phone: normalizedPhone } : {}),
          otpVia,
        });
      } else {
        const normalizedPhone = normalizePhoneForApi(userData?.phone);
        const normalizedEmail = normalizeEmail(userData?.email);
        await register({
          ...(userData || {}),
          ...(otpVia === 'email' || otpVia === 'both' ? { email: normalizedEmail } : {}),
          ...(otpVia === 'sms' || otpVia === 'both' ? { phone: normalizedPhone } : {}),
          otpVia,
        });
      }
      setTimer(45);
      Alert.alert('OTP Resent', 'A new OTP has been sent');
    } catch (error) {
      Alert.alert('Error', error?.response?.data?.error || error?.message || 'Failed to resend OTP');
    }
  };

  const handleKeyPress = (key) => {
    if (otpVia === 'both') return;
    if (key === 'backspace') {
      const next = [...otpCode];
      for (let i = next.length - 1; i >= 0; i--) {
        if (next[i] !== '') {
          next[i] = '';
          break;
        }
      }
      setOtpCode(next);
    } else if (key !== '') {
      const next = [...otpCode];
      for (let i = 0; i < next.length; i++) {
        if (next[i] === '') {
          next[i] = key.toString();
          break;
        }
      }
      setOtpCode(next);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color="#140d1b" />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            {from === 'forgot'
              ? 'Enter the code sent to reset your password'
              : 'Sign in to manage your rental journey. Enter the code sent to you.'}
          </Text>
        </View>
        {otpVia === 'both' ? (
          <>
            <Text style={styles.sectionLabel}>Email OTP</Text>
            <View style={styles.otpInputs}>
              {otpEmailCode.map((digit, index) => (
                <TextInput
                  key={`email-${index}`}
                  ref={otpEmailRefs[index]}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(setOtpEmailCode, otpEmailRefs, otpEmailCode, text, index)}
                  onKeyPress={(e) => handleOtpKeyPress(otpEmailRefs, otpEmailCode, e, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  autoFocus={index === 0}
                />
              ))}
            </View>

            <Text style={styles.sectionLabel}>SMS OTP</Text>
            <View style={styles.otpInputs}>
              {otpSmsCode.map((digit, index) => (
                <TextInput
                  key={`sms-${index}`}
                  ref={otpSmsRefs[index]}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(setOtpSmsCode, otpSmsRefs, otpSmsCode, text, index)}
                  onKeyPress={(e) => handleOtpKeyPress(otpSmsRefs, otpSmsCode, e, index)}
                  keyboardType="numeric"
                  maxLength={1}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.otpInputs}>
            {otpCode.map((digit, index) => (
              <TextInput
                key={index}
                ref={otpRefs[index]}
                style={styles.otpInput}
                value={digit}
                onChangeText={(text) => handleOtpChange(setOtpCode, otpRefs, otpCode, text, index)}
                onKeyPress={(e) => handleOtpKeyPress(otpRefs, otpCode, e, index)}
                keyboardType="numeric"
                maxLength={1}
                autoFocus={index === 0}
              />
            ))}
          </View>
        )}
        <View style={styles.footer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>
          <TouchableOpacity onPress={resendOTP} disabled={timer > 0}>
            <Text style={[styles.resendButton, timer > 0 && styles.resendDisabled]}>
              Resend OTP
            </Text>
          </TouchableOpacity>
          <View style={styles.timerContainer}>
            <MaterialIcons name="schedule" size={18} color="#64748B" />
            <Text style={styles.timerText}>{`00:${timer.toString().padStart(2, '0')}`}</Text>
          </View>
        </View>
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP} activeOpacity={0.8}>
          <Text style={styles.verifyText}>Verify</Text>
        </TouchableOpacity>
        <View style={styles.keypad}>
          {[1,2,3,4,5,6,7,8,9,'',0,'backspace'].map((key, index) => (
            <TouchableOpacity
              key={index}
              style={styles.key}
              activeOpacity={0.7}
              onPress={() => handleKeyPress(key)}
            >
              {key === 'backspace' ? (
                <MaterialIcons name="backspace" size={24} color="#0F172A" />
              ) : (
                <Text style={styles.keyText}>{key}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.indicator} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  header: {
    paddingTop: 24,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#140d1b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 12,
  },
  otpInputs: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#140d1b',
    marginHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  resendText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  resendButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  resendDisabled: {
    color: '#9CA3AF',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  timerText: {
    fontSize: 14,
    color: '#64748B',
    marginLeft: 4,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  verifyButton: {
    height: 64,
    backgroundColor: '#8B5CF6',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  verifyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  key: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  keyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0F172A',
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

export default OtpVerificationScreen;