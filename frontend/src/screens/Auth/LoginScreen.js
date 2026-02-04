// Login Screen
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { login } from '../../services/authService';
import { setAuthToken } from '../../services/authStorage';

const LoginScreen = ({ navigation }) => {
  const [loginMethod, setLoginMethod] = useState('phone');
  const [countryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

  const normalizeIndianPhone = (cc, localNumber) => {
    const digits = String(localNumber || '').replace(/\D/g, '');
    const normalizedCc = String(cc || '').trim();
    if (!normalizedCc.startsWith('+')) return null;
    if (digits.length !== 10) return null;
    return `${normalizedCc}${digits}`;
  };

  const handleLogin = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      let payload;
      if (loginMethod === 'email') {
        const normalizedEmail = normalizeEmail(email);
        if (!normalizedEmail) {
          Alert.alert('Invalid email', 'Enter your email address.');
          return;
        }
        payload = { email: normalizedEmail, pin: String(pin) };
      } else {
        const normalizedPhone = normalizeIndianPhone(countryCode, mobileNumber);
        if (!normalizedPhone) {
          Alert.alert('Invalid phone', 'Enter 10-digit mobile number. Country code +91 is added automatically.');
          return;
        }
        payload = { phone: normalizedPhone, pin: String(pin) };
      }

      if (!pin || String(pin).length < 4) {
        Alert.alert('Invalid PIN', 'Enter your 4-digit PIN.');
        return;
      }

      const res = await login(payload);
      if (!res?.token) {
        throw new Error('Login succeeded but no token was returned by server.');
      }

      await setAuthToken(res.token);

      // Do not navigate inside Auth stack after setting token.
      // AppNavigator will switch to the authenticated Drawer automatically.
    } catch (error) {
      const backendMessage = error?.response?.data?.error;
      Alert.alert('Error', backendMessage || error?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={32} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Sign in to manage your rental journey</Text>
      </View>
      <View style={styles.form}>
        <View style={styles.methodRow}>
          <TouchableOpacity
            style={[styles.methodButton, loginMethod === 'phone' && styles.methodButtonActive]}
            onPress={() => setLoginMethod('phone')}
            activeOpacity={0.8}
          >
            <Text style={[styles.methodText, loginMethod === 'phone' && styles.methodTextActive]}>Phone</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.methodButton, loginMethod === 'email' && styles.methodButtonActive]}
            onPress={() => setLoginMethod('email')}
            activeOpacity={0.8}
          >
            <Text style={[styles.methodText, loginMethod === 'email' && styles.methodTextActive]}>Email</Text>
          </TouchableOpacity>
        </View>

        {loginMethod === 'email' ? (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Email Address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        ) : (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile Number</Text>
          <View style={styles.phoneRow}>
            <TextInput style={[styles.input, styles.countryCodeInput]} value={countryCode} editable={false} />
            <TextInput
              style={[styles.input, styles.mobileInput]}
              placeholder="Enter Your Phone Number"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>
        )}
        <View style={styles.inputGroup}>
          <View style={styles.passwordHeader}>
            <Text style={styles.label}>PIN</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Login Pin"
              value={pin}
              onChangeText={setPin}
              keyboardType="numeric"
              maxLength={6}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <MaterialIcons
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={24}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.loginButton, isSubmitting && styles.loginButtonDisabled]}
        onPress={handleLogin}
        activeOpacity={0.8}
        disabled={isSubmitting}
      >
        <Text style={styles.loginButtonText}>{isSubmitting ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>
      <View style={styles.faceIdContainer}>
        <TouchableOpacity style={styles.faceIdButton}>
          <MaterialIcons name="face" size={44} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.faceIdText}>Sign in with Face ID</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Text style={styles.signUpText} onPress={() => navigation.navigate('Register')}>
            Sign Up
          </Text>
        </Text>
      </View>
      <View style={styles.indicator} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    maxWidth: 430,
    alignSelf: 'center',
    width: '100%',
  },
  contentContainer: {
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingBottom: 48,
  },
  titleContainer: {
    marginBottom: 48,
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: '#000000',
    lineHeight: 52.8,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '400',
    color: '#6B7280',
    marginTop: 12,
  },
  form: {
    marginBottom: 40,
  },
  methodRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  methodButton: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  methodButtonActive: {
    borderColor: '#8B5CF6',
    backgroundColor: '#8B5CF610',
  },
  methodText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  methodTextActive: {
    color: '#8B5CF6',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 60,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    fontSize: 16,
    color: '#000000',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  countryCodeInput: {
    width: 90,
    textAlign: 'center',
  },
  mobileInput: {
    flex: 1,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 4,
    marginRight: 4,
  },
  forgotPassword: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D9488',
  },
  passwordInputContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 24,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  loginButton: {
    height: 60,
    backgroundColor: '#8B5CF6',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  faceIdContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  faceIdButton: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  faceIdText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.65,
    textTransform: 'uppercase',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 48,
    paddingBottom: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 16,
    color: '#64748B',
  },
  signUpText: {
    color: '#8B5CF6',
    fontWeight: '700',
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

export default LoginScreen;