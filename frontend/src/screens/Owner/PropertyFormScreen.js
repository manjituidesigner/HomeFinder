// Property Form Screen
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, CheckBox } from 'react-native';
import { createProperty } from '../services/propertyService';

const PropertyFormScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [rooms, setRooms] = useState('');
  const [type, setType] = useState('');
  const [inclusions, setInclusions] = useState([]);
  const [rentPrice, setRentPrice] = useState('');
  const [extraExpenses, setExtraExpenses] = useState({});
  const [address, setAddress] = useState({});
  const [contact, setContact] = useState('');

  const handleSubmit = async () => {
    const propertyData = {
      title,
      description,
      location,
      rooms: parseInt(rooms),
      type,
      inclusions,
      rentPrice: parseFloat(rentPrice),
      extraExpenses,
      address,
      contact,
    };
    try {
      await createProperty(propertyData);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text>Add Property</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} />
      <TextInput placeholder="Location" value={location} onChangeText={setLocation} />
      <TextInput placeholder="Number of Rooms" value={rooms} onChangeText={setRooms} keyboardType="numeric" />
      <TextInput placeholder="Type (e.g., 3bhk)" value={type} onChangeText={setType} />
      <TextInput placeholder="Rent Price" value={rentPrice} onChangeText={setRentPrice} keyboardType="numeric" />
      <TextInput placeholder="Contact" value={contact} onChangeText={setContact} />
      {/* Add more fields for inclusions, expenses, address */}
      <Button title="Save Property" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});

export default PropertyFormScreen;