import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';

const SearchScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    // Hide the floating search and show top bar search when scrolled past the hero image (approx 180px)
    if (scrollY > 180 && !isScrolled) {
      setIsScrolled(true);
    } else if (scrollY <= 180 && isScrolled) {
      setIsScrolled(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Bar */}
      <View style={[styles.topBar, isScrolled && styles.topBarScrolled]}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.toggleDrawer()}>
          <Feather name="menu" size={24} color="#333" />
        </TouchableOpacity>
        
        {isScrolled ? (
          <View style={styles.topSearchBar}>
            <Feather name="search" size={18} color="#666" style={styles.searchIconSmall} />
            <TextInput
              style={styles.searchInputSmall}
              placeholder='Search "Chandigarh"'
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#888"
            />
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}

        <TouchableOpacity style={styles.iconBtn}>
          <Feather name="bell" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1000' }} 
            style={styles.heroImage} 
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroSubTitle}>50% OPEN SPACE - PARKS, PREMIUM AMENITIES</Text>
          </View>
        </View>

        {/* Floating Search Bar */}
        <View style={[styles.searchContainer, isScrolled && { opacity: 0 }]}>
          <View style={styles.searchBox}>
            <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder='Search "Chandigarh"'
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#888"
            />
          </View>
        </View>

        {/* Get started with section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Get started with</Text>
          <Text style={styles.sectionSubtitle}>Explore real estate options in top cities</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.iconCircle, { backgroundColor: '#eef2ff' }]}>
                <Ionicons name="home-outline" size={28} color="#0050cb" />
                <View style={styles.miniBadge}><Feather name="search" size={12} color="#fff" /></View>
              </View>
              <Text style={styles.actionText}>Buy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.iconCircle, { backgroundColor: '#eef2ff' }]}>
                <Ionicons name="home-outline" size={28} color="#0050cb" />
                <View style={styles.miniBadge}><MaterialIcons name="vpn-key" size={12} color="#fff" /></View>
              </View>
              <Text style={styles.actionText}>Rent</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.iconCircle, { backgroundColor: '#eef2ff' }]}>
                <Ionicons name="bulb-outline" size={28} color="#0050cb" />
              </View>
              <Text style={styles.actionText}>Insights</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.iconCircle, { backgroundColor: '#eef2ff' }]}>
                <MaterialIcons name="map" size={28} color="#0050cb" />
              </View>
              <Text style={styles.actionText}>Plot / Land</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Popular tools section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Use popular tools</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sectionSubtitle}>Go from browsing to buying</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.toolsScroll}>
            <TouchableOpacity style={styles.toolCard}>
              <View style={[styles.toolIconBox, { backgroundColor: '#e8f4fd' }]}>
                <Ionicons name="bulb" size={24} color="#0066ff" />
              </View>
              <View>
                <Text style={styles.toolTitle}>Smart Search</Text>
                <Text style={styles.toolDesc}>Find your dream home</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolCard}>
              <View style={[styles.toolIconBox, { backgroundColor: '#fdf4e8' }]}>
                <MaterialIcons name="calculate" size={24} color="#ff9800" />
              </View>
              <View>
                <Text style={styles.toolTitle}>EMI Calculator</Text>
                <Text style={styles.toolDesc}>Know your budget</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Buying a home section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Buying a home</Text>
          <Text style={styles.sectionSubtitle}>Apartments, land, builder floors, villas and more</Text>
          <View style={styles.largeCard}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000' }} style={styles.largeCardImage} />
            <TouchableOpacity style={styles.exploreBtnRow}>
              <Text style={styles.exploreBtnText}>Explore all home buying options</Text>
              <MaterialIcons name="arrow-right-alt" size={24} color="#001b44" />
            </TouchableOpacity>
            <Text style={styles.largeCardSubtext}>Over 7,67,000 properties and 1,93,000 projects</Text>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Articles Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.articleHeaderRow}>
            <MaterialIcons name="article" size={32} color="#333" style={styles.articleHeaderIcon} />
            <View>
              <Text style={styles.sectionTitle}>Top articles on home buying</Text>
              <Text style={styles.sectionSubtitle}>Know more about latest realty trends</Text>
            </View>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
            <View style={styles.activeTab}><Text style={styles.activeTabText}>News</Text></View>
            <View style={styles.inactiveTab}><Text style={styles.inactiveTabText}>Tax & Legal</Text></View>
            <View style={styles.inactiveTab}><Text style={styles.inactiveTabText}>Help Guides</Text></View>
            <View style={styles.inactiveTab}><Text style={styles.inactiveTabText}>Invest</Text></View>
          </ScrollView>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll}>
            <View style={styles.articleCard}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600' }} style={styles.articleImage} />
              <View style={styles.articleContent}>
                <Text style={styles.articleTitle} numberOfLines={2}>Land acquisitions to begin for New Noida</Text>
                <Text style={styles.articleDate}>May 22, 2026</Text>
              </View>
            </View>
            <View style={styles.articleCard}>
              <Image source={{ uri: 'https://images.unsplash.com/photo-1542314831-c6a4d14d8835?auto=format&fit=crop&q=80&w=600' }} style={styles.articleImage} />
              <View style={styles.articleContent}>
                <Text style={styles.articleTitle} numberOfLines={2}>Tips for buying a plot in India</Text>
                <Text style={styles.articleDate}>Feb 16, 2022</Text>
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.blueButton}>
            <Text style={styles.blueButtonText}>Read realty news, guides & articles</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.coloredBackgroundSection}>
          {/* Newly launched projects */}
          <View style={styles.sectionContainer}>
            <View style={styles.articleHeaderRow}>
              <View style={styles.sparkleIconBox}>
                <MaterialIcons name="auto-awesome" size={20} color="#000" />
              </View>
              <View>
                <Text style={styles.sectionTitle}>Newly launched projects</Text>
                <Text style={styles.sectionSubtitle}>Best prices • Unit of choice • Easy payment pl...</Text>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll}>
              <View style={styles.projectCard}>
                <View style={styles.newArrivalTag}>
                  <Text style={styles.newArrivalText}>✦ New arrival ✦</Text>
                </View>
                <View style={styles.projectCardBody}>
                  <View style={styles.projectCardLeft}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=300' }} style={styles.projectCircleImage} />
                    <View style={styles.reraBadge}><MaterialIcons name="check-circle" size={10} color="#fff" /><Text style={styles.reraText}>RERA</Text></View>
                  </View>
                  <View style={styles.projectCardRight}>
                    <Text style={styles.projectTitle}>Leverage Green Heights</Text>
                    <Text style={styles.projectLocation}>Wardha Road, Nagpur</Text>
                    <Text style={styles.projectPrice}>₹42 - 58.9 L <Text style={styles.projectConfig}>2, 3 BHK Apartm...</Text></Text>
                    <Text style={styles.projectGrowth}>▲ 8.7% (3mo) in Wardha Road, ...</Text>
                  </View>
                </View>
                <View style={styles.projectCardFooter}>
                  <Text style={styles.zeroBrokerageText}>Get preferred options{'\n'}@zero brokerage</Text>
                  <TouchableOpacity style={styles.viewNumberBtn}>
                    <Text style={styles.viewNumberText}>View number</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>

          {/* Handpicked Residential Projects */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Handpicked Residential Projects</Text>
            <Text style={styles.sectionSubtitle}>Featured Residential Projects across India</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsScroll}>
              <View style={styles.featuredCard}>
                <Image source={{ uri: 'https://images.unsplash.com/photo-1605276374104-162f148bc78a?auto=format&fit=crop&q=80&w=600' }} style={styles.featuredImage} />
                <View style={styles.featuredTag}><Text style={styles.featuredTagText}>Featured</Text></View>
                <View style={styles.likeIconBox}><Feather name="heart" size={18} color="#fff" /></View>
                
                <View style={styles.featuredOverlayCard}>
                  <View style={styles.developerLogo}><Text style={styles.developerLogoText}>Eastern Meadows</Text></View>
                  <Text style={styles.featuredTitle} numberOfLines={1}>Nishija Akshita Eastern Meadows</Text>
                  <Text style={styles.featuredLocation}>Land, Ghatkesar, Hyderabad</Text>
                  <Text style={styles.featuredPrice}>₹ 19.54 - 34.25 Lacs</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Buy Plots/Land */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Buy Plots/Land</Text>
          <Text style={styles.sectionSubtitle}>Explore Residential and Commercial Plots/Land</Text>
          <View style={styles.largeCard}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000' }} style={styles.largeCardImage} />
            <TouchableOpacity style={styles.exploreBtnRow}>
              <Text style={styles.exploreBtnText}>Explore all Plots/Land Options</Text>
              <MaterialIcons name="arrow-right-alt" size={24} color="#001b44" />
            </TouchableOpacity>
            <Text style={styles.largeCardSubtext}>+ Residential properties | + Commercial Properties</Text>
          </View>
        </View>

        <View style={{height: 100}} /> {/* Padding for bottom nav */}
      </ScrollView>

      {/* Fake Bottom Navigation to match design */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('TenantDashboard')}>
          <MaterialIcons name="home" size={24} color="#111" />
          <Text style={[styles.navText, { color: '#111', fontWeight: 'bold' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="search" size={24} color="#666" />
          <Text style={styles.navText}>Search</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItemCentral}>
          <View style={styles.navAddBtn}>
            <Feather name="plus" size={16} color="#333" />
          </View>
          <Text style={styles.navText}>Sell/Rent</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Feather name="heart" size={24} color="#666" />
          <Text style={styles.navText}>Activity</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.toggleDrawer()}>
          <Feather name="menu" size={24} color="#666" />
          <Text style={styles.navText}>Menu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  topBarScrolled: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuBtn: {
    padding: 4,
    marginRight: 12,
  },
  topSearchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchIconSmall: {
    marginRight: 8,
  },
  searchInputSmall: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    padding: 0, // Removes default padding on Android
  },
  iconBtn: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  heroSection: {
    width: '100%',
    height: 220,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  heroSubTitle: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: -25,
    zIndex: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#001b44',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0050cb',
    marginBottom: 16,
  },
  cardsScroll: {
    paddingRight: 16,
    gap: 16,
  },
  actionCard: {
    width: 80,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  miniBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#0050cb',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#eef2ff',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  toolsScroll: {
    paddingRight: 16,
    gap: 16,
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    width: 220,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  toolIconBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111',
  },
  toolDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemCentral: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navAddBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  navText: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
  },
  largeCard: {
    marginTop: 12,
  },
  largeCardImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  exploreBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  exploreBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001b44',
    marginRight: 8,
  },
  largeCardSubtext: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 24,
    marginHorizontal: 16,
  },
  articleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  articleHeaderIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  tabsScroll: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0050cb',
    paddingBottom: 8,
    marginRight: 24,
  },
  activeTabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#001b44',
  },
  inactiveTab: {
    paddingBottom: 8,
    marginRight: 24,
  },
  inactiveTabText: {
    fontSize: 14,
    color: '#666',
  },
  articleCard: {
    width: 260,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 8,
    marginRight: 16,
  },
  articleImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  articleContent: {
    flex: 1,
    marginLeft: 12,
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111',
  },
  articleDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  blueButton: {
    backgroundColor: '#0066ff',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  blueButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  coloredBackgroundSection: {
    backgroundColor: '#fbf8f1', // Light beige from design
    paddingVertical: 32,
    marginTop: 32,
  },
  sparkleIconBox: {
    backgroundColor: '#f59e0b',
    borderRadius: 20,
    padding: 6,
    marginRight: 12,
  },
  projectCard: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 16,
    marginRight: 16,
  },
  newArrivalTag: {
    alignSelf: 'center',
    backgroundColor: '#fbf8f1',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 16,
  },
  newArrivalText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#85662b',
  },
  projectCardBody: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
    marginBottom: 16,
  },
  projectCardLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  projectCircleImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  reraBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: -10,
  },
  reraText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  projectCardRight: {
    flex: 1,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  projectLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  projectPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 4,
  },
  projectConfig: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#666',
  },
  projectGrowth: {
    fontSize: 12,
    color: '#059669',
    marginTop: 4,
    fontWeight: '500',
  },
  projectCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zeroBrokerageText: {
    fontSize: 11,
    color: '#666',
  },
  viewNumberBtn: {
    backgroundColor: '#0066ff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  viewNumberText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  featuredCard: {
    width: 280,
    height: 320,
    borderRadius: 16,
    position: 'relative',
    marginRight: 16,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  featuredTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#c026d3',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  featuredTagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  likeIconBox: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 20,
  },
  featuredOverlayCard: {
    position: 'absolute',
    bottom: 0,
    left: '5%',
    right: '5%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  developerLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fdf4e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40,
    borderWidth: 2,
    borderColor: '#fff',
    marginBottom: 8,
  },
  developerLogoText: {
    fontSize: 8,
    textAlign: 'center',
    color: '#d97706',
    fontWeight: 'bold',
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
  },
  featuredLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  featuredPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 8,
  },
});

export default SearchScreen;