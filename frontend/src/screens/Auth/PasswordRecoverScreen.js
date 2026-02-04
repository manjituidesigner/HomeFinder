// Password Recover Screen
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const PasswordRecoverScreen = ({ navigation }) => {
  const [newPassword, setNewPassword] = useState('PropertySecure123!');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdatePassword = () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    // For now, just navigate to Password Updated
    navigation.navigate('PasswordUpdated');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="chevron-left" size={32} color="#000" />
        </TouchableOpacity>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Set New Password</Text>
        <Text style={styles.subtitle}>
          Secure your account by choosing a strong, unique password.
        </Text>
      </View>
      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <MaterialIcons name={showNewPassword ? 'visibility' : 'visibility-off'} size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.strengthContainer}>
          <View style={styles.strengthHeader}>
            <Text style={styles.strengthLabel}>Password Strength</Text>
            <Text style={styles.strengthValue}>Strong</Text>
          </View>
          <View style={styles.strengthBar}>
            <View style={styles.strengthFill} />
          </View>
          <Text style={styles.strengthText}>Perfect! This password meets all security standards.</Text>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Repeat password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <MaterialIcons name={showConfirmPassword ? 'visibility' : 'visibility-off'} size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.requirements}>
          <Text style={styles.requirementsTitle}>Security Requirements</Text>
          <View style={styles.requirement}>
            <View style={styles.checkIcon}>
              <MaterialIcons name="check" size={18} color="#10B981" />
            </View>
            <Text style={styles.requirementText}>Minimum 8 characters</Text>
          </View>
          <View style={styles.requirement}>
            <View style={styles.checkIcon}>
              <MaterialIcons name="check" size={18} color="#10B981" />
            </View>
            <Text style={styles.requirementText}>At least one uppercase letter</Text>
          </View>
          <View style={styles.requirement}>
            <View style={styles.checkIcon}>
              <MaterialIcons name="check" size={18} color="#10B981" />
            </View>
            <Text style={styles.requirementText}>At least one number or symbol</Text>
          </View>
        </View>
      </View>
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePassword} activeOpacity={0.8}>
          <Text style={styles.updateText}>Update Password</Text>
        </TouchableOpacity>
        <Text style={styles.tip}>Security tip: Avoid using common names or dates.</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FE',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    paddingTop: 32,
    paddingBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#475569',
    lineHeight: 24,
  },
  form: {
    marginTop: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: '#0F172A',
  },
  strengthContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  strengthLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },
  strengthValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10B981',
  },
  strengthBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    width: '85%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  strengthText: {
    fontSize: 12,
    color: '#64748B',
  },
  requirements: {
    marginTop: 16,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
    marginLeft: 4,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  requirementText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#334155',
  },
  bottom: {
    marginTop: 'auto',
    paddingTop: 24,
  },
  updateButton: {
    height: 64,
    backgroundColor: '#8B5CF6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  updateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tip: {
    textAlign: 'center',
    fontSize: 14,
    color: '#64748B',
    marginTop: 16,
  },
});

export default PasswordRecoverScreen;