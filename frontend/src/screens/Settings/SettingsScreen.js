// Settings Screen
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { clearAuthToken } from '../../services/authStorage';

const SettingsScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Settings</Text>
      <Button
        title="Logout"
        onPress={async () => {
          await clearAuthToken();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
});

export default SettingsScreen;