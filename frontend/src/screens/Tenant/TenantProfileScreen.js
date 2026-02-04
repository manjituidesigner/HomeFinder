// Tenant Profile Screen
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { updateTenantProfile } from '../services/tenantService';

const TenantProfileScreen = () => {
  const [profile, setProfile] = useState({});

  const handleUpdate = async () => {
    await updateTenantProfile(profile.id, profile);
  };

  return (
    <ScrollView style={styles.container}>
      <Text>My Profile</Text>
      <TextInput placeholder="Name" value={profile.name} onChangeText={(text) => setProfile({ ...profile, name: text })} />
      {/* Add other fields */}
      <Button title="Update" onPress={handleUpdate} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});

export default TenantProfileScreen;