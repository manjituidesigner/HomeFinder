import React from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { clearAuthToken } from '../services/authStorage';

const CustomDrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        icon={({ color, size }) => <MaterialIcons name="logout" color={color} size={size} />}
        onPress={async () => {
          await clearAuthToken();
        }}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
