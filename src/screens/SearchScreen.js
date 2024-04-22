import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Dimensions, Modal,Button } from 'react-native';
import { Card, Title } from 'react-native-paper';
import LoadingIndicator from '../components/loading'; // Import LoadingIndicator component
import BottomNavbar from '../components/BottomNavBar';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome5 icons

const SearchPage = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [numColumns, setNumColumns] = useState(3); // Initial number of columns
  const [loading, setLoading] = useState(true); // Set loading state to true initially
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); // State for modal message
  const flatListRef = useRef(null);

  useEffect(() => {
    setLoading(true); // Set loading to true before fetching profiles
    fetch('https://franchiseconnectt.up.railway.app/api/user/profiles')
      .then((response) => response.json())
      .then((data) => {
        const businessProfiles = data.filter((profile) => profile.user_type === 'business');
        setProfiles(businessProfiles);
      })
      .catch((error) => {
        console.error('Error fetching profiles:', error);
      })
      .finally(() => {
        // Hide loading indicator after 3 seconds
        const timer = setTimeout(() => {
          setLoading(false);
        }, 2000);
        return () => clearTimeout(timer); // Clear timer on component unmount
      });
  }, []);
  

  const handleSearch = () => {
    setLoading(true); // Set loading to true before starting search
    fetch(`https://franchiseconnectt.up.railway.app/api/user/search?query=${searchText}`)
      .then((response) => response.json())
      .then((data) => {
        setSearchResults(data);
        setLoading(false); // Set loading to false after fetching search results
      })
      .catch((error) => {
        console.error('Error searching profiles:', error);
        setLoading(false); // Set loading to false in case of error
      });
  };

  const handleProfileClick = (userId) => {
    navigation.navigate('Profiles', { userId });
  };

  const renderProfileItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleProfileClick(item.user_id)}>
      <View style={[styles.profileItem, { width: cardSize, height: cardSize + 60 }]}>
        <Card.Cover source={{ uri: item.profile_picture }} style={styles.profileImage} />
        <Card.Content>
          <Title style={styles.profileName}>{item.username}</Title>
        </Card.Content>
      </View>
    </TouchableOpacity>
  );

  const renderNoResults = () => (
    <View style={styles.profileItem}>
      <Text style={styles.noResultsText}>No user/profile found</Text>
    </View>
  );

  const cardSize = Dimensions.get('window').width / numColumns - 20; // Adjust the card size dynamically

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentContainer}>
        <View style={styles.searchContainer}>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="search" size={20} color="#777" style={styles.searchIcon} />
            <TextInput
              style={styles.input}
              placeholder="Search..."
              value={searchText}
              onChangeText={(text) => setSearchText(text)}
            />
          </View>
          <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
            <FontAwesome5 name="search" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          {loading && <LoadingIndicator />} 
          {!loading && (
            <FlatList
              ref={flatListRef}
              data={searchText ? searchResults : profiles}
              keyExtractor={(item) => item.user_id}
              renderItem={searchText && searchResults.length === 0 ? renderNoResults : renderProfileItem}
              numColumns={numColumns}
              key={numColumns}
            />
          )}
        </View>
      </View>
      <BottomNavbar />
      {/* Modal to display success or error message */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {modalMessage.includes('success') ? (
              <FontAwesome5 name="check-circle" size={60} color="green" />
            ) : (
              <FontAwesome5 name="times-circle" size={60} color="red" />
            )}
            <Text style={styles.modalMessage}>{modalMessage}</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Header = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.headerText}>FranchiseConnect</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#3498db',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingRight: 10,
    marginRight: 10,
  },
  searchIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    color: '#000',
  },
  searchButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  profileItem: {
    margin: 3,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  profileImage: {
    height: 125,
    padding: 5,
  },
  profileName: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 8,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 8,
    color: '#555', // Adjust color for better visibility
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default SearchPage;
