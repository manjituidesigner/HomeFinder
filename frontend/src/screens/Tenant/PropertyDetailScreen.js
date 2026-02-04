// Property Detail Screen
import React from 'react';
import { View, Text, Image, ScrollView, Button, StyleSheet } from 'react-native';

const PropertyDetailScreen = ({ route }) => {
  const { property } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Text>{property.title}</Text>
      <Text>{property.description}</Text>
      {property.images.map((img, index) => <Image key={index} source={{ uri: img }} style={styles.image} />)}
      <Text>Location: {property.location}</Text>
      <Text>Rooms: {property.rooms}</Text>
      <Text>Type: {property.type}</Text>
      <Text>Inclusions: {property.inclusions.join(', ')}</Text>
      <Text>Rent: {property.rentPrice}</Text>
      <Button title="Book Now" onPress={() => {/* Handle booking */}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  image: { width: '100%', height: 200 },
});

export default PropertyDetailScreen;