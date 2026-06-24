import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { register } from '../../services/authService';

const RegisterScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    pin: '',
    role: 'tenant',
  });
  const scrollViewRef = useRef();

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [step]);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.phone || !formData.pin) {
        setErrorMessage('Please enter your name, phone, and PIN');
        return;
      }
      setErrorMessage('');
      setStep(2);
    } else if (step === 2) {
      handleRegister();
    }
  };

  const handleRegister = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const trimmedEmail = String(formData.email || '').trim();
      const hasEmail = trimmedEmail.length > 0;
      const hasPhone = String(formData.phone || '').trim().length > 0;

      if (!hasPhone) {
        setErrorMessage('Please enter your phone number');
        setIsLoading(false);
        return;
      }

      const normalizedCountryCode = String(countryCode).trim();
      const normalizedLocalPhone = String(formData.phone).trim();
      const combinedPhone = `${normalizedCountryCode}${normalizedLocalPhone}`;

      const userData = {
        name: formData.name,
        email: hasEmail ? trimmedEmail : undefined,
        phone: combinedPhone,
        password: formData.pin,
        role: formData.role || 'tenant',
        otpVia: 'sms',
      };

      const res = await register(userData);
      
      navigation.navigate('OtpVerification', { 
        from: 'register', 
        userData, 
        otpVia: res?.otpVia || 'sms' 
      });
    } catch (error) {
      const errorMsg = error?.response?.data?.error || error?.message || 'Registration failed.';
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const selectRole = (role) => {
    setFormData({ ...formData, role });
  };

  if (step === 4) {
    return (
      <LinearGradient colors={['#eef2ff', '#e0e7ff', '#faf5ff']} style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="check-circle" size={80} color="#8B5CF6" />
          </View>
          <Text style={styles.successTitle}>Registration Successful</Text>
          <Text style={styles.successText}>
            Thank you for joining our community. Your property management journey starts now.
          </Text>
          <TouchableOpacity style={styles.getStartedButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.getStartedText}>Get Started</Text>
            <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#eef2ff', '#e0e7ff', '#faf5ff']} style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false} ref={scrollViewRef}>
          <View style={styles.card}>
            {step === 1 && (
              <>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Join Us Today</Text>
                  <Text style={styles.subtitle}>
                    Create your account to start managing or renting properties seamlessly.
                  </Text>
                </View>

                {errorMessage ? (
                  <View style={styles.errorContainer}>
                    <MaterialIcons name="error-outline" size={18} color="#DC2626" />
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                ) : null}

                <View style={styles.form}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Full Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="John Doe"
                      placeholderTextColor="#94A3B8"
                      value={formData.name}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mobile Number</Text>
                    <View style={styles.phoneRow}>
                      <View style={styles.countryCodeContainer}>
                        <TextInput
                          style={styles.countryCodeText}
                          placeholder="+91"
                          placeholderTextColor="#94A3B8"
                          value={countryCode}
                          onChangeText={(text) => setCountryCode(text)}
                          keyboardType="phone-pad"
                          autoCapitalize="none"
                        />
                      </View>
                      <TextInput
                        style={[styles.input, styles.mobileInput]}
                        placeholder="00000 00000"
                        placeholderTextColor="#94A3B8"
                        value={formData.phone}
                        onChangeText={(text) => setFormData({ ...formData, phone: text })}
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email Address</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="name@example.com"
                      placeholderTextColor="#94A3B8"
                      value={formData.email}
                      onChangeText={(text) => setFormData({ ...formData, email: text })}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <View style={styles.pinHeader}>
                      <Text style={styles.label}>Set 6-Digit PIN</Text>
                      <MaterialIcons name="info-outline" size={16} color="#94A3B8" />
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter 6-digit PIN"
                      placeholderTextColor="#94A3B8"
                      value={formData.pin}
                      onChangeText={(text) => setFormData({ ...formData, pin: text })}
                      keyboardType="numeric"
                      maxLength={6}
                      secureTextEntry
                    />
                  </View>
                </View>
              </>
            )}

            {step === 2 && (
              <>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Choose Your Path</Text>
                  <Text style={styles.subtitle}>
                    Select the account type that best describes you.
                  </Text>
                </View>

                {errorMessage ? (
                  <View style={styles.errorContainer}>
                    <MaterialIcons name="error-outline" size={18} color="#DC2626" />
                    <Text style={styles.errorText}>{errorMessage}</Text>
                  </View>
                ) : null}

                <View style={styles.rolesContainer}>
                  {[
                    { key: 'tenant', label: 'Tenant', desc: 'I am renting a property', icon: 'key', color: '#8B5CF6' },
                    { key: 'owner', label: 'Owner', desc: 'I own/manage properties', icon: 'apartment', color: '#3B82F6' },
                    { key: 'broker', label: 'Broker', desc: 'I facilitate transactions', icon: 'handshake', color: '#10B981' },
                    { key: 'admin', label: 'Admin', desc: 'I manage the platform', icon: 'admin-panel-settings', color: '#F59E0B' },
                  ].map((role) => (
                    <TouchableOpacity
                      key={role.key}
                      style={[
                        styles.roleCard,
                        formData.role === role.key && styles.selectedRole,
                      ]}
                      onPress={() => selectRole(role.key)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.roleIcon, { backgroundColor: role.color + '15' }]}>
                        <MaterialIcons name={role.icon} size={24} color={role.color} />
                      </View>
                      <View style={styles.roleContent}>
                        <Text style={styles.roleTitle}>{role.label}</Text>
                        <Text style={styles.roleDesc}>{role.desc}</Text>
                      </View>
                      {formData.role === role.key && (
                        <MaterialIcons name="check-circle" size={20} color={role.color} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <View style={styles.footer}>
              <View style={styles.actionButtonsRow}>
                {step === 2 && (
                  <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => setStep(1)}
                    activeOpacity={0.8}
                  >
                    <MaterialIcons name="arrow-back" size={20} color="#64748B" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity 
                  style={[styles.nextButton, isLoading && { opacity: 0.7 }, step === 2 && { flex: 1 }]} 
                  onPress={handleNext} 
                  activeOpacity={0.8}
                  disabled={isLoading}
                >
                  <Text style={styles.nextText}>
                    {isLoading ? 'Processing...' : (step === 1 ? 'Next Step' : 'Complete Registration')}
                  </Text>
                  {step === 1 && !isLoading && <MaterialIcons name="arrow-forward" size={20} color="#FFF" style={{ marginLeft: 8 }} />}
                </TouchableOpacity>
              </View>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>
                  Already have an account?{' '}
                  <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
                    Log in
                  </Text>
                </Text>
              </View>
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
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
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
    height: 48,
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
    gap: 8,
  },
  countryCodeContainer: {
    height: 48,
    width: 80,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countryCodeText: {
    fontFamily: fontFamilyInter,
    fontSize: 14,
    color: '#0F172A',
    textAlign: 'center',
  },
  mobileInput: {
    flex: 1,
  },
  pinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  rolesContainer: {
    marginBottom: 16,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    marginBottom: 12,
  },
  selectedRole: {
    borderColor: '#8B5CF6',
    backgroundColor: '#8B5CF60A',
    borderWidth: 2,
  },
  roleIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleContent: {
    flex: 1,
    marginLeft: 12,
  },
  roleTitle: {
    fontFamily: fontFamilyInter,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  roleDesc: {
    fontFamily: fontFamilyInter,
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 2,
  },
  footer: {
    alignItems: 'center',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 24,
    gap: 12,
  },
  backButton: {
    height: 52,
    width: 52,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  nextButton: {
    flex: 1,
    height: 52,
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextText: {
    fontFamily: fontFamilyInter,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loginContainer: {
    alignItems: 'center',
  },
  loginText: {
    fontFamily: fontFamilyInter,
    fontSize: 13,
    color: '#64748B',
  },
  loginLink: {
    color: '#8B5CF6',
    fontWeight: '700',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FECACA',
    width: '100%',
  },
  errorText: {
    fontFamily: fontFamilyInter,
    color: '#DC2626',
    marginLeft: 8,
    fontSize: 13,
    fontWeight: '500',
    flexShrink: 1,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontFamily: fontFamilyInter,
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  successText: {
    fontFamily: fontFamilyInter,
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  getStartedButton: {
    height: 52,
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  getStartedText: {
    fontFamily: fontFamilyInter,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
});

export default RegisterScreen;