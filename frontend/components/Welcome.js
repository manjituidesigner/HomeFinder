import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Welcome({ onContinue }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>Rently</Text>
      <Text style={styles.title}>Find your next home</Text>
      <Text style={styles.subtitle}>Browse curated listings with a modern iOS-style interface.</Text>
      <TouchableOpacity style={styles.button} onPress={onContinue} activeOpacity={0.85}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f2f5f7'
  },
  logo: { fontSize: 40, fontWeight: '800', color: '#111827', marginBottom: 12 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#6b7280', textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#007aff', paddingVertical: 14, paddingHorizontal: 36, borderRadius: 12 },
  buttonText: { color: '#fff', fontWeight: '700' }
});
