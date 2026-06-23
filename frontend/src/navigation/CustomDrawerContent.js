import React, { useState } from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { clearAuthToken } from '../services/authStorage';
import { deleteAccountInitiate, deleteAccountVerify } from '../services/authService';

const CustomDrawerContent = (props) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteOtp, setDeleteOtp] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInitiateDelete = async () => {
    setIsSendingOtp(true);
    setMessage({ type: '', text: '' });
    try {
      await deleteAccountInitiate();
      setShowDeleteModal(true);
    } catch (error) {
      // Inline error message is not possible here without a modal. So we just open modal with error.
      setShowDeleteModal(true);
      setMessage({ type: 'error', text: error?.response?.data?.error || error?.message || 'Failed to initiate deletion' });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyDelete = async () => {
    if (!deleteOtp || deleteOtp.length < 4) {
      setMessage({ type: 'error', text: 'Please enter a valid OTP' });
      return;
    }
    setIsDeleting(true);
    setMessage({ type: '', text: '' });
    try {
      await deleteAccountVerify({ otp: deleteOtp });
      setMessage({ type: 'success', text: 'Your account has been deleted successfully.' });
      setTimeout(async () => {
        setShowDeleteModal(false);
        await clearAuthToken();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: error?.response?.data?.error || error?.message || 'Verification failed' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Add Property"
          icon={({ size }) => <MaterialIcons name="add-circle" color="#2596be" size={size} />}
          labelStyle={{ color: '#2596be', fontWeight: 'bold' }}
          onPress={() => props.navigation.navigate('AddProperty')}
        />
        <DrawerItem
          label="Logout"
          icon={({ color, size }) => <MaterialIcons name="logout" color={color} size={size} />}
          onPress={async () => {
            await clearAuthToken();
          }}
        />
        <DrawerItem
          label={isSendingOtp ? "Sending OTP..." : "Remove Account"}
          labelStyle={{ color: '#DC2626', fontWeight: 'bold' }}
          icon={({ size }) => (
            isSendingOtp ? <ActivityIndicator size="small" color="#DC2626" /> : <MaterialIcons name="delete-forever" color="#DC2626" size={size} />
          )}
          onPress={handleInitiateDelete}
        />
      </DrawerContentScrollView>

      <Modal visible={showDeleteModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialIcons name="warning" size={28} color="#DC2626" />
              <Text style={styles.modalTitle}>Remove Account?</Text>
            </View>
            <Text style={styles.modalBody}>
              An OTP has been sent to your registered phone number. Enter it below to permanently delete your account.
            </Text>
            <TextInput
              style={styles.otpInput}
              placeholder="Enter OTP"
              value={deleteOtp}
              onChangeText={setDeleteOtp}
              keyboardType="numeric"
              maxLength={6}
            />

            {message.text ? (
              <View style={[styles.messageBox, message.type === 'error' ? styles.errorBox : styles.successBox]}>
                <MaterialIcons 
                  name={message.type === 'error' ? "error-outline" : "check-circle-outline"} 
                  size={20} 
                  color={message.type === 'error' ? "#DC2626" : "#059669"} 
                />
                <Text style={[styles.messageText, message.type === 'error' ? styles.errorText : styles.successText]}>
                  {message.text}
                </Text>
              </View>
            ) : null}

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowDeleteModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmDeleteButton} 
                onPress={handleVerifyDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.confirmDeleteText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 16 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#18181B', marginLeft: 8, flex: 1 },
  modalBody: { fontSize: 14, color: '#52525B', lineHeight: 20, marginBottom: 20 },
  otpInput: { borderWidth: 1, borderColor: '#D4D4D8', borderRadius: 8, padding: 12, fontSize: 18, textAlign: 'center', marginBottom: 24, letterSpacing: 4, fontWeight: '700' },
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelButton: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center', backgroundColor: '#F4F4F5' },
  cancelButtonText: { color: '#52525B', fontWeight: '700', fontSize: 16 },
  confirmDeleteButton: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center', backgroundColor: '#DC2626' },
  confirmDeleteText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  messageBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1 },
  errorBox: { backgroundColor: '#FEE2E2', borderColor: '#F87171' },
  successBox: { backgroundColor: '#D1FAE5', borderColor: '#34D399' },
  messageText: { marginLeft: 8, fontSize: 14, fontWeight: '500', flexShrink: 1 },
  errorText: { color: '#DC2626' },
  successText: { color: '#059669' },
});

export default CustomDrawerContent;
