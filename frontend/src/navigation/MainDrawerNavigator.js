import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import OwnerDashboard from '../screens/Owner/OwnerDashboard';
import OwnerProfileScreen from '../screens/Owner/OwnerProfileScreen';
import PropertyListScreen from '../screens/Owner/PropertyListScreen';
import SearchScreen from '../screens/Tenant/SearchScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import CustomDrawerContent from './CustomDrawerContent';

const Drawer = createDrawerNavigator();

const MainDrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerTitleAlign: 'center',
        headerLeft: ({ tintColor }) => (
          <Pressable onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 16 }}>
            <MaterialIcons name="menu" size={28} color={tintColor || '#111827'} />
          </Pressable>
        ),
      })}
    >
      <Drawer.Screen name="OwnerDashboard" component={OwnerDashboard} options={{ title: 'Dashboard' }} />
      <Drawer.Screen
        name="OwnerProfile"
        component={OwnerProfileScreen}
        options={{ title: 'Owner Profile', headerShown: false }}
      />
      <Drawer.Screen name="PropertyList" component={PropertyListScreen} options={{ title: 'Properties' }} />
      <Drawer.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Drawer.Navigator>
  );
};

export default MainDrawerNavigator;
