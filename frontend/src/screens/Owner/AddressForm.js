// Address Form Component
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const AddressForm = ({
  streetAddress,
  setStreetAddress,
  city,
  setCity,
  state,
  setState,
  country,
  setCountry,
  pinCode,
  setPinCode,
  sameAddress,
  setSameAddress,
}) => {
  return (
    <View style={styles.addressSection}>
      <Text style={styles.addressLabel}>ADDRESS</Text>
      <View style={styles.addressGrid}>
        <View style={styles.addressInputGroup}>
          <Text style={styles.label}>Street Address</Text>
          <TextInput
            style={styles.addressInput}
            placeholder="123 Main St"
            value={streetAddress}
            onChangeText={setStreetAddress}
          />
        </View>
        <View style={styles.addressInputGroup}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.addressInput}
            placeholder="New York"
            value={city}
            onChangeText={setCity}
          />
        </View>
        <View style={styles.addressInputGroup}>
          <Text style={styles.label}>State</Text>
          <TextInput
            style={styles.addressInput}
            placeholder="NY"
            value={state}
            onChangeText={setState}
          />
        </View>
        <View style={styles.addressInputGroup}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.addressInput}
            placeholder="USA"
            value={country}
            onChangeText={setCountry}
          />
        </View>
        <View style={styles.addressInputGroup}>
          <Text style={styles.label}>PIN Code</Text>
          <TextInput
            style={styles.addressInput}
            placeholder="10001"
            value={pinCode}
            onChangeText={setPinCode}
            keyboardType="numeric"
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setSameAddress(!sameAddress)}
      >
        <View style={[styles.checkbox, sameAddress && styles.checked]}>
          {sameAddress && <MaterialIcons name="check" size={14} color="#FFFFFF" />}
        </View>
        <Text style={styles.checkboxText}>Same as registered address</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addressSection: {
    marginTop: 24,
  },
  addressLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  addressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  addressInputGroup: {
    width: '48%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#140d1b',
    marginBottom: 8,
  },
  addressInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#7311d4',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: '#7311d4',
  },
  checkboxText: {
    fontSize: 14,
    color: '#64748B',
  },
});

export default AddressForm;