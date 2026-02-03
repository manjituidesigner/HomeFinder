// Register Screen with Steps
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { register } from '../../services/authService';

const RegisterScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
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
      // Validate step 1
      if (!formData.name || !formData.phone || !formData.email || !formData.pin) {
        Alert.alert('Error', 'Please fill all fields');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Register
      handleRegister();
    }
  };

  const handleRegister = async () => {
    try {
      const userData = { ...formData, password: formData.pin };
      await register(userData);
    } catch (error) {
      console.log('Registration error:', error);
      // For testing, proceed
    }
    navigation.navigate('OtpVerification');
  };

  const selectRole = (role) => {
    setFormData({ ...formData, role });
  };

  if (step === 4) {
    return (
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
        <TouchableOpacity style={styles.viewProfileButton}>
          <Text style={styles.viewProfileText}>View my profile</Text>
        </TouchableOpacity>
        <View style={styles.indicator} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container} key={step} ref={scrollViewRef}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step === 1 ? navigation.goBack() : setStep(1)}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color="#140d1b" />
        </TouchableOpacity>
      </View>

      {step === 1 && (
        <>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Join Us Today</Text>
            <Text style={styles.subtitle}>
              Create your account to start managing or renting properties seamlessly.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.pinHeader}>
                <Text style={styles.label}>Set 6-Digit PIN</Text>
                <MaterialIcons name="info" size={18} color="#9CA3AF" />
              </View>
              <TextInput
                style={styles.pinInput}
                placeholder="••••••"
                value={formData.pin}
                onChangeText={(text) => setFormData({ ...formData, pin: text })}
                keyboardType="numeric"
                maxLength={6}
                secureTextEntry
              />
              <Text style={styles.pinHint}>Used for quick and secure access to your account.</Text>
            </View>
          </View>
        </>
      )}

      {step === 2 && (
        <>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Choose Your Path</Text>
            <Text style={styles.subtitle}>
              Select the account type that best describes you to personalize your experience.
            </Text>
          </View>

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
                <View style={styles.roleHeader}>
                  <View style={[styles.roleIcon, { backgroundColor: role.color + '20' }]}>
                    <MaterialIcons name={role.icon} size={28} color={role.color} />
                  </View>
                  {formData.role === role.key && (
                    <View style={styles.checkIcon}>
                      <MaterialIcons name="check" size={14} color="#FFFFFF" />
                    </View>
                  )}
                </View>
                <View style={styles.roleContent}>
                  <Text style={styles.roleTitle}>{role.label}</Text>
                  <Text style={styles.roleDesc}>{role.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
          <Text style={styles.nextText}>{step === 1 ? 'Next' : 'Register'}</Text>
        </TouchableOpacity>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
            <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
              Log in
            </Text>
          </Text>
        </View>
      </View>

      <View style={styles.indicator} />
    </ScrollView>
  );

};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 16,
  },
  titleContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#140d1b',
    lineHeight: 38.4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 22.4,
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#140d1b',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    fontSize: 16,
    color: '#140d1b',
  },
  pinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 4,
    marginRight: 4,
  },
  pinInput: {
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    fontSize: 24,
    fontWeight: '700',
    color: '#140d1b',
    letterSpacing: 8,
    textAlign: 'center',
  },
  pinHint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    marginLeft: 4,
  },
  rolesContainer: {
    marginBottom: 32,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  selectedRole: {
    borderColor: '#8B5CF6',
    backgroundColor: '#8B5CF620',
  },
  roleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  roleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleContent: {
    flex: 1,
    marginLeft: 16,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#140d1b',
  },
  roleDesc: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 4,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: 48,
    paddingTop: 16,
  },
  nextButton: {
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
  nextText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loginContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    color: '#8B5CF6',
    fontWeight: '600',
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

export default RegisterScreen;