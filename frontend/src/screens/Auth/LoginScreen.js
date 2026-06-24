import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { login } from '../../services/authService';
import { setAuthSession } from '../../services/authStorage';

const LoginScreen = ({ navigation }) => {
  const [loginMethod, setLoginMethod] = useState('phone');
  const [countryCode] = useState('+91');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

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
    setMessage({ type: '', text: '' });
    setIsSubmitting(true);
    try {
      let payload;
      if (loginMethod === 'email') {
        const normalizedEmail = normalizeEmail(email);
        if (!normalizedEmail) {
          setMessage({ type: 'error', text: 'Enter a valid email address.' });
          setIsSubmitting(false);
          return;
        }
        payload = { email: normalizedEmail, pin: String(pin) };
      } else {
        const normalizedPhone = normalizeIndianPhone(countryCode, mobileNumber);
        if (!normalizedPhone) {
          setMessage({ type: 'error', text: 'Enter a valid 10-digit mobile number.' });
          setIsSubmitting(false);
          return;
        }
        payload = { phone: normalizedPhone, pin: String(pin) };
      }

      if (!pin || String(pin).length < 4) {
        setMessage({ type: 'error', text: 'Enter your 4-digit PIN.' });
        setIsSubmitting(false);
        return;
      }

      const res = await login(payload);
      if (!res?.token) {
        throw new Error('Login succeeded but no token was returned.');
      }

      setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
      await setAuthSession(res.token, res.user);
    } catch (error) {
      const backendMessage = error?.response?.data?.error;
      setMessage({ type: 'error', text: backendMessage || error?.message || 'Login failed' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LinearGradient 
      colors={['#eef2ff', '#e0e7ff', '#faf5ff']} 
      style={styles.container}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to your corporate account</Text>
          </View>
          
          {message.text ? (
            <View style={[styles.messageBox, message.type === 'error' ? styles.errorBox : styles.successBox]}>
              <MaterialIcons 
                name={message.type === 'error' ? "error-outline" : "check-circle"} 
                size={18} 
                color={message.type === 'error' ? "#DC2626" : "#059669"} 
              />
              <Text style={[styles.messageText, message.type === 'error' ? styles.errorText : styles.successText]}>
                {message.text}
              </Text>
            </View>
          ) : null}

          <View style={styles.form}>
            <View style={styles.methodToggle}>
              <TouchableOpacity
                style={[styles.methodTab, loginMethod === 'phone' && styles.methodTabActive]}
                onPress={() => setLoginMethod('phone')}
                activeOpacity={0.8}
              >
                <Text style={[styles.methodTabText, loginMethod === 'phone' && styles.methodTabTextActive]}>Phone</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.methodTab, loginMethod === 'email' && styles.methodTabActive]}
                onPress={() => setLoginMethod('email')}
                activeOpacity={0.8}
              >
                <Text style={[styles.methodTabText, loginMethod === 'email' && styles.methodTabTextActive]}>Email</Text>
              </TouchableOpacity>
            </View>

            {loginMethod === 'email' ? (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="name@company.com"
                  placeholderTextColor="#94A3B8"
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
                <View style={styles.countryCodeContainer}>
                  <Text style={styles.countryCodeText}>{countryCode}</Text>
                </View>
                <TextInput
                  style={[styles.input, styles.mobileInput]}
                  placeholder="00000 00000"
                  placeholderTextColor="#94A3B8"
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
                  <Text style={styles.forgotPassword}>Forgot PIN?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter 4-digit PIN"
                  placeholderTextColor="#94A3B8"
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
                    size={20}
                    color="#64748B"
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
            <Text style={styles.loginButtonText}>{isSubmitting ? 'Authenticating...' : 'Sign In'}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              New to the platform?{' '}
              <Text style={styles.signUpText} onPress={() => navigation.navigate('Register')}>
                Create Account
              </Text>
            </Text>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const fontFamilyInter = Platform.OS === 'web' ? '"Inter", sans-serif' : 'System';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 16,
    padding: 32,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  titleContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontFamily: fontFamilyInter,
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontFamily: fontFamilyInter,
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
  },
  messageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
    borderWidth: 1,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  successBox: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  messageText: {
    fontFamily: fontFamilyInter,
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '500',
    flexShrink: 1,
  },
  errorText: { color: '#DC2626' },
  successText: { color: '#059669' },
  form: {
    marginBottom: 24,
  },
  methodToggle: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  methodTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  methodTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  methodTabText: {
    fontFamily: fontFamilyInter,
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  methodTabTextActive: {
    color: '#8B5CF6',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: fontFamilyInter,
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    fontFamily: fontFamilyInter,
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    fontSize: 14,
    color: '#0F172A',
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countryCodeContainer: {
    height: 44,
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeText: {
    fontFamily: fontFamilyInter,
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
  },
  mobileInput: {
    flex: 1,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  forgotPassword: {
    fontFamily: fontFamilyInter,
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  passwordInputContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
  },
  loginButton: {
    height: 52,
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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
    fontFamily: fontFamilyInter,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontFamily: fontFamilyInter,
    fontSize: 13,
    color: '#64748B',
  },
  signUpText: {
    color: '#8B5CF6',
    fontWeight: '700',
  },
});

export default LoginScreen;