import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import Header from '../components/Header';

const BusinessApplicationsScreen = () => {
  const [pendingApplications, setPendingApplications] = useState([]);
  const [error, setError] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchPendingApplications();
  }, []);

  const fetchPendingApplications = async () => {
    try {
      const response = await fetch('https://franchiseconnectt.up.railway.app/api/pendingBusinessApplications');
      if (!response.ok) {
        throw new Error('Failed to fetch pending applications');
      }
      const data = await response.json();
      setPendingApplications(data);
      setError(null); // Reset error if request is successful
    } catch (error) {
      console.error('Error fetching pending applications:', error.message);
      setError('Failed to fetch pending applications. Please try again.'); // Set error message
    }
  };

  const renderBusinessCard = ({ item }) => (
    <TouchableOpacity style={[styles.card, item.admin_approval_status === 'agreed' ? styles.agreedCard : item.admin_approval_status === 'cancelled' ? styles.cancelledCard : null]} onPress={() => handleBusinessSelect(item)}>
      <FontAwesome5 name="business-time" style={styles.icon} />
      <Text style={styles.businessName}>{item.business_name}</Text>
      {item.admin_approval_status === 'agreed' && <Text style={styles.status}>Agreed</Text>}
      {item.admin_approval_status === 'cancelled' && <Text style={styles.status}>Cancelled</Text>}
    </TouchableOpacity>
  );

  const handleBusinessSelect = (business) => {
    setSelectedBusiness(business);
    setModalVisible(true);
  };

  const handleAgree = async () => {
    try {
      // Send a request to your backend to update the status of the selected business to "Agreed"
      await fetch('https://franchiseconnectt.up.railway.app/api/updateBusinessStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: selectedBusiness.business_id,
          status: 'agreed',
        }),
      });
      setModalVisible(false);
      // Refresh the pending applications after updating the status
      fetchPendingApplications();
    } catch (error) {
      console.error('Error updating business status:', error.message);
      Alert.alert('Error', 'Failed to update business status. Please try again.');
    }
  };
  
  const handleCancel = async () => {
    try {
      // Send a request to your backend to update the status of the selected business to "Cancelled"
      await fetch('https://franchiseconnectt.up.railway.app/api/updateBusinessStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessId: selectedBusiness.business_id,
          status: 'cancelled',
        }),
      });
      setModalVisible(false);
      // Refresh the pending applications after updating the status
      fetchPendingApplications();
    } catch (error) {
      console.error('Error updating business status:', error.message);
      Alert.alert('Error', 'Failed to update business status. Please try again.');
    }
  };
  
  return (
    <View style={styles.container}>
      <Header title="Business Applications" />
      <FlatList
        data={pendingApplications}
        renderItem={renderBusinessCard}
        keyExtractor={(item) => item.business_id.toString()} // Assuming business_id is unique
        ListEmptyComponent={<Text>No pending applications</Text>}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <FontAwesome5 name="times" style={styles.closeIcon} />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.modalContent}>
              {selectedBusiness && (
                <ScrollView>
                  <View>
                    <Text style={styles.modalSectionTitle}>Business Information</Text>
                    <Text style={styles.modalText}>Business Name: {selectedBusiness.business_name}</Text>
                    <Text style={styles.modalText}>Description: {selectedBusiness.description}</Text>
                    <Text style={styles.modalText}>Industry Type: {selectedBusiness.industry_type}</Text>
                    <Text style={styles.modalText}>Registration Number: {selectedBusiness.registration_number}</Text>
                    {/* Include other relevant fields related to business information */}
                    
                    <Text style={styles.modalSectionTitle}>Address</Text>
                    <Text style={styles.modalText}>Registered Address: {selectedBusiness.registered_address}</Text>
                    {/* Include other relevant fields related to address */}
                    
                    <Text style={styles.modalSectionTitle}>Contact Information</Text>
                    <Text style={styles.modalText}>Contact Info: {selectedBusiness.contact_info}</Text>
                    {/* Include other relevant fields related to contact information */}
                    
                    <Text style={styles.modalSectionTitle}>Other Details</Text>
                    <Text style={styles.modalText}>Registration Date: {selectedBusiness.registration_date}</Text>
                    <Text style={styles.modalText}>Minimum Investment: {selectedBusiness.minimum_investment}</Text>
                    <Text style={styles.modalText}>Investment Details: {selectedBusiness.investment_details}</Text>
                    <Text style={styles.modalText}>Partnership Details: {selectedBusiness.partnership_details}</Text>
                    <Text style={styles.modalText}>Franchise Opportunities: {selectedBusiness.franchise_opportunities}</Text>
                    <Text style={styles.modalText}>Financial Performance: {selectedBusiness.financial_performance}</Text>
                    <Text style={styles.modalText}>Growth Potential: {selectedBusiness.growth_potential}</Text>
                    <Text style={styles.modalText}>Business Plan: {selectedBusiness.business_plan}</Text>
                    <Text style={styles.modalText}>Exit Strategy: {selectedBusiness.exit_strategy}</Text>
                    <Text style={styles.modalText}>Terms and Conditions: {selectedBusiness.terms_and_conditions}</Text>
                    {/* Include other relevant fields related to other details */}
                    
                    {selectedBusiness.admin_approval_status === 'agreed' ? (
                      <Text style={styles.modalText}>Status: Agreed</Text>
                    ) : selectedBusiness.admin_approval_status === 'cancelled' ? (
                      <Text style={styles.modalText}>Status: Cancelled</Text>
                    ) : (
                      <View style={styles.buttonsContainer}>
                        <Button title="Agree" onPress={handleAgree} />
                        <Button title="Cancel" onPress={handleCancel} />
                      </View>
                    )}
                  </View>
                </ScrollView>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 20,
      },
      card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
      },
      icon: {
        fontSize: 24,
        marginRight: 10,
        color: '#007bff',
      },
      businessName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
      },
      agreedCard: {
        backgroundColor: 'lightgreen',
      },
      cancelledCard: {
        backgroundColor: 'lightcoral',
      },
      status: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'lightgreen',
        borderRadius: 5,
        padding: 5,
        color: 'white',
        fontWeight: 'bold',
      },
      closeButton: {
        position: 'absolute',
        top: 90,
        right: 30,
        zIndex: 5, // Ensure the close button stays on top of the modal content
      },
      closeIcon: {
        fontSize: 24,
        color: 'black',
      },
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
        elevation: 5,
        minWidth: '80%',
        maxHeight: '80%',
      },
      scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
      },
      modalText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
      },
      buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
    });
    
    export default BusinessApplicationsScreen;
    