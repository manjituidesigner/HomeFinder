import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const dummyBidders = [
  { id: '1', name: 'Rahul Sharma', location: 'Andheri East, Mumbai', bidAmount: 23500, avatar: null, phone: '+919876543210' },
  { id: '2', name: 'Priya Patel', location: 'Bandra West, Mumbai', bidAmount: 24000, avatar: null, phone: '+919876543211' },
  { id: '3', name: 'Amit Verma', location: 'Powai, Mumbai', bidAmount: 22800, avatar: null, phone: '+919876543212' },
];

const dummyMessagesData = {
  '1': [
    { id: 'm1', text: 'Hi, I saw your property. I am willing to offer ₹23,500.', sender: 'tenant', time: '10:00 AM' },
    { id: 'm2', text: 'Thanks for reaching out! When can you visit?', sender: 'owner', time: '10:05 AM' },
  ],
  '2': [
    { id: 'm1', text: 'Hello, I agree to ₹24,000 rent. When can I visit?', sender: 'tenant', time: '11:00 AM' },
  ],
  '3': [
    { id: 'm1', text: 'Is the price negotiable? I am looking around ₹22,800.', sender: 'tenant', time: '09:00 AM' },
  ]
};

const PropertyChatTab = () => {
  const [selectedBidder, setSelectedBidder] = useState(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState(dummyMessagesData);

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText.trim(),
        sender: 'owner',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => ({
        ...prev,
        [selectedBidder.id]: [...(prev[selectedBidder.id] || []), newMessage]
      }));
      setInputText('');
    }
  };

  if (selectedBidder) {
    const currentMessages = messages[selectedBidder.id] || [];
    return (
      <View style={styles.chatContainer}>
        {/* Chat Header */}
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedBidder(null)} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#0066ff" />
          </TouchableOpacity>
          <View style={styles.headerAvatarCircle}>
             <MaterialIcons name="person-outline" size={24} color="#727687" />
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{selectedBidder.name}</Text>
            <Text style={styles.headerBid}>Bid: ₹{selectedBidder.bidAmount.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Chat Messages */}
        <FlatList
          data={currentMessages}
          keyExtractor={(item) => item.id}
          style={styles.messageList}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View style={[styles.messageBubble, item.sender === 'owner' ? styles.messageOwner : styles.messageTenant]}>
              <Text style={[styles.messageText, item.sender === 'owner' ? {color: '#fff'} : {color: '#131b2e'}]}>{item.text}</Text>
              <Text style={[styles.messageTime, item.sender === 'owner' ? {color: 'rgba(255,255,255,0.7)'} : {color: '#727687'}]}>{item.time}</Text>
            </View>
          )}
        />

        {/* Input Area */}
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <MaterialIcons name="add" size={24} color="#a0aec0" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="#a0aec0"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <MaterialIcons name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.listHeader}>
        <Text style={styles.activeBidsText}>Active Bids (4)</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <MaterialIcons name="filter-list" size={18} color="#0066ff" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={dummyBidders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bidderCard}>
            <View style={styles.cardTopRow}>
              <View style={styles.avatarCircle}>
                <MaterialIcons name="person-outline" size={24} color="#727687" />
              </View>
              <View style={styles.bidderInfo}>
                <Text style={styles.bidderName}>{item.name}</Text>
                <Text style={styles.bidderLocation}>{item.location}</Text>
              </View>
              <View style={styles.bidInfo}>
                <Text style={styles.bidAmount}>₹{item.bidAmount.toLocaleString('en-IN')}</Text>
                <Text style={styles.bidLabel}>PROPOSED RENT</Text>
              </View>
            </View>
            
            <View style={styles.cardBottomRow}>
              <TouchableOpacity style={styles.chatButton} onPress={() => setSelectedBidder(item)}>
                <MaterialIcons name="chat" size={18} color="#fff" />
                <Text style={styles.chatButtonText}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.callOutlineButton} onPress={() => handleCall(item.phone)}>
                <MaterialIcons name="call" size={20} color="#0066ff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eff4ff', // Light blue/purple tint from design
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  activeBidsText: {
    fontSize: 14,
    color: '#424656',
    fontWeight: '500',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 14,
    color: '#0066ff',
    marginLeft: 4,
    fontWeight: '500',
  },
  bidderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e8efff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bidderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  bidderName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#131b2e',
    marginBottom: 2,
  },
  bidderLocation: {
    fontSize: 12,
    color: '#727687',
  },
  bidInfo: {
    alignItems: 'flex-end',
  },
  bidAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0066ff',
  },
  bidLabel: {
    fontSize: 10,
    color: '#a0aec0',
    fontWeight: '600',
    marginTop: 2,
  },
  cardBottomRow: {
    flexDirection: 'row',
    gap: 12,
  },
  chatButton: {
    flex: 1,
    backgroundColor: '#0066ff',
    borderRadius: 8,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0066ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  chatButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 15,
    marginLeft: 8,
  },
  callOutlineButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  
  // Chat UI Styles
  chatContainer: {
    flex: 1,
    backgroundColor: '#f8faff',
    minHeight: 500,
    borderRadius: 12,
    overflow: 'hidden',
    margin: 16,
    borderWidth: 1,
    borderColor: '#e2e7ff',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e7ff',
  },
  backButton: {
    padding: 8,
  },
  headerAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8efff',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#131b2e',
  },
  headerBid: {
    fontSize: 12,
    color: '#727687',
    marginTop: 2,
  },
  messageList: {
    flex: 1,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  messageOwner: {
    alignSelf: 'flex-end',
    backgroundColor: '#00a8ff',
    borderBottomRightRadius: 4,
  },
  messageTenant: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e7ff',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fafbfc',
    borderTopWidth: 1,
    borderTopColor: '#e2e7ff',
    alignItems: 'center',
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8efff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e7ff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: '#00a8ff',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});

export default PropertyChatTab;
