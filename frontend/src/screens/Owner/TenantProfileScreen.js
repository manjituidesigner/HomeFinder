// Tenant Profile Screen
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

const TenantProfileScreen = ({ route }) => {
  const { tenant } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: tenant.profilePhoto }} style={styles.photo} />
      <Text>Aadhar: {tenant.aadharNumber}</Text>
      <Text>Mobile: {tenant.mobile}</Text>
      <Text>Alternate Mobile: {tenant.alternateMobile}</Text>
      <Text>Last Address: {tenant.lastAddress}</Text>
      <Text>Profession: {tenant.profession}</Text>
      <Text>Job Location: {tenant.jobLocation}</Text>
      <Text>Vehicle: {tenant.vehicle}</Text>
      <Text>Marital Status: {tenant.maritalStatus}</Text>
      <Text>Living With: {tenant.livingWith}</Text>
      <Text>Working Hours: {tenant.workingHours}</Text>
      <Text>Vegetarian: {tenant.vegetarian ? 'Yes' : 'No'}</Text>
      <Text>Drink: {tenant.drink ? 'Yes' : 'No'}</Text>
      {/* Payments list */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  photo: { width: 100, height: 100, borderRadius: 50 },
});

export default TenantProfileScreen;