import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Platform, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const AddPropertyScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4; // Extend to 9 later

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    name: '',
    images: [],
    type: 'Flat / Apartment',
    rooms: '',
    config: '2 BHK',
    floor: '',
    listingType: 'For Rent',
    furnishing: 'Furnished',
    
    // Step 2
    rentAmount: '',
    advanceRent: '',
    waterCharges: '',
    electricity: '',
    cleaning: '',
    food: '',
    maintenance: '',
    increase: '',
    advanceBooking: '',
    
    // Step 3
    amenities: [],
    
    // Step 4
    drinks: 'Not Allowed',
    smoking: 'Not Allowed',
    lateNight: 'Not Allowed',
    visitors: 'Allowed',
    noticeTime: '',
    parking: 'No Parking',
    tenantType: 'Working Boys',
  });

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (item) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(item);
      return {
        ...prev,
        amenities: exists 
          ? prev.amenities.filter(a => a !== item)
          : [...prev.amenities, item]
      };
    });
  };

  const pickImage = async () => {
    if (formData.images.length >= 6) {
      alert('You can upload a maximum of 6 images.');
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setFormData(prev => ({ ...prev, images: [...prev.images, result.assets[0].uri] }));
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handlePublish = () => {
    alert('Property Published Successfully!');
    navigation.goBack();
  };

  const handleSaveDraft = () => {
    alert('Saved as Draft!');
    navigation.goBack();
  };

  const progressPercentage = currentStep === 1 ? 25 : (currentStep / totalSteps) * 100;

  // Render Helpers
  const renderOptionGroup = (label, key, options) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map(opt => {
          const isSelected = formData[key] === opt;
          return (
            <TouchableOpacity 
              key={opt} 
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => updateForm(key, opt)}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color="#334155" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Property</Text>
        <TouchableOpacity style={styles.publishBtnTop} onPress={handlePublish}>
          <Text style={styles.publishBtnText}>Publish</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.stepCounter}>Step {currentStep} of {totalSteps}</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* STEP 1: Basic Details */}
        {currentStep === 1 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <View style={styles.stepBullet} />
              <Text style={styles.stepTitle}>Basic Details</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Property Name</Text>
              <TextInput style={styles.input} placeholder="e.g. Modern Apartment" value={formData.name} onChangeText={v => updateForm('name', v)} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Upload Images (Min 3, Max 6)</Text>
              <View style={styles.imageGrid}>
                <TouchableOpacity style={styles.imageUploadBtn} onPress={pickImage}>
                  <MaterialIcons name="add-a-photo" size={32} color="#8B5CF6" />
                  <Text style={styles.imageUploadText}>Add</Text>
                </TouchableOpacity>
                {formData.images.map((uri, idx) => (
                  <View key={idx} style={styles.imagePreviewBox}>
                    <Image source={{ uri }} style={styles.imagePreview} />
                    <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(idx)}>
                      <MaterialIcons name="close" size={16} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            {renderOptionGroup('Property Type', 'type', ['Independent House', 'Flat / Apartment', 'Villa'])}
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>No. of Rooms</Text>
                <TextInput style={styles.input} placeholder="e.g. 3" keyboardType="numeric" value={formData.rooms} onChangeText={v => updateForm('rooms', v)} />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                {renderOptionGroup('Configuration', 'config', ['1 BHK', '2 BHK', '3 BHK'])}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Floor</Text>
              <TextInput style={styles.input} placeholder="e.g. Ground Floor, 5th" value={formData.floor} onChangeText={v => updateForm('floor', v)} />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                {renderOptionGroup('Listing Type', 'listingType', ['For Rent', 'For Sale'])}
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                {renderOptionGroup('Furnishing', 'furnishing', ['Furnished', 'Semi', 'Unfurnished'])}
              </View>
            </View>
          </View>
        )}

        {/* STEP 2: Rent & Charges */}
        {currentStep === 2 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <View style={styles.stepBullet} />
              <Text style={styles.stepTitle}>Rent & Charges</Text>
            </View>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Rent Amount</Text>
                <TextInput style={styles.input} placeholder="Monthly rent" keyboardType="numeric" value={formData.rentAmount} onChangeText={v => updateForm('rentAmount', v)} />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Advance Rent</Text>
                <TextInput style={styles.input} placeholder="Advance amount" keyboardType="numeric" value={formData.advanceRent} onChangeText={v => updateForm('advanceRent', v)} />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Water Charges</Text>
                <TextInput style={styles.input} placeholder="Water bill" keyboardType="numeric" value={formData.waterCharges} onChangeText={v => updateForm('waterCharges', v)} />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Electricity / Unit</Text>
                <TextInput style={styles.input} placeholder="Per unit" keyboardType="numeric" value={formData.electricity} onChangeText={v => updateForm('electricity', v)} />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Cleaning Charges</Text>
                <TextInput style={styles.input} placeholder="Cleaning" keyboardType="numeric" value={formData.cleaning} onChangeText={v => updateForm('cleaning', v)} />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>Food Charges</Text>
                <TextInput style={styles.input} placeholder="Food" keyboardType="numeric" value={formData.food} onChangeText={v => updateForm('food', v)} />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>Yearly Maint.</Text>
                <TextInput style={styles.input} placeholder="Maintenance" keyboardType="numeric" value={formData.maintenance} onChangeText={v => updateForm('maintenance', v)} />
              </View>
              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.label}>% Increase / yr</Text>
                <TextInput style={styles.input} placeholder="e.g. 5%" keyboardType="numeric" value={formData.increase} onChangeText={v => updateForm('increase', v)} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Advance Booking Charges</Text>
              <TextInput style={styles.input} placeholder="Booking charges" keyboardType="numeric" value={formData.advanceBooking} onChangeText={v => updateForm('advanceBooking', v)} />
            </View>
          </View>
        )}

        {/* STEP 3: Amenities */}
        {currentStep === 3 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <View style={styles.stepBullet} />
              <Text style={styles.stepTitle}>Amenities Provided</Text>
            </View>
            
            <View style={styles.chipRow}>
              {['Fan', 'Cooler', 'AC', 'Refrigerator', 'Gas', 'WiFi', 'Kitchen', 'Washing Machine', 'TV', 'Bed', 'Wardrobe'].map(item => {
                const isSelected = formData.amenities.includes(item);
                return (
                  <TouchableOpacity 
                    key={item} 
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => toggleAmenity(item)}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* STEP 4: Rules & Preferences */}
        {currentStep === 4 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <View style={styles.stepBullet} />
              <Text style={styles.stepTitle}>Tenant Rules & Preferences</Text>
            </View>
            
            {renderOptionGroup('Drinks', 'drinks', ['Not Allowed', 'Allowed', 'Conditions'])}
            {renderOptionGroup('Smoking', 'smoking', ['Not Allowed', 'Allowed', 'Conditions'])}
            {renderOptionGroup('Late night coming', 'lateNight', ['Not Allowed', 'Allowed', 'Conditions'])}
            {renderOptionGroup('Relatives/Friends Allowed', 'visitors', ['Allowed', 'Not Allowed'])}
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notice time to leave home (days)</Text>
              <TextInput style={styles.input} placeholder="e.g. 30" keyboardType="numeric" value={formData.noticeTime} onChangeText={v => updateForm('noticeTime', v)} />
            </View>

            {renderOptionGroup('Parking Rules', 'parking', ['No Parking', 'Bike Only', 'Car Only', 'Bike & Car'])}
            
            <Text style={styles.label}>Preferred Tenant Type</Text>
            <View style={styles.chipRow}>
              {['Married', 'Unmarried', 'Working Boys', 'Student Boys', 'Working Girls', 'Student Girls', 'Small Family', 'Full Family'].map(item => {
                const isSelected = formData.tenantType === item;
                return (
                  <TouchableOpacity 
                    key={item} 
                    style={[styles.chip, isSelected && styles.chipActive]}
                    onPress={() => updateForm('tenantType', item)}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

          </View>
        )}

      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.draftBtn} onPress={handleSaveDraft}>
          <Text style={styles.draftBtnText}>Save as Draft</Text>
        </TouchableOpacity>
        
        <View style={styles.bottomNavRight}>
          <TouchableOpacity 
            style={[styles.backBtn, currentStep === 1 && { opacity: 0.5 }]} 
            onPress={handleBack}
            disabled={currentStep === 1}
          >
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
          
          {currentStep < totalSteps ? (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.nextBtn} onPress={handlePublish}>
              <Text style={styles.nextBtnText}>Review</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A', flex: 1, textAlign: 'center' },
  publishBtnTop: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  publishBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
  
  progressContainer: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#FFFFFF' },
  stepCounter: { fontSize: 13, fontWeight: '600', color: '#64748B', marginBottom: 6 },
  progressBarBg: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, width: '100%', overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#8B5CF6', borderRadius: 3 },
  
  scrollView: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  stepContent: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  stepBullet: { width: 4, height: 24, backgroundColor: '#8B5CF6', borderRadius: 2, marginRight: 12 },
  stepTitle: { fontSize: 22, fontWeight: '700', color: '#0F172A' },
  
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 15,
    color: '#0F172A',
  },
  row: { flexDirection: 'row' },
  
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  imageUploadBtn: {
    width: '30%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: '#C4B5FD',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
  },
  imageUploadText: { fontSize: 12, fontWeight: '600', color: '#8B5CF6', marginTop: 4 },
  imagePreviewBox: { width: '30%', aspectRatio: 1, borderRadius: 12, backgroundColor: '#E2E8F0', overflow: 'hidden' },
  imagePreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  removeImageBtn: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, padding: 4 },
  
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  chipText: { fontSize: 14, fontWeight: '500', color: '#475569' },
  chipTextActive: { color: '#FFFFFF', fontWeight: '600' },
  
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  draftBtn: { paddingVertical: 12, paddingHorizontal: 8 },
  draftBtnText: { color: '#64748B', fontWeight: '600', fontSize: 15 },
  
  bottomNavRight: { flexDirection: 'row', gap: 12 },
  backBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
  backBtnText: { color: '#334155', fontWeight: '600', fontSize: 15 },
  nextBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#0F172A',
    borderRadius: 12,
  },
  nextBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
});

export default AddPropertyScreen;
