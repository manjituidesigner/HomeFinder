import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import OwnerDashboard from '../screens/Owner/OwnerDashboard';
import OwnerProfileScreen from '../screens/Owner/OwnerProfileScreen';
import PropertyListScreen from '../screens/Owner/PropertyListScreen';
import AddPropertyScreen from '../screens/Owner/AddPropertyScreen';
import PropertyDetailScreen from '../screens/Owner/PropertyDetailScreen';
import SearchScreen from '../screens/Tenant/SearchScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import ComingSoonScreen from '../screens/ComingSoonScreen';
import CustomDrawerContent from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

const commonScreenOptions = ({ navigation }) => ({
  headerShown: true,
  headerTitleAlign: 'center',
  headerLeft: ({ tintColor }) => (
    <Pressable onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 16 }}>
      <MaterialIcons name="menu" size={28} color={tintColor || '#111827'} />
    </Pressable>
  ),
});

export const OwnerDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={commonScreenOptions}
      backBehavior="history"
    >
      <Drawer.Screen name="OwnerDashboard" component={OwnerDashboard} options={{ title: 'Dashboard', drawerIcon: ({color, size}) => <MaterialIcons name="dashboard" size={size} color={color} /> }} />
      <Drawer.Screen name="OwnerProfile" component={OwnerProfileScreen} options={{ title: 'Profile', headerShown: false, drawerIcon: ({color, size}) => <MaterialIcons name="person" size={size} color={color} /> }} />
      <Drawer.Screen name="OwnerProperties" component={PropertyListScreen} options={{ title: 'Properties', drawerIcon: ({color, size}) => <MaterialIcons name="apartment" size={size} color={color} /> }} />
      <Drawer.Screen name="OwnerTenants" component={ComingSoonScreen} options={{ title: 'Tenants', drawerIcon: ({color, size}) => <MaterialIcons name="people" size={size} color={color} /> }} />
      <Drawer.Screen name="OwnerDocs" component={ComingSoonScreen} options={{ title: 'Docs', drawerIcon: ({color, size}) => <MaterialIcons name="description" size={size} color={color} /> }} />
      <Drawer.Screen name="OwnerNotifications" component={ComingSoonScreen} options={{ title: 'Notifications', drawerIcon: ({color, size}) => <MaterialIcons name="notifications" size={size} color={color} /> }} />
      <Drawer.Screen name="OwnerPayments" component={ComingSoonScreen} options={{ title: 'Payments', drawerIcon: ({color, size}) => <MaterialIcons name="payment" size={size} color={color} /> }} />
      <Drawer.Screen name="OwnerHistory" component={ComingSoonScreen} options={{ title: 'History', drawerIcon: ({color, size}) => <MaterialIcons name="history" size={size} color={color} /> }} />
      <Drawer.Screen name="OwnerAccounts" component={ComingSoonScreen} options={{ title: 'Accounts', drawerIcon: ({color, size}) => <MaterialIcons name="account-circle" size={size} color={color} /> }} />
      <Drawer.Screen 
        name="AddProperty" 
        component={AddPropertyScreen} 
        options={{ title: 'Add New Property', headerShown: false, drawerItemStyle: { display: 'none' } }} 
      />
      <Drawer.Screen 
        name="PropertyDetails" 
        component={PropertyDetailScreen} 
        options={{ headerShown: false, drawerItemStyle: { display: 'none' } }} 
      />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ drawerItemStyle: { display: 'none' } }} />
    </Drawer.Navigator>
  );
};

export const TenantDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={commonScreenOptions}
      backBehavior="history"
    >
      <Drawer.Screen name="TenantDashboard" component={SearchScreen} options={{ title: 'Search Properties', drawerIcon: ({color, size}) => <MaterialIcons name="search" size={size} color={color} /> }} />
      <Drawer.Screen name="TenantProfile" component={OwnerProfileScreen} options={{ headerShown: false, title: 'My Profile', drawerIcon: ({color, size}) => <MaterialIcons name="person" size={size} color={color} /> }} />
      <Drawer.Screen name="TenantFavorite" component={ComingSoonScreen} options={{ title: 'Favorite', drawerIcon: ({color, size}) => <MaterialIcons name="favorite" size={size} color={color} /> }} />
      <Drawer.Screen name="TenantBid" component={ComingSoonScreen} options={{ title: 'Bid', drawerIcon: ({color, size}) => <MaterialIcons name="gavel" size={size} color={color} /> }} />
      <Drawer.Screen name="TenantDocs" component={ComingSoonScreen} options={{ title: 'Docs', drawerIcon: ({color, size}) => <MaterialIcons name="description" size={size} color={color} /> }} />
      <Drawer.Screen name="TenantNotifications" component={ComingSoonScreen} options={{ title: 'Notifications', drawerIcon: ({color, size}) => <MaterialIcons name="notifications" size={size} color={color} /> }} />
      <Drawer.Screen name="TenantPayments" component={ComingSoonScreen} options={{ title: 'Payments', drawerIcon: ({color, size}) => <MaterialIcons name="payment" size={size} color={color} /> }} />
      <Drawer.Screen name="TenantHistory" component={ComingSoonScreen} options={{ title: 'History', drawerIcon: ({color, size}) => <MaterialIcons name="history" size={size} color={color} /> }} />
      <Drawer.Screen name="TenantAccounts" component={ComingSoonScreen} options={{ title: 'Accounts', drawerIcon: ({color, size}) => <MaterialIcons name="account-circle" size={size} color={color} /> }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ drawerItemStyle: { display: 'none' } }} />
    </Drawer.Navigator>
  );
};
