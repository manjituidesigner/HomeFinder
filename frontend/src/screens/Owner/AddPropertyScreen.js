import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, Platform, Image, Modal, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { createPropertyWithImages } from '../../services/propertyService';

const CustomDropdown = ({ label, value, options, onSelect, noMargin }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={noMargin ? { flex: 1 } : styles.inputGroup}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setModalVisible(true)}>
        <Text style={[styles.dropdownText, !value && { color: '#94A3B8' }]} numberOfLines={1}>
          {value || 'Select'}
        </Text>
        <MaterialIcons name="keyboard-arrow-down" size={20} color="#64748B" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select {label}</Text>
              {options.map((opt, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.modalOption}
                  onPress={() => {
                    onSelect(opt);
                    setModalVisible(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, value === opt && { color: '#2596be', fontWeight: 'bold' }]}>
                    {opt}
                  </Text>
                  {value === opt && <MaterialIcons name="check" size={20} color="#2596be" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const AddPropertyScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4; // Extend to 9 later
  const [isPublishing, setIsPublishing] = useState(false);

  const [formData, setFormData] = useState({
    name: '', images: [], type: 'Independent House', rooms: '', config: '1 BHK', floor: '', listingType: 'For Rent', furnishing: 'Furnished',
    rentAmount: '', securityDeposit: '', maintenanceCharges: '', customCharges: [],
    amenities: [], drinks: 'Not Allowed', smoking: 'Not Allowed', lateNight: 'Not Allowed', visitors: 'Allowed', noticeTime: '', parking: 'No Parking', parkingCount: '', parkingLocation: '', tenantType: 'Working Boys',
  });

  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const [showCustomAmenity, setShowCustomAmenity] = useState(false);
  const [customAmenity, setCustomAmenity] = useState('');

  const addCustomAmenity = () => {
    if (customAmenity.trim()) {
      if (!formData.amenities.includes(customAmenity.trim())) {
        toggleAmenity(customAmenity.trim());
      }
    }
    setCustomAmenity('');
    setShowCustomAmenity(false);
  };

  const addCustomCharge = () => {
    setFormData(prev => ({
      ...prev,
      customCharges: [...prev.customCharges, { name: '', amount: '', type: 'Monthly' }]
    }));
  };

  const updateCustomCharge = (index, key, value) => {
    const updated = [...formData.customCharges];
    updated[index][key] = value;
    setFormData(prev => ({ ...prev, customCharges: updated }));
  };

  const removeCustomCharge = (index) => {
    setFormData(prev => ({
      ...prev,
      customCharges: prev.customCharges.filter((_, i) => i !== index)
    }));
  };

  const toggleAmenity = (item) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(item) ? prev.amenities.filter(a => a !== item) : [...prev.amenities, item]
    }));
  };

  const pickImage = async () => {
    if (formData.images.length >= 6) {
      alert('You can upload a maximum of 6 images.');
      return;
    }
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return alert('Sorry, we need camera roll permissions!');
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });
    if (!result.canceled) setFormData(prev => ({ ...prev, images: [...prev.images, result.assets[0].uri] }));
  };

  const removeImage = (indexToRemove) => setFormData(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== indexToRemove) }));
  const handleNext = () => { if (currentStep < totalSteps) setCurrentStep(prev => prev + 1); };
  const handleBack = () => { if (currentStep > 1) setCurrentStep(prev => prev - 1); };
  
  const handlePublish = async () => { 
    try {
      setIsPublishing(true);
      await createPropertyWithImages(formData);
      alert('Property Published Successfully!'); 
      navigation.goBack(); 
    } catch (err) {
      console.error(err);
      alert('Failed to publish property.');
    } finally {
      setIsPublishing(false);
    }
  };
  
  const handleSaveDraft = () => { alert('Saved as Draft!'); navigation.goBack(); };

  const progressPercentage = currentStep === 1 ? 25 : (currentStep / totalSteps) * 100;

  const renderOptionGroup = (label, key, options) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipRow}>
        {options.map(opt => (
          <TouchableOpacity key={opt} style={[styles.chip, formData[key] === opt && styles.chipActive]} onPress={() => updateForm(key, opt)}>
            <Text style={[styles.chipText, formData[key] === opt && styles.chipTextActive]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="keyboard-arrow-left" size={28} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Property</Text>
        <View style={{ width: 28 }} /> 
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.stepCounter}>Step {currentStep} of {totalSteps}</Text>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {currentStep === 1 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <View style={styles.stepVerticalLine} />
              <Text style={styles.stepTitle}>Basic Details</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Property Name</Text>
              <TextInput style={styles.input} placeholder="e.g. Modern Apartment" placeholderTextColor="#94A3B8" value={formData.name} onChangeText={v => updateForm('name', v)} />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Upload Images (max 6)</Text>
              <View style={styles.imageGrid}>
                {formData.images.length < 6 && (
                  <TouchableOpacity style={styles.imageUploadBtn} onPress={pickImage}>
                    <MaterialIcons name="add-a-photo" size={28} color="#2596be" />
                    <Text style={styles.imageUploadText}>Add</Text>
                  </TouchableOpacity>
                )}
                {formData.images.map((uri, idx) => (
                  <View key={idx} style={styles.imagePreviewBox}>
                    <Image source={{ uri }} style={styles.imagePreview} />
                    <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(idx)}>
                      <MaterialIcons name="close" size={14} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>

            <CustomDropdown label="Property Type" value={formData.type} options={['Independent House', 'Flat / Apartment', 'Villa']} onSelect={v => updateForm('type', v)} />
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.label}>No. of Rooms</Text>
                <TextInput style={styles.input} placeholder="e.g. 3" placeholderTextColor="#94A3B8" keyboardType="numeric" value={formData.rooms} onChangeText={v => updateForm('rooms', v)} />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <CustomDropdown label="Configuration" value={formData.config} options={['1 BHK', '2 BHK', '3 BHK']} onSelect={v => updateForm('config', v)} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Floor</Text>
              <TextInput style={styles.input} placeholder="e.g. Ground Floor, 5th" placeholderTextColor="#94A3B8" value={formData.floor} onChangeText={v => updateForm('floor', v)} />
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <CustomDropdown label="Listing Type" value={formData.listingType} options={['For Rent', 'For Sale']} onSelect={v => updateForm('listingType', v)} />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <CustomDropdown label="Furnishing" value={formData.furnishing} options={['Furnished', 'Semi', 'Unfurnished']} onSelect={v => updateForm('furnishing', v)} />
              </View>
            </View>
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <View style={styles.stepVerticalLine} />
              <Text style={styles.stepTitle}>Rent & Charges</Text>
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rent Amount</Text>
              <TextInput style={styles.input} placeholder="$ 25,000" placeholderTextColor="#94A3B8" keyboardType="numeric" value={formData.rentAmount} onChangeText={v => updateForm('rentAmount', v)} />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Security Deposit</Text>
              <TextInput style={styles.input} placeholder="$ 50,000" placeholderTextColor="#94A3B8" keyboardType="numeric" value={formData.securityDeposit} onChangeText={v => updateForm('securityDeposit', v)} />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Maintenance Charges</Text>
              <TextInput style={styles.input} placeholder="$ 2,000 / month" placeholderTextColor="#94A3B8" value={formData.maintenanceCharges} onChangeText={v => updateForm('maintenanceCharges', v)} />
            </View>
            
            <View style={styles.inputGroup}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Text style={[styles.label, { marginBottom: 0 }]}>Other Charges (optional)</Text>
              </View>
              
              {formData.customCharges.map((charge, index) => (
                <View key={index} style={styles.customChargeCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <TextInput 
                      style={[styles.input, { flex: 1, marginRight: 8, backgroundColor: '#FFFFFF' }]} 
                      placeholder="e.g. AC Rent" 
                      placeholderTextColor="#94A3B8"
                      value={charge.name}
                      onChangeText={v => updateCustomCharge(index, 'name', v)}
                    />
                    <TouchableOpacity onPress={() => removeCustomCharge(index)} style={styles.removeChargeBtn}>
                      <MaterialIcons name="remove-circle-outline" size={24} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput 
                      style={[styles.input, { flex: 1, marginRight: 8, backgroundColor: '#FFFFFF' }]} 
                      placeholder="Rs 500" 
                      keyboardType="numeric"
                      placeholderTextColor="#94A3B8"
                      value={charge.amount}
                      onChangeText={v => updateCustomCharge(index, 'amount', v)}
                    />
                    <CustomDropdown 
                      label="" 
                      value={charge.type} 
                      options={['Monthly', 'One-time']} 
                      onSelect={v => updateCustomCharge(index, 'type', v)} 
                      noMargin={true}
                    />
                  </View>
                </View>
              ))}

              <TouchableOpacity style={styles.addChargeBtn} onPress={addCustomCharge}>
                <MaterialIcons name="add" size={18} color="#2596be" />
                <Text style={styles.addChargeText}>Add Other Charge</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}

        {currentStep === 3 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <View style={styles.stepVerticalLine} />
              <Text style={styles.stepTitle}>Amenities Provided</Text>
            </View>
            <View style={styles.chipRow}>
              {['Fan', 'Cooler', 'AC', 'Refrigerator', 'Gas', 'WiFi', 'Kitchen', 'Washing Machine', 'TV', 'Bed', 'Wardrobe'].map(item => (
                <TouchableOpacity key={item} style={[styles.chip, formData.amenities.includes(item) && styles.chipActive]} onPress={() => toggleAmenity(item)}>
                  <Text style={[styles.chipText, formData.amenities.includes(item) && styles.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              ))}
              
              {formData.amenities.filter(a => !['Fan', 'Cooler', 'AC', 'Refrigerator', 'Gas', 'WiFi', 'Kitchen', 'Washing Machine', 'TV', 'Bed', 'Wardrobe'].includes(a)).map(item => (
                <TouchableOpacity key={item} style={[styles.chip, styles.chipActive]} onPress={() => toggleAmenity(item)}>
                  <Text style={[styles.chipText, styles.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              ))}

              {showCustomAmenity ? (
                <View style={styles.customAmenityInputRow}>
                  <TextInput 
                    style={[styles.input, { height: 36, paddingHorizontal: 10, flex: 1 }]} 
                    placeholder="Type Amenity Name..." 
                    value={customAmenity} 
                    onChangeText={setCustomAmenity} 
                    autoFocus
                  />
                  <TouchableOpacity style={styles.addCustomAmenityBtn} onPress={addCustomAmenity}>
                    <MaterialIcons name="check" size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={[styles.chip, { borderStyle: 'dashed', backgroundColor: 'transparent' }]} onPress={() => setShowCustomAmenity(true)}>
                  <Text style={styles.chipText}>+ Custom</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {currentStep === 4 && (
          <View style={styles.stepContent}>
            <View style={styles.stepHeader}>
              <View style={styles.stepVerticalLine} />
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
            
            {formData.parking !== 'No Parking' && (
              <View style={{ backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#E2E8F0', marginTop: -12 }}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>How much space is available?</Text>
                  <TextInput 
                    style={[styles.input, { backgroundColor: '#FFFFFF' }]} 
                    placeholder={formData.parking === 'Bike & Car' ? 'e.g. 1 Bike & 1 Car' : `e.g. 2 Spaces`}
                    placeholderTextColor="#94A3B8"
                    value={formData.parkingCount}
                    onChangeText={v => updateForm('parkingCount', v)}
                  />
                </View>
                <View style={[styles.inputGroup, { marginBottom: 0 }]}>
                  <Text style={styles.label}>Parking Location</Text>
                  <View style={styles.chipRow}>
                    {['In House', 'At Street'].map(item => (
                      <TouchableOpacity 
                        key={item} 
                        style={[styles.chip, { backgroundColor: '#FFFFFF' }, formData.parkingLocation === item && styles.chipActive]} 
                        onPress={() => updateForm('parkingLocation', item)}
                      >
                        <Text style={[styles.chipText, formData.parkingLocation === item && styles.chipTextActive]}>{item}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}

            <Text style={styles.label}>Preferred Tenant Type</Text>
            <View style={styles.chipRow}>
              {['Married', 'Unmarried', 'Working Boys', 'Student Boys', 'Working Girls', 'Student Girls', 'Small Family', 'Full Family'].map(item => (
                <TouchableOpacity key={item} style={[styles.chip, formData.tenantType === item && styles.chipActive]} onPress={() => updateForm('tenantType', item)}>
                  <Text style={[styles.chipText, formData.tenantType === item && styles.chipTextActive]}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.draftBtn} onPress={handleSaveDraft}>
          <Text style={styles.draftBtnText}>Save Draft</Text>
        </TouchableOpacity>
        
        <View style={styles.bottomNavRight}>
          <TouchableOpacity style={[styles.backBtn, currentStep === 1 && { opacity: 0.5 }]} onPress={handleBack} disabled={currentStep === 1}>
            <Text style={styles.backBtnText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.nextBtn, isPublishing && { opacity: 0.7 }]} onPress={currentStep < totalSteps ? handleNext : handlePublish} disabled={isPublishing}>
            {isPublishing && currentStep === totalSteps ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.nextBtnText}>{currentStep < totalSteps ? 'Next' : 'Publish'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 16, paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', textAlign: 'center' },
  
  progressContainer: { paddingHorizontal: 20, paddingBottom: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  stepCounter: { fontSize: 12, fontWeight: '500', color: '#2596be', marginBottom: 8 },
  progressBarBg: { height: 3, backgroundColor: '#E2E8F0', width: '100%', borderRadius: 2 },
  progressBarFill: { height: '100%', backgroundColor: '#2596be', borderRadius: 2 },
  
  scrollView: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  stepContent: { backgroundColor: '#FFFFFF' },
  stepHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  stepVerticalLine: { width: 4, height: 20, backgroundColor: '#2596be', marginRight: 8, borderRadius: 2 },
  stepTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A' },
  
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: '#0F172A',
  },
  dropdownButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownText: { fontSize: 13, color: '#0F172A', flex: 1 },
  row: { flexDirection: 'row' },
  
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  imageUploadBtn: {
    width: '30%', aspectRatio: 1, borderWidth: 1, borderColor: '#2596be', borderStyle: 'dashed', borderRadius: 8,
    justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF',
  },
  imageUploadText: { fontSize: 12, fontWeight: '500', color: '#2596be', marginTop: 4 },
  imagePreviewBox: { width: '30%', aspectRatio: 1, borderRadius: 8, backgroundColor: '#F8FAFC', overflow: 'hidden' },
  imagePreview: { width: '100%', height: '100%', resizeMode: 'cover' },
  removeImageBtn: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, padding: 4 },
  
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, backgroundColor: '#F8FAFC', borderRadius: 16,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  chipActive: { backgroundColor: '#2596be', borderColor: '#2596be' },
  chipText: { fontSize: 13, fontWeight: '500', color: '#475569' },
  chipTextActive: { color: '#FFFFFF', fontWeight: '600' },
  
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF',
    borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingHorizontal: 20, paddingVertical: 12,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingBottom: Platform.OS === 'ios' ? 32 : 12,
  },
  draftBtn: { paddingVertical: 12, paddingHorizontal: 8 },
  draftBtnText: { color: '#64748B', fontWeight: '500', fontSize: 14 },
  
  bottomNavRight: { flexDirection: 'row', gap: 12 },
  backBtn: {
    paddingVertical: 12, paddingHorizontal: 24, backgroundColor: '#F8FAFC', borderRadius: 24,
  },
  backBtnText: { color: '#64748B', fontWeight: '600', fontSize: 14 },
  nextBtn: {
    paddingVertical: 12, paddingHorizontal: 32, backgroundColor: '#2596be', borderRadius: 24,
  },
  nextBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 16, textAlign: 'center' },
  modalOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalOptionText: { fontSize: 16, color: '#334155' },
  customChargeCard: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  removeChargeBtn: { padding: 4 },
  customAmenityInputRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 4 },
  addCustomAmenityBtn: { backgroundColor: '#2596be', padding: 8, borderRadius: 8, marginLeft: 8 },
  addChargeBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#F0F9FF', borderRadius: 16, borderWidth: 1, borderColor: '#BAE6FD', marginTop: 4 },
  addChargeText: { fontSize: 13, fontWeight: '600', color: '#2596be', marginLeft: 4 },
});

export default AddPropertyScreen;
