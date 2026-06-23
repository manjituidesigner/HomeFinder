import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, Platform, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { deleteProperty, getPropertyById } from '../../services/propertyService';
import { useFocusEffect } from '@react-navigation/native';

import PropertyChatTab from './tabs/PropertyChatTab';
import PropertyHistoryTab from './tabs/PropertyHistoryTab';

const { width } = Dimensions.get('window');

// Colors from the Tailwind config
const colors = {
  background: '#faf8ff',
  surfaceLowest: '#ffffff',
  surfaceHigh: '#e2e7ff',
  onSurface: '#131b2e',
  onSurfaceVariant: '#424656',
  outline: '#727687',
  outlineVariant: '#c2c6d8',
  primary: '#0050cb',
  primaryGradientStart: '#0066FF',
  primaryGradientEnd: '#00D1FF',
  primaryContainer: '#0066ff',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
};

const PropertyDetailScreen = ({ route, navigation }) => {
  const initialProperty = route.params?.property;
  const [property, setProperty] = useState(initialProperty || null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Info');

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      if (property?.id) {
        setLoading(true);
        getPropertyById(property.id)
          .then(data => {
            if (isActive && data) {
              if (!data.name && Platform.OS === 'web') {
                console.log("FETCHED DATA IS MISSING NAME:", data);
              }
              setProperty(data);
            }
          })
          .catch(err => console.error('Failed to refetch property details:', err))
          .finally(() => {
            if (isActive) setLoading(false);
          });
      }
      return () => { isActive = false; };
    }, [property?.id])
  );

  const executeDelete = async () => {
    try {
      if (property?.id) {
        await deleteProperty(property.id);
        if (Platform.OS === 'web') {
          window.alert("Property deleted successfully");
        } else {
          Alert.alert("Success", "Property deleted successfully");
        }
        navigation.goBack();
      } else {
        if (Platform.OS === 'web') {
          window.alert("Property ID not found");
        } else {
          Alert.alert("Error", "Property ID not found");
        }
      }
    } catch (err) {
      console.error(err);
      if (Platform.OS === 'web') {
        window.alert("Failed to delete property");
      } else {
        Alert.alert("Error", "Failed to delete property");
      }
    }
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      const confirmDelete = window.confirm("Are you sure you want to delete this property? This action cannot be undone.");
      if (confirmDelete) {
        executeDelete();
      }
    } else {
      Alert.alert(
        "Delete Property",
        "Are you sure you want to delete this property? This action cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Delete", 
            style: "destructive",
            onPress: executeDelete
          }
        ]
      );
    }
  };

  if (!property) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={styles.errorText}>Property details not found.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtnFallback}>
          <Text style={{ color: '#fff' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const parseImages = (imgs) => {
    if (!imgs) return ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000'];
    if (Array.isArray(imgs)) return imgs.length > 0 ? imgs : ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000'];
    if (typeof imgs === 'string') {
      try {
        const parsed = JSON.parse(imgs);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1000'];
  };
  const images = parseImages(property.images);

  const onScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
    setActiveSlide(index);
  };

  const parseAmenities = (amenityData) => {
    if (!amenityData) return [];
    if (Array.isArray(amenityData)) return amenityData;
    if (typeof amenityData === 'string') return amenityData.split(',').map(a => a.trim());
    return [];
  };
  const amenitiesList = parseAmenities(property.amenities);

  // Icon mapping for amenities
  const getAmenityIcon = (amenity) => {
    const a = amenity.toLowerCase();
    if (a.includes('gym') || a.includes('fitness')) return 'fitness-center';
    if (a.includes('pool')) return 'pool';
    if (a.includes('park')) return 'local-parking';
    if (a.includes('power') || a.includes('backup')) return 'bolt';
    if (a.includes('secur') || a.includes('guard')) return 'security';
    if (a.includes('wifi') || a.includes('internet')) return 'wifi';
    if (a.includes('elevator') || a.includes('lift')) return 'elevator';
    return 'check-circle-outline';
  };

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {['Info', 'Chat', 'History'].map(tab => (
        <TouchableOpacity
          key={tab}
          style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          {activeTab === tab && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top App Bar */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.iconButton} 
            onPress={() => navigation.navigate('OwnerProperties')}
            activeOpacity={0.7}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Property Details</Text>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <MaterialIcons name="more-vert" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          
          {/* Tab Navigation */}
          {renderTabBar()}

          <View style={styles.contentPadding}>
            
            {activeTab === 'Info' && (
              <>
                {/* Price and Title Section */}
                <View style={[styles.card, styles.titleCard]}>
              <View style={styles.titleRow}>
                <View style={styles.titleInfo}>
                  <Text style={styles.propertyTitle}>{property.name || 'Unnamed Property'}</Text>
                  <View style={styles.locationRow}>
                    <MaterialIcons name="location-on" size={18} color={colors.outline} />
                    <Text style={styles.locationText} numberOfLines={2}>
                      {property.address || property.location || 'Location not specified'}
                    </Text>
                  </View>
                </View>
                <View style={styles.priceInfo}>
                  <Text style={styles.priceText}>₹{property.rentAmount ? Number(property.rentAmount).toLocaleString('en-IN') : '0'}</Text>
                  <Text style={styles.perMonthText}>PER MONTH</Text>
                </View>
              </View>
            </View>

            {/* Bento Details Grid */}
            <View style={styles.bentoGrid}>
              <View style={styles.bentoItem}>
                <MaterialIcons name="meeting-room" size={28} color={colors.primary} style={styles.bentoIcon} />
                <Text style={styles.bentoLabel}>Rooms</Text>
                <Text style={styles.bentoValue}>{property.rooms ? `${property.rooms} Rooms` : 'N/A'}</Text>
              </View>
              <View style={styles.bentoItem}>
                <MaterialIcons name="format-shapes" size={28} color={colors.primary} style={styles.bentoIcon} />
                <Text style={styles.bentoLabel}>Configuration</Text>
                <Text style={styles.bentoValue}>{property.config || 'N/A'}</Text>
              </View>
              <View style={styles.bentoItem}>
                <MaterialIcons name="apartment" size={28} color={colors.primary} style={styles.bentoIcon} />
                <Text style={styles.bentoLabel}>Property Type</Text>
                <Text style={styles.bentoValue} numberOfLines={1} adjustsFontSizeToFit>{property.type || property.propertyType || 'N/A'}</Text>
              </View>
              <View style={styles.bentoItem}>
                <MaterialIcons name="square-foot" size={28} color={colors.primary} style={styles.bentoIcon} />
                <Text style={styles.bentoLabel}>Area</Text>
                <Text style={styles.bentoValue}>{property.carpetArea ? `${property.carpetArea} sqft` : 'N/A'}</Text>
              </View>
              <View style={styles.bentoItem}>
                <MaterialIcons name="weekend" size={28} color={colors.primary} style={styles.bentoIcon} />
                <Text style={styles.bentoLabel}>Furnishing</Text>
                <Text style={styles.bentoValue}>{property.furnishing || property.furnishingStatus || 'Semi'}</Text>
              </View>
              <View style={styles.bentoItem}>
                <MaterialIcons name="layers" size={28} color={colors.primary} style={styles.bentoIcon} />
                <Text style={styles.bentoLabel}>Floor</Text>
                <Text style={styles.bentoValue}>{property.floor || 'N/A'}</Text>
              </View>
              <View style={styles.bentoItem}>
                <MaterialIcons name="local-offer" size={28} color={colors.primary} style={styles.bentoIcon} />
                <Text style={styles.bentoLabel}>Listing Type</Text>
                <Text style={styles.bentoValue}>{property.listingType || 'For Rent'}</Text>
              </View>
            </View>

            {/* Pricing Details */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Pricing Details</Text>
              
              <View style={styles.preferenceRow}>
                <MaterialIcons name="security" size={24} color={colors.primaryContainer} style={styles.prefIcon} />
                <View style={styles.prefContent}>
                  <Text style={styles.prefLabel}>Security Deposit</Text>
                  <Text style={styles.prefValue}>{property.securityDeposit ? `₹${Number(property.securityDeposit).toLocaleString('en-IN')}` : 'Not specified'}</Text>
                </View>
              </View>

              <View style={[styles.preferenceRow, { marginTop: 16 }]}>
                <MaterialIcons name="build" size={24} color={colors.primaryContainer} style={styles.prefIcon} />
                <View style={styles.prefContent}>
                  <Text style={styles.prefLabel}>Maintenance Charges</Text>
                  <Text style={styles.prefValue}>{property.maintenanceCharges ? `₹${property.maintenanceCharges}` : 'Not specified'}</Text>
                </View>
              </View>

              {(() => {
                const parseCustomCharges = (charges) => {
                  if (!charges) return [];
                  if (Array.isArray(charges)) return charges;
                  if (typeof charges === 'string') {
                    try { return JSON.parse(charges); } catch(e) { return []; }
                  }
                  return [];
                };
                const chargesList = parseCustomCharges(property.customCharges);

                if (chargesList.length === 0) return null;

                return (
                  <View style={[styles.preferenceRow, { marginTop: 16 }]}>
                    <MaterialIcons name="receipt" size={24} color={colors.primaryContainer} style={styles.prefIcon} />
                    <View style={styles.prefContent}>
                      <Text style={styles.prefLabel}>Other Charges</Text>
                      {chargesList.map((charge, idx) => (
                        <Text key={idx} style={styles.prefValue}>
                          • {charge.name}: ₹{charge.amount} ({charge.type})
                        </Text>
                      ))}
                    </View>
                  </View>
                );
              })()}

              {/* Total Monthly Payable */}
              {(() => {
                let totalMonthly = Number(property.rentAmount || 0);
                
                if (property.maintenanceCharges) {
                  const maintStr = property.maintenanceCharges.toString().replace(/,/g, '');
                  const maintMatch = maintStr.match(/\d+/);
                  if (maintMatch) {
                    totalMonthly += parseInt(maintMatch[0], 10);
                  }
                }
                
                const parseCustomCharges = (charges) => {
                  if (!charges) return [];
                  if (Array.isArray(charges)) return charges;
                  if (typeof charges === 'string') {
                    try { return JSON.parse(charges); } catch(e) { return []; }
                  }
                  return [];
                };
                const chargesList = parseCustomCharges(property.customCharges);

                if (chargesList.length > 0) {
                  chargesList.forEach(charge => {
                    if (charge.type === 'Monthly' && charge.amount) {
                      totalMonthly += Number(charge.amount || 0);
                    }
                  });
                }

                return (
                  <View style={[styles.preferenceRow, { marginTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(194, 198, 216, 0.3)', paddingTop: 16 }]}>
                    <MaterialIcons name="account-balance-wallet" size={24} color={colors.primary} style={styles.prefIcon} />
                    <View style={styles.prefContent}>
                      <Text style={[styles.prefLabel, { color: colors.primary, fontSize: 16 }]}>Total Monthly Payable</Text>
                      <Text style={[styles.prefValue, { color: colors.primary, fontSize: 18, fontWeight: '700' }]}>
                        ₹{totalMonthly.toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>
                );
              })()}
            </View>

            {/* Description */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>About this Property</Text>
              <Text style={styles.descriptionText}>
                {property.description || 'No description provided for this property.'}
              </Text>
            </View>

            {/* Amenities */}
            {amenitiesList.length > 0 && (
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Amenities</Text>
                <View style={styles.amenitiesGrid}>
                  {amenitiesList.map((amenity, idx) => (
                    <View key={idx} style={styles.amenityItem}>
                      <View style={styles.amenityIconCircle}>
                        <MaterialIcons name={getAmenityIcon(amenity)} size={24} color={colors.onSurface} />
                      </View>
                      <Text style={styles.amenityText}>{amenity}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Tenant Preferences */}
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Tenant Preferences</Text>
              <View style={styles.preferenceRow}>
                <MaterialIcons name="groups" size={24} color={colors.primaryContainer} style={styles.prefIcon} />
                <View style={styles.prefContent}>
                  <Text style={styles.prefLabel}>Preferred Tenant</Text>
                  <Text style={styles.prefValue}>{property.tenantType || property.preferredTenant || 'Any'}</Text>
                </View>
              </View>

              <View style={[styles.preferenceRow, { marginTop: 16 }]}>
                <MaterialIcons name="local-parking" size={24} color={colors.primaryContainer} style={styles.prefIcon} />
                <View style={styles.prefContent}>
                  <Text style={styles.prefLabel}>Parking</Text>
                  <Text style={styles.prefValue}>
                    {property.parking || 'No Parking'}
                    {property.parking !== 'No Parking' && property.parkingCount ? ` (${property.parkingCount} spaces)` : ''}
                    {property.parkingLocation ? ` - ${property.parkingLocation}` : ''}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.preferenceRow, { marginTop: 16 }]}>
                <MaterialIcons name="smoke-free" size={24} color={colors.error} style={styles.prefIcon} />
                <View style={styles.prefContent}>
                  <Text style={styles.prefLabel}>House Rules</Text>
                  <Text style={styles.prefValue}>
                    • Smoking: {property.smoking || 'Not specified'}
                    {'\n'}• Drinking: {property.drinks || 'Not specified'}
                    {'\n'}• Late Night Entry: {property.lateNight || 'Not specified'}
                    {'\n'}• Visitors: {property.visitors || 'Not specified'}
                    {property.noticeTime ? `\n• Notice Period: ${property.noticeTime}` : ''}
                  </Text>
                </View>
              </View>
            </View>

              </>
            )}

            {activeTab === 'Chat' && <PropertyChatTab />}
            {activeTab === 'History' && <PropertyHistoryTab />}

          </View>
        </ScrollView>

        {/* Sticky Bottom Actions - Only visible on Info tab */}
        {activeTab === 'Info' && (
          <View style={styles.bottomActions}>
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={styles.editButtonWrapper}
              onPress={() => navigation.navigate('AddProperty', { editProperty: property })}
            >
              <LinearGradient
                colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.editButton}
              >
                <MaterialIcons name="edit" size={22} color="#FFF" />
                <Text style={styles.editButtonText}>Edit Property</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={styles.deleteButton} onPress={handleDelete}>
              <MaterialIcons name="delete" size={24} color={colors.error} />
            </TouchableOpacity>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAF8FF',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    marginBottom: 16,
  },
  backBtnFallback: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 64,
    backgroundColor: 'rgba(250, 248, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.onSurface,
  },
  scrollContainer: {
    flex: 1,
  },
  sliderContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: Platform.OS === 'web' ? 21/9 : 4/3,
  },
  slider: {
    width: '100%',
    height: '100%',
  },
  slide: {
    width: width,
    height: '100%',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  slideCountBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(19, 27, 46, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  slideCountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  paginationDots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#FFF',
  },
  contentPadding: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
    gap: 24,
  },
  card: {
    backgroundColor: colors.surfaceLowest,
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
    shadowColor: colors.primaryContainer,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
    elevation: 3,
  },
  titleCard: {
    marginBottom: 0, // grid relies on gap
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    gap: 12,
  },
  titleInfo: {
    flex: 1,
    minWidth: '60%',
  },
  propertyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 16,
    color: colors.outline,
    flexShrink: 1,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  perMonthText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.outline,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  bentoItem: {
    width: '48%',
    backgroundColor: colors.surfaceLowest,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryContainer,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
    elevation: 2,
  },
  bentoIcon: {
    marginBottom: 8,
  },
  bentoLabel: {
    fontSize: 11,
    color: colors.outline,
    marginBottom: 2,
    fontWeight: '500',
  },
  bentoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.onSurface,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: colors.onSurfaceVariant,
    lineHeight: 24,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLowest,
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    position: 'relative',
  },
  tabItemActive: {
    backgroundColor: colors.surfaceHigh,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.outline,
  },
  tabTextActive: {
    color: colors.primary,
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: -4,
    left: '20%',
    right: '20%',
    height: 3,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    display: 'none', // Alternatively, you can use this for a different style indicator
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  amenityItem: {
    width: '33.33%',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  amenityIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 12,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  prefIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  prefContent: {
    flex: 1,
  },
  prefLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  prefValue: {
    fontSize: 16,
    color: colors.onSurfaceVariant,
    lineHeight: 24,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(194, 198, 216, 0.3)',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    gap: 16,
  },
  editButtonWrapper: {
    flex: 1,
  },
  editButton: {
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryContainer,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  deleteButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(186, 26, 26, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
});

export default PropertyDetailScreen;
