import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const OwnerCurrentAddressScreen = ({ navigation }) => {
  const [houseNumber, setHouseNumber] = useState('');
  const [society, setSociety] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('United States');
  const [pinCode, setPinCode] = useState('');

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    navigation.navigate('OwnerDashboard');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerWrap}>
        <View style={styles.shell}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.iconButton} onPress={handleBack} activeOpacity={0.8}>
              <MaterialIcons name="arrow-back-ios" size={18} color="#18181B" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Step 2 of 10</Text>
            <View style={styles.iconSpacer} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.shell}>
          <View style={styles.stepper}>
            {Array.from({ length: 10 }).map((_, index) => (
              <View
                key={`step-${index}`}
                style={[styles.stepBar, index < 2 ? styles.stepBarActive : styles.stepBarInactive]}
              />
            ))}
          </View>

          <View style={styles.titleBlock}>
            <Text style={styles.title}>Owner Current Address</Text>
            <Text style={styles.subtitle}>
              Please provide the details of your primary residence to complete your profile.
            </Text>
          </View>

          <TouchableOpacity style={styles.pinButton} activeOpacity={0.85}>
            <MaterialIcons name="location-on" size={20} color="#8B5CF6" />
            <Text style={styles.pinButtonText}>Pin Location on Map</Text>
          </TouchableOpacity>

          <View style={styles.formGrid}>
            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>House No.</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 402"
                  placeholderTextColor="#A1A1AA"
                  value={houseNumber}
                  onChangeText={setHouseNumber}
                />
              </View>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Society</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Apartment Name"
                  placeholderTextColor="#A1A1AA"
                  value={society}
                  onChangeText={setSociety}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Street</Text>
              <TextInput
                style={styles.input}
                placeholder="Road name or Number"
                placeholderTextColor="#A1A1AA"
                value={street}
                onChangeText={setStreet}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nearby Landmark</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Central Mall"
                placeholderTextColor="#A1A1AA"
                value={landmark}
                onChangeText={setLandmark}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>City</Text>
                <TextInput
                  style={styles.input}
                  placeholder="City"
                  placeholderTextColor="#A1A1AA"
                  value={city}
                  onChangeText={setCity}
                />
              </View>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={styles.input}
                  placeholder="State"
                  placeholderTextColor="#A1A1AA"
                  value={state}
                  onChangeText={setState}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Country</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Country"
                  placeholderTextColor="#A1A1AA"
                  value={country}
                  onChangeText={setCountry}
                />
              </View>
              <View style={styles.fieldHalf}>
                <Text style={styles.label}>Pin Code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Zip code"
                  placeholderTextColor="#A1A1AA"
                  value={pinCode}
                  onChangeText={setPinCode}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <View style={styles.mapWrap}>
            <View style={styles.mapCard}>
              <Image
                source={{
                  uri:
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuANEUPHNa9oD_wf7JEw3htP_h2wZSOyGbyFFkAnXLpO8rOavuNf7ZBu5fDIaloG1wMYt0iV7k9klEE3LbQ_-fldRsolKlRgGpgTXQ4ut-qP2HI2WWakICqH06xH7GFEhomTrgEmBkahV4WJ3rKo1hvAXQokSD517rVqS-aOW9-h2G5pXMpcjPYamCF9mJQyipkdmVthIOkYxMz4a5FDvn466kevThlPKT3NxGrB0B9wxOYp0014yLwMn3brys5GEPFc0O9GNsYJc9D6',
                }}
                style={styles.mapImage}
              />
              <View style={styles.mapPinWrap}>
                <View style={styles.mapPin}>
                  <MaterialIcons name="location-on" size={26} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footerWrap}>
        <View style={styles.footerShell}>
          <TouchableOpacity style={styles.footerButton} onPress={handleNext} activeOpacity={0.9}>
            <Text style={styles.footerButtonText}>Next Step</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingBottom: 140,
  },
  shell: {
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  headerWrap: {
    backgroundColor: 'rgba(248, 250, 252, 0.95)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#18181B',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  iconSpacer: {
    width: 40,
  },
  stepper: {
    flexDirection: 'row',
    gap: 6,
    paddingTop: 12,
    paddingBottom: 20,
  },
  stepBar: {
    flex: 1,
    height: 6,
    borderRadius: 99,
  },
  stepBarActive: {
    backgroundColor: '#8B5CF6',
  },
  stepBarInactive: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  titleBlock: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#18181B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#71717A',
    lineHeight: 20,
  },
  pinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    marginBottom: 24,
  },
  pinButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  formGrid: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  fieldHalf: {
    flex: 1,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#52525B',
    marginLeft: 4,
  },
  input: {
    height: 52,
    borderRadius: 999,
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    fontSize: 14,
    color: '#18181B',
  },
  mapWrap: {
    marginTop: 24,
    paddingBottom: 12,
  },
  mapCard: {
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E4E4E7',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapPinWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPin: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
  },
  footerWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 16,
    paddingTop: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7',
  },
  footerShell: {
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  footerButton: {
    height: 56,
    backgroundColor: '#8B5CF6',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default OwnerCurrentAddressScreen;
