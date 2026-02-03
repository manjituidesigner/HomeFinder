// Tenant List Screen
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { getTenants } from '../../services/tenantService';

const TenantListScreen = ({ route }) => {
  const { propertyId } = route.params;
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    const fetchTenants = async () => {
      const data = await getTenants(propertyId);
      setTenants(data);
    };
    fetchTenants();
  }, [propertyId]);

  return (
    <View style={styles.container}>
      <Text>Tenants</Text>
      <FlatList
        data={tenants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <Button title="View Profile" onPress={() => navigation.navigate('TenantProfile', { tenant: item })} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { padding: 16, borderBottomWidth: 1 },
});

export default TenantListScreen;