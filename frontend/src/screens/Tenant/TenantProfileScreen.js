// Tenant Profile Screen
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { updateTenantProfile } from '../../services/tenantService';
import { deleteAccountInitiate, deleteAccountVerify } from '../../services/authService';
import { clearAuthToken } from '../../services/authStorage';

const TenantProfileScreen = ({ navigation }) => {
  const [profile, setProfile] = useState({});

  const handleUpdate = async () => {
    // await updateTenantProfile(profile.id, profile);
  };



  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>My Profile</Text>
      
      <View style={styles.card}>
        <TextInput 
          style={styles.input} 
          placeholder="Name" 
          value={profile.name} 
          onChangeText={(text) => setProfile({ ...profile, name: text })} 
        />
        {/* Add other fields */}
        <TouchableOpacity style={styles.primaryButton} onPress={handleUpdate}>
          <Text style={styles.primaryButtonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  content: { padding: 16, paddingBottom: 60 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#0F172A' },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  input: { borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  primaryButton: { backgroundColor: '#8B5CF6', padding: 14, borderRadius: 8, alignItems: 'center' },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});

export default TenantProfileScreen;