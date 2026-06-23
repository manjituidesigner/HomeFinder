import React, { useState, useEffect } from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { clearAuthToken, getAuthSession, subscribeAuthToken } from '../services/authStorage';

const CustomDrawerContent = (props) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getAuthSession().then(session => {
      if (isMounted) setUser(session.user);
    });
    const unsubscribe = subscribeAuthToken((t, u) => {
      if (isMounted) setUser(u);
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const role = user?.role || 'Tenant';
  const name = user?.name || 'User';

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>{name}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{role.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Drawer Items */}
        <View style={styles.drawerItemsContainer}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      {/* Footer / Actions */}
      <View style={styles.footer}>
        <View style={styles.divider} />
        <TouchableOpacity 
          style={styles.footerButton} 
          activeOpacity={0.7}
          onPress={async () => { await clearAuthToken(); }}
        >
          <View style={styles.footerIconContainer}>
            <MaterialIcons name="logout" size={22} color="#4B5563" />
          </View>
          <Text style={styles.footerButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  drawerItemsContainer: {
    paddingHorizontal: 8,
  },
  footer: {
    paddingBottom: 24,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  footerIconContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  footerButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
  },
});

export default CustomDrawerContent;
