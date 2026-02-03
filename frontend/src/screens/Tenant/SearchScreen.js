// Search Properties Screen
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Button, StyleSheet } from 'react-native';
import { getProperties } from '../../services/propertyService';

const SearchScreen = ({ navigation }) => {
  const [properties, setProperties] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      const data = await getProperties();
      setProperties(data);
    };
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(p => p.location.includes(search));

  return (
    <View style={styles.container}>
      <TextInput placeholder="Search by location" value={search} onChangeText={setSearch} />
      <FlatList
        data={filteredProperties}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.title}</Text>
            <Text>{item.location}</Text>
            <Button title="View Details" onPress={() => navigation.navigate('PropertyDetail', { property: item })} />
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

export default SearchScreen;