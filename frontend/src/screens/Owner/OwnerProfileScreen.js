// Owner Profile Screen
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AddressForm from './AddressForm';

const OwnerProfileScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const scrollViewRef = useRef();
  const [fullName, setFullName] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [sameAddress, setSameAddress] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [aadharNumber, setAadharNumber] = useState('4582 9102 3341');
  const [aadharFront, setAadharFront] = useState(null);
  const [aadharBack, setAadharBack] = useState(null);
  const [identityProof, setIdentityProof] = useState(null);
  const [electricityBill, setElectricityBill] = useState(null);
  const [familyMembers, setFamilyMembers] = useState('4');
  const [adults, setAdults] = useState('2');
  const [kids, setKids] = useState('2');
  const [selectedVehicle, setSelectedVehicle] = useState('car');

  const vehicles = [
    { key: 'car', label: 'Car', icon: 'directions-car', color: ['#60a5fa', '#2563eb'] },
    { key: 'bike', label: 'Bike', icon: 'motorcycle', color: ['#fb923c', '#dc2626'] },
    { key: 'scooter', label: 'Scooter', icon: 'scooter', color: ['#2dd4bf', '#059669'] },
  ];

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [step]);

  const pickImage = async (setImage) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera roll permissions are required to select an image.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takeSelfie = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permissions are required to take a selfie.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleComplete = () => {
    navigation.getParent()?.navigate('Main');
    navigation.navigate('OwnerDashboard');
  };

  const getProgress = () => {
    switch (step) {
      case 1: return { percent: 25, text: 'Step 1 of 4' };
      case 2: return { percent: 66, text: 'Step 2 of 3' };
      case 3: return { percent: 100, text: 'Almost there!' };
      default: return { percent: 25, text: 'Step 1 of 4' };
    }
  };

  const getTitle = () => {
    switch (step) {
      case 1: return 'Personal Identity';
      case 2: return 'Official Documents';
      case 3: return 'Family & Household';
      default: return 'Personal Identity';
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case 1: return "Let's start with your basic information.";
      case 2: return 'Please provide valid government IDs';
      case 3: return 'Final step to personalize your home dashboard.';
      default: return "Let's start with your basic information.";
    }
  };

  const progress = getProgress();

  return (
    <ScrollView ref={scrollViewRef} style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Top Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#7311d4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Owner Profile</Text>
        <View style={{ width: 48 }} />
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressStep}>{progress.text}</Text>
            <Text style={styles.progressPercent}>{progress.percent}% Complete</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress.percent}%` }]} />
          </View>
        </View>
      </View>

      {/* Headline */}
      <View style={styles.headline}>
        <Text style={styles.title}>{getTitle()}</Text>
        <Text style={styles.subtitle}>{getSubtitle()}</Text>
      </View>

      {/* Step Content */}
      {step === 1 && (
        <>
          {/* Profile Photo */}
          <View style={styles.photoSection}>
            <View style={styles.photoContainer}>
              <Image
                source={profileImage ? { uri: profileImage } : { uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTa1KQEVHjvbx9YJcnLr2OKI_NNtKdTzvzxFtfOTifJa11c1QTnY1SSfldK7Y2wMS-qkBp-4H-RBHQmUGZvZIZu-eKnIRpcGCZfsajR4tDDpGyCjeN6RouBx1l06nWvOtMccjcq1lUGybJsRDXI_p6ENY_DqF5HxjD1KUVuSpyEdG5ZeX4RsDjKiLsiaYgUEN2AYX_oxg70QYt0XNtCH-gqjtqV62V0PxoHQ0RXHo4e9TADGrjrEqoGDMku8iSZ6QFykrLgfdAX7s");' }}
                style={styles.photo}
              />
              <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
                <MaterialIcons name="photo-camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.photoTitle}>Profile Photo</Text>
            <Text style={styles.photoSubtitle}>Take a selfie for instant verification</Text>
            <View style={styles.photoButtons}>
              <TouchableOpacity style={styles.selfieButton} onPress={takeSelfie}>
                <MaterialIcons name="camera-alt" size={20} color="#8B5CF6" />
                <Text style={styles.selfieText}>Take Selfie</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.galleryButton} onPress={() => pickImage(setProfileImage)}>
                <MaterialIcons name="photo-library" size={20} color="#6B7280" />
                <Text style={styles.galleryText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Input Fields */}
          <View style={styles.inputs}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Johnathan Doe"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email (Verified)</Text>
              <View style={styles.verifiedInput}>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value="johndoe@example.com"
                  editable={false}
                />
                <MaterialIcons name="verified" size={20} color="#10B981" />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.verifiedInput}>
                <TextInput
                  style={[styles.input, styles.disabledInput]}
                  value="+1 234 567 890"
                  editable={false}
                />
                <MaterialIcons name="verified" size={20} color="#10B981" />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Alternate Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="Optional phone number"
                value={alternatePhone}
                onChangeText={setAlternatePhone}
              />
            </View>
          </View>

          {/* Address Section */}
          <AddressForm
            streetAddress={streetAddress}
            setStreetAddress={setStreetAddress}
            city={city}
            setCity={setCity}
            state={state}
            setState={setState}
            country={country}
            setCountry={setCountry}
            pinCode={pinCode}
            setPinCode={setPinCode}
            sameAddress={sameAddress}
            setSameAddress={setSameAddress}
          />
        </>
      )}

      {step === 2 && (
        <>
          {/* Aadhar Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Aadhar Card Number</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="0000 0000 0000"
                value={aadharNumber}
                onChangeText={setAadharNumber}
                keyboardType="numeric"
              />
              <MaterialIcons name="check-circle" size={24} color="#10b981" style={styles.checkIcon} />
            </View>
          </View>

          {/* Upload Section */}
          <View style={styles.uploadContainer}>
            <Text style={styles.uploadTitle}>Upload Files</Text>
            <View style={styles.uploadGrid}>
              <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage(setAadharFront)}>
                <View style={styles.uploadIcon}>
                  <MaterialIcons name="contacts" size={28} color="#7c3aed" />
                </View>
                <View>
                  <Text style={styles.uploadText}>Aadhar Front</Text>
                  <Text style={styles.uploadSubtext}>Upload</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage(setAadharBack)}>
                <View style={styles.uploadIcon}>
                  <MaterialIcons name="badge" size={28} color="#7c3aed" />
                </View>
                <View>
                  <Text style={styles.uploadText}>Aadhar Back</Text>
                  <Text style={styles.uploadSubtext}>Upload</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.uploadBox, styles.fullWidth]} onPress={() => pickImage(setIdentityProof)}>
                <View style={styles.uploadIconLarge}>
                  <MaterialIcons name="account-box" size={28} color="#7c3aed" />
                </View>
                <View style={styles.uploadContent}>
                  <Text style={styles.uploadText}>Identity Proof</Text>
                  <Text style={styles.uploadDesc}>Passport or Driving License</Text>
                </View>
                <View style={styles.uploadButton}>
                  <MaterialIcons name="upload" size={20} color="#7c3aed" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.uploadBox, styles.fullWidth]} onPress={() => pickImage(setElectricityBill)}>
                <View style={styles.uploadIconLarge}>
                  <MaterialIcons name="receipt-long" size={28} color="#7c3aed" />
                </View>
                <View style={styles.uploadContent}>
                  <Text style={styles.uploadText}>Electricity Bill</Text>
                  <Text style={styles.uploadDesc}>Address verification proof</Text>
                </View>
                <View style={styles.uploadButton}>
                  <MaterialIcons name="upload" size={20} color="#7c3aed" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

      {step === 3 && (
        <>
          {/* Inputs */}
          <View style={styles.inputsContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Family Members Count</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  value={familyMembers}
                  onChangeText={setFamilyMembers}
                  keyboardType="numeric"
                />
                <View style={styles.inputIcon}>
                  <MaterialIcons name="groups" size={24} color="#7c3aed" />
                </View>
              </View>
            </View>
            <View style={styles.rowInputs}>
              <View style={styles.halfInputGroup}>
                <Text style={styles.label}>Adults</Text>
                <TextInput
                  style={styles.input}
                  value={adults}
                  onChangeText={setAdults}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.halfInputGroup}>
                <Text style={styles.label}>Kids</Text>
                <TextInput
                  style={styles.input}
                  value={kids}
                  onChangeText={setKids}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Vehicles */}
          <View style={styles.vehiclesContainer}>
            <Text style={styles.vehiclesLabel}>Vehicles in your garage</Text>
            <View style={styles.vehiclesGrid}>
              {vehicles.map((vehicle) => (
                <TouchableOpacity
                  key={vehicle.key}
                  style={[
                    styles.vehicleButton,
                    selectedVehicle === vehicle.key && styles.vehicleButtonActive,
                  ]}
                  onPress={() => setSelectedVehicle(vehicle.key)}
                >
                  <View style={[styles.vehicleIcon, { backgroundColor: vehicle.color[0] }]}>
                    <MaterialIcons name={vehicle.icon} size={32} color="#ffffff" />
                  </View>
                  <Text style={styles.vehicleLabel}>{vehicle.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        {step < 3 ? (
          <TouchableOpacity style={styles.saveButton} onPress={handleNext} activeOpacity={0.8}>
            <Text style={styles.saveText}>Save & Continue</Text>
            <MaterialIcons name="arrow-forward" size={24} color="#ffffff" />
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={styles.completeButton} onPress={handleComplete} activeOpacity={0.8}>
              <Text style={styles.completeText}>Complete Profile</Text>
              <View style={styles.completeIcon}>
                <MaterialIcons name="auto-awesome" size={20} color="#ffffff" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton}>
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.indicator} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#140d1b',
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressStep: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 3,
  },
  headline: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#140d1b',
    lineHeight: 38.4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 22.4,
  },
  photoSection: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 32,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  photo: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#7311d4',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  photoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#140d1b',
    textAlign: 'center',
    marginBottom: 4,
  },
  photoSubtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 280,
  },
  selfieButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7311d4',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#7311d4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  selfieText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flex: 1,
    marginLeft: 8,
    justifyContent: 'center',
  },
  galleryText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  inputs: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#140d1b',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    fontSize: 16,
    color: '#140d1b',
  },
  verifiedInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    color: '#64748B',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  inputWrapper: {
    position: 'relative',
  },
  checkIcon: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  uploadContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  uploadGrid: {
    gap: 16,
  },
  uploadBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    borderStyle: 'dashed',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 32,
    elevation: 4,
  },
  fullWidth: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  uploadIconLarge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
  },
  uploadSubtext: {
    fontSize: 10,
    fontWeight: '700',
    color: '#7c3aed',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 4,
  },
  uploadContent: {
    flex: 1,
    marginLeft: 16,
  },
  uploadDesc: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    marginTop: 2,
  },
  uploadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  halfInputGroup: {
    flex: 1,
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehiclesContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  vehiclesLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    marginLeft: 8,
  },
  vehiclesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vehicleButton: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal: 4,
  },
  vehicleButtonActive: {
    borderColor: '#7c3aed',
    backgroundColor: 'rgba(124, 58, 237, 0.05)',
    transform: [{ scale: 1.05 }],
  },
  vehicleIcon: {
    width: 64,
    height: 64,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  vehicleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  actions: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    backgroundColor: '#8B5CF6',
    borderRadius: 32,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 12,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    backgroundColor: '#7c3aed',
    borderRadius: 40,
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 25,
    elevation: 10,
  },
  completeText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginRight: 12,
  },
  completeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  indicator: {
    width: 128,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 8,
  },
});

export default OwnerProfileScreen;