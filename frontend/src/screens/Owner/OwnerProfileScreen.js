import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const OwnerProfileScreen = ({ navigation }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [aadharNumber, setAadharNumber] = useState('');
  const [aadharImage, setAadharImage] = useState(null);

  const pickImage = async (setImage) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera roll permissions are required to select an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
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

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    navigation.navigate('OwnerCurrentAddress');
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.shell}>
          <View style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity style={styles.iconButton} onPress={handleBack} activeOpacity={0.8}>
                <MaterialIcons name="arrow-back-ios" size={18} color="#18181B" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Identity</Text>
              <View style={styles.iconSpacer} />
            </View>

            <View style={styles.progressArea}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabel}>Step 1 of 10</Text>
                <Text style={styles.progressLabel}>10% Complete</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.photoWrap}>
              <View style={styles.avatarRing}>
                <Image
                  source={{
                    uri: profileImage
                      ? profileImage
                      : 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMQsrxjAHgXYrV5xnWUKhcqHSsYf88DdzwyyqtX1G62WGc_5Yr0h6xV7WtPOT0IUazobW1hrO-9PBvxj4k7-vg0BJKSiAqOtPvUGlFkKk5qtiq23poamOarYi1epJqGdRr3pmFf_jKNfA_2nUbqaCsKQVNa5tJ1Xu_C1rzXdQUNXmOVjMYJacKy4FiG1_k7fwq12bI1aJTFNWjXxQTWlPYFH29-NfzHlfOcWCEyCYT6u8QrovGogpUT75RqFxPifkSePhYkzxIWvAv',
                  }}
                  style={styles.avatar}
                />
              </View>
              <TouchableOpacity style={styles.avatarEdit} onPress={() => pickImage(setProfileImage)}>
                <MaterialIcons name="edit" size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionTitle}>Profile Photo</Text>
            <Text style={styles.sectionSubtitle}>Add a professional photo for your owner profile</Text>
            <View style={styles.photoActions}>
              <TouchableOpacity style={styles.secondaryButton} onPress={takeSelfie} activeOpacity={0.85}>
                <MaterialIcons name="photo-camera" size={18} color="#8B5CF6" />
                <Text style={styles.secondaryButtonText}>Selfie</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => pickImage(setProfileImage)}
                activeOpacity={0.85}
              >
                <MaterialIcons name="file-upload" size={18} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="person" size={20} color="#8B5CF6" />
              <Text style={styles.sectionHeaderText}>Personal Details</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.inputMuted]}
                  value="Alexander Graham"
                  editable={false}
                />
                <MaterialIcons name="lock" size={16} color="#A1A1AA" style={styles.inputIcon} />
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.inputMuted]}
                  value="alexander.g@example.com"
                  editable={false}
                />
                <MaterialIcons name="lock" size={16} color="#A1A1AA" style={styles.inputIcon} />
              </View>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, styles.inputMuted]}
                  value="+1 234 567 890"
                  editable={false}
                />
                <MaterialIcons name="lock" size={16} color="#A1A1AA" style={styles.inputIcon} />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="verified-user" size={20} color="#8B5CF6" />
              <Text style={styles.sectionHeaderText}>Identity Verification</Text>
            </View>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Aadhaar Number</Text>
              <TextInput
                style={styles.input}
                placeholder="XXXX - XXXX - XXXX"
                placeholderTextColor="#A1A1AA"
                value={aadharNumber}
                onChangeText={setAadharNumber}
              />
            </View>

            <TouchableOpacity
              style={styles.uploadCard}
              onPress={() => pickImage(setAadharImage)}
              activeOpacity={0.85}
            >
              <View style={styles.uploadIcon}>
                <MaterialIcons name="add-a-photo" size={26} color="#8B5CF6" />
              </View>
              <Text style={styles.uploadTitle}>Upload Aadhaar Card</Text>
              <Text style={styles.uploadSubtitle}>Front & Back images (Max 5MB)</Text>
              {aadharImage ? <Text style={styles.uploadStatus}>1 file added</Text> : null}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footerWrap}>
        <View style={styles.footerShell}>
          <TouchableOpacity style={styles.footerButton} onPress={handleNext} activeOpacity={0.9}>
            <Text style={styles.footerButtonText}>Next Step</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
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
    paddingBottom: 24,
  },
  header: {
    paddingTop: 24,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
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
  progressArea: {
    gap: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: '#71717A',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E4E4E7',
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: {
    width: '10%',
    height: '100%',
    borderRadius: 99,
    backgroundColor: '#8B5CF6',
  },
  section: {
    gap: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#18181B',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#18181B',
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#71717A',
    textAlign: 'center',
  },
  photoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarRing: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: '#E4E4E7',
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarEdit: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  primaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  secondaryButton: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButtonText: {
    color: '#8B5CF6',
    fontSize: 13,
    fontWeight: '700',
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
  inputWrapper: {
    position: 'relative',
  },
  input: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E4E7',
    fontSize: 15,
    color: '#18181B',
  },
  inputMuted: {
    backgroundColor: 'rgba(244, 244, 245, 0.6)',
    color: '#71717A',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  uploadCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#D4D4D8',
    backgroundColor: '#F8FAFC',
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#18181B',
  },
  uploadSubtitle: {
    fontSize: 12,
    color: '#71717A',
  },
  uploadStatus: {
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '600',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
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

export default OwnerProfileScreen;