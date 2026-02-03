// Forgot OTP Verification Screen
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ForgotOtpVerificationScreen = ({ navigation }) => {
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otpCode];
    newOtp[index] = text;
    setOtpCode(newOtp);
    if (text && index < 5) {
      otpRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otpCode[index] && index > 0) {
      otpRefs[index - 1].current.focus();
    }
  };

  const handleVerifyOTP = () => {
    if (otpCode.includes('')) {
      Alert.alert('Error', 'Please enter the complete OTP');
      return;
    }
    const code = otpCode.join('');
    if (code === '123456') {
      navigation.navigate('PasswordUpdated');
    } else {
      Alert.alert('Error', 'Invalid OTP');
    }
  };

  const resendOTP = () => {
    setTimer(45);
    Alert.alert('OTP Resent', 'A new OTP has been sent');
  };

  const handleKeyPress = (key) => {
    if (key === 'backspace') {
      const newOtp = [...otpCode];
      for (let i = newOtp.length - 1; i >= 0; i--) {
        if (newOtp[i] !== '') {
          newOtp[i] = '';
          break;
        }
      }
      setOtpCode(newOtp);
    } else if (key !== '') {
      const newOtp = [...otpCode];
      for (let i = 0; i < newOtp.length; i++) {
        if (newOtp[i] === '') {
          newOtp[i] = key.toString();
          break;
        }
      }
      setOtpCode(newOtp);
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
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Verify OTP for Password Recover</Text>
          <Text style={styles.subtitle}>
            Enter the code sent to your phone to reset your password.
          </Text>
        </View>
        <View style={styles.otpInputs}>
          {otpCode.map((digit, index) => (
            <TextInput
              key={index}
              ref={otpRefs[index]}
              style={styles.otpInput}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleOtpKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              autoFocus={index === 0}
            />
          ))}
        </View>
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
    fontSize: 32,
    fontWeight: '700',
    color: '#140d1b',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22.4,
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
    fontSize: 24,
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
    fontSize: 24,
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

export default ForgotOtpVerificationScreen;