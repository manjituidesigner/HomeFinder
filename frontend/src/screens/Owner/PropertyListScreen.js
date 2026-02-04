// Property List Screen
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { getProperties } from '../../services/propertyService';

const PropertyListScreen = ({ navigation }) => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const data = await getProperties();
      setProperties(data);
    };
    fetchProperties();
  }, []);

  return (
    <View style={styles.container}>
      <Text>My Properties</Text>
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.title}</Text>
            <Button title="Edit" onPress={() => navigation.navigate('PropertyForm', { property: item })} />
          </View>
        )}
      />
      <Button title="Add Property" onPress={() => navigation.navigate('PropertyForm')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  item: { padding: 16, borderBottomWidth: 1 },
});

export default PropertyListScreen;