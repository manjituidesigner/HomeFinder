import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const dummyHistory = [
  { id: '1', date: 'Today, 03:45 PM', title: 'New Bid received from Priya Patel', icon: 'person', isNew: true },
  { id: '2', date: 'Yesterday, 11:20 AM', title: 'Verified by Admin', icon: 'verified-user', isNew: false },
  { id: '3', date: 'Oct 24, 2026', title: 'Price Updated from ₹24,000 to ₹25,000', icon: 'payments', isNew: false },
  { id: '4', date: 'Oct 20, 2026', title: 'Listing Created', icon: 'post-add', isNew: false },
];

const PropertyHistoryTab = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Property Activity History</Text>
        <View style={styles.timelineContainer}>
          {dummyHistory.map((item, index) => (
            <View key={item.id} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                {item.isNew ? (
                  <View style={styles.iconCircleSolid}>
                    <MaterialIcons name={item.icon} size={16} color="#fff" />
                  </View>
                ) : (
                  <View style={styles.iconCircleOutline}>
                    <MaterialIcons name={item.icon} size={16} color="#0066ff" />
                  </View>
                )}
                {index !== dummyHistory.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineRight}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#eff4ff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#131b2e',
    marginBottom: 24,
  },
  timelineContainer: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 32,
    position: 'relative',
  },
  timelineLeft: {
    alignItems: 'center',
    width: 32,
  },
  iconCircleSolid: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0066ff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  iconCircleOutline: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e8efff',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: '#c2c6d8',
    position: 'absolute',
    top: 32,
    bottom: -32,
    zIndex: 1,
  },
  timelineRight: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#131b2e',
    lineHeight: 20,
  },
  dateText: {
    fontSize: 12,
    color: '#727687',
    marginTop: 4,
  },
});

export default PropertyHistoryTab;
