import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Image, ScrollView, Modal, TextInput, ActivityIndicator, RefreshControl, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getProperties, updateProperty } from '../../services/propertyService';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const StatusDropdown = ({ property, onStatusChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [customDate, setCustomDate] = useState('');
  
  const currentStatus = property.status || 'Open';

  const getStatusColor = () => {
    if (currentStatus === 'Open') return { bg: '#DCFCE7', text: '#166534' }; // Green
    if (currentStatus === 'Booked') return { bg: '#FEE2E2', text: '#991B1B' }; // Red
    return { bg: '#DBEAFE', text: '#1E40AF' }; // Blue for custom date
  };

  const colors = getStatusColor();

  const handleSelect = (option) => {
    if (option === 'Custom Date') {
      setShowCustomDate(true);
    } else {
      setModalVisible(false);
      setShowCustomDate(false);
      onStatusChange(property.id, option);
    }
  };

  const handleCustomSubmit = () => {
    if (customDate.trim()) {
      setModalVisible(false);
      setShowCustomDate(false);
      onStatusChange(property.id, customDate.trim());
    }
  };

  return (
    <>
      <TouchableOpacity 
        style={[styles.statusPill, { backgroundColor: colors.bg }]} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.statusText, { color: colors.text }]}>{currentStatus}</Text>
        <MaterialIcons name="keyboard-arrow-down" size={14} color={colors.text} style={{ marginLeft: 2 }} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => { setModalVisible(false); setShowCustomDate(false); }}>
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            {!showCustomDate ? (
              <>
                <Text style={styles.modalTitle}>Update Property Status</Text>
                {['Open', 'Booked', 'Custom Date'].map((opt) => (
                  <TouchableOpacity key={opt} style={styles.modalOption} onPress={() => handleSelect(opt)}>
                    <Text style={styles.modalOptionText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <>
                <Text style={styles.modalTitle}>Enter Availability Date</Text>
                <TextInput 
                  style={styles.dateInput}
                  placeholder="e.g. 10th Oct 2024"
                  placeholderTextColor="#9ca3af"
                  value={customDate}
                  onChangeText={setCustomDate}
                  autoFocus
                />
                <TouchableOpacity style={styles.saveDateBtn} onPress={handleCustomSubmit}>
                  <Text style={styles.saveDateBtnText}>Save Status</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const PropertyCard = ({ item, navigation, onStatusChange }) => {
  const images = item.images && item.images.length > 0 ? item.images : ['https://via.placeholder.com/400x200?text=No+Image'];
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.name || 'Unnamed Property'}</Text>
        <Text style={styles.cardSubtitle}>{item.config || 'N/A'}</Text>
      </View>

      <View style={styles.imageContainer}>
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
          {images.map((img, idx) => (
            <Image key={idx} source={{ uri: img }} style={styles.cardImage} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.footerTopRow}>
          <View>
            <Text style={styles.priceText}>₹ {item.rentAmount || '0'}</Text>
            <StatusDropdown property={item} onStatusChange={onStatusChange} />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('PropertyDetails', { property: item })}>
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerBottomRow}>
          <Text style={styles.updatedText}>Last updated: {formatDate(item.updatedAt)}</Text>
        </View>
      </View>
    </View>
  );
};

const PropertyListScreen = ({ navigation }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProperties = async () => {
    try {
      const data = await getProperties();
      // Sort by updatedAt descending
      const sorted = (data || []).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setProperties(sorted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProperties();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchProperties();
  };

  const handleStatusChange = async (id, newStatus) => {
    setProperties(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    try {
      await updateProperty(id, { status: newStatus });
    } catch (err) {
      console.error('Failed to update status', err);
      fetchProperties(); 
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0095f6" />
        </View>
      ) : (
        <FlatList
          data={properties}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No properties found. Add one!</Text>
            </View>
          }
          renderItem={({ item }) => (
            <PropertyCard item={item} navigation={navigation} onStatusChange={handleStatusChange} />
          )}
        />
      )}

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('AddProperty')}>
        <MaterialIcons name="add" size={28} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 100 },
  
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0095f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  
  card: {
    backgroundColor: '#ffffff', borderRadius: 12, marginBottom: 24,
    borderWidth: 1, borderColor: '#e5e7eb', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2
  },
  cardHeader: { padding: 16 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#1c1c1e' },
  cardSubtitle: { fontSize: 14, color: '#6b7280', marginTop: 2 },
  
  imageContainer: { position: 'relative', height: 200, width: '100%' },
  imageScroll: { width: '100%', height: '100%' },
  cardImage: { width: width - 48, height: 200, resizeMode: 'cover' }, // width - 48 accounts for container padding

  cardFooter: { padding: 16 },
  footerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  priceText: { fontSize: 18, fontWeight: '700', color: '#0095f6' },
  
  statusPill: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: 6, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, alignSelf: 'flex-start'
  },
  statusText: { fontSize: 12, fontWeight: '500' },
  
  viewDetailsText: { fontSize: 14, fontWeight: '500', color: '#0095f6', alignSelf: 'center', marginTop: 4 },
  
  footerBottomRow: { borderTopWidth: 1, borderTopColor: '#e5e7eb', marginTop: 16, paddingTop: 12 },
  updatedText: { fontSize: 12, color: '#6b7280' },

  emptyContainer: { alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#6b7280', fontSize: 16 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#FFF', borderRadius: 12, padding: 20, shadowColor: '#000', elevation: 5 },
  modalTitle: { fontSize: 16, fontWeight: '600', color: '#1c1c1e', marginBottom: 16, textAlign: 'center' },
  modalOption: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f3f4f6' },
  modalOptionText: { fontSize: 15, color: '#374151', textAlign: 'center' },
  
  dateInput: {
    borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12,
    fontSize: 15, color: '#1c1c1e', backgroundColor: '#f8f9fa', marginBottom: 16
  },
  saveDateBtn: { backgroundColor: '#0095f6', paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  saveDateBtnText: { color: '#FFF', fontWeight: '600', fontSize: 14 }
});

export default PropertyListScreen;