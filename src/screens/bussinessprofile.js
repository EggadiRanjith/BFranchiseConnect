import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Card, Paragraph, Button, TextInput, Appbar } from 'react-native-paper'; // Import paper components
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavbar from '../components/BottomNavBar';

const BusinessProfileScreen = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({}); // Form data state

  useEffect(() => {
    // Fetch profile data from the backend
    const fetchProfileData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        // Make API call to fetch profile data
        const response = await fetch(`https://franchiseconnectt.up.railway.app/api/businesses/${userId}`);
        const data = await response.json();
        console.log(data);
        setProfileData(data);
        setFormData(data); // Set form data initially with profile data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSubmit = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');
       //Perform API call to update profile data
        const response = await fetch(`https://franchiseconnectt.up.railway.app/api/businesses/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(formData),
            headers: {
               'Content-Type': 'application/json',
            },
          });
      // Handle response accordingly
         const updatedData = await response.json();
      // Update local state with updated data if necessary
      setProfileData(updatedData);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile data:', error);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData(profileData); // Reset form data to original profile data
  };

  const handleChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.Content title="Franchiseconnect" titleStyle={styles.appBarTitle} />
      </Appbar.Header>
      <ScrollView>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : profileData ? (
          <Card style={styles.card}>
            <Card.Title title="Business Profile" />
            <Card.Content>
              {editing ? (
                <>
                  <TextInput
                    label="Description"
                    value={formData.description}
                    onChangeText={(text) => handleChange('description', text)}
                  />
                  <TextInput
                    label="Registration Number"
                    value={formData.registration_number ? formData.registration_number.toString() : ''}
                    onChangeText={(text) => handleChange('registration_number', text)}
                  />
                  <TextInput
                    label="Registered Address"
                    value={formData.registered_address}
                    onChangeText={(text) => handleChange('registered_address', text)}
                  />
                  <TextInput
                    label="Contact Info"
                    value={formData.contact_info}
                    onChangeText={(text) => handleChange('contact_info', text)}
                  />
                  <TextInput
                    label="Registration Date"
                    value={formData.registration_date ? formData.registration_date.toString() : ''}
                    onChangeText={(text) => handleChange('registration_date', text)}
                  />
                  <TextInput
                    label="Minimum Investment"
                    value={formData.minimum_investment ? formData.minimum_investment.toString() : ''}
                    onChangeText={(text) => handleChange('minimum_investment', text)}
                  />
                  <TextInput
                    label="Investment Details"
                    value={formData.investment_details}
                    onChangeText={(text) => handleChange('investment_details', text)}
                  />
                  <TextInput
                    label="Partnership Details"
                    value={formData.partnership_details}
                    onChangeText={(text) => handleChange('partnership_details', text)}
                  />
                  <TextInput
                    label="Franchise Opportunities"
                    value={formData.franchise_opportunities}
                    onChangeText={(text) => handleChange('franchise_opportunities', text)}
                  />
                  <TextInput
                    label="Financial Performance"
                    value={formData.financial_performance ? formData.financial_performance.toString() : ''}
                    onChangeText={(text) => handleChange('financial_performance', text)}
                  />
                  <TextInput
                    label="Growth Potential"
                    value={formData.growth_potential ? formData.growth_potential.toString() : ''}
                    onChangeText={(text) => handleChange('growth_potential', text)}
                  />
                  <TextInput
                    label="Business Plan"
                    value={formData.business_plan}
                    onChangeText={(text) => handleChange('business_plan', text)}
                  />
                  <TextInput
                    label="Exit Strategy"
                    value={formData.exit_strategy}
                    onChangeText={(text) => handleChange('exit_strategy', text)}
                  />
                  <TextInput
                    label="Terms and Conditions"
                    value={formData.terms_and_conditions}
                    onChangeText={(text) => handleChange('terms_and_conditions', text)}
                  />
                </>
              ) : (
                <>
                  <Paragraph>Description: {profileData?.description || 'No description available'}</Paragraph>
                  <Paragraph>Minimum Investment: {profileData?.minimum_investment || 'Not provided'}</Paragraph>
                  <Paragraph>Investment Details: {profileData?.investment_details || 'Not provided'}</Paragraph>
                  <Paragraph>Partnership Details: {profileData?.partnership_details || 'Not provided'}</Paragraph>
                  <Paragraph>Franchise Opportunities: {profileData?.franchise_opportunities || 'Not provided'}</Paragraph>
                  <Paragraph>Financial Performance: {profileData?.financial_performance || 'Not provided'}</Paragraph>
                  <Paragraph>Growth Potential: {profileData?.growth_potential || 'Not provided'}</Paragraph>
                  <Paragraph>Business Plan: {profileData?.business_plan || 'Not provided'}</Paragraph>
                  <Paragraph>Exit Strategy: {profileData?.exit_strategy || 'Not provided'}</Paragraph>
                  <Paragraph>Terms and Conditions: {profileData?.terms_and_conditions || 'Not provided'}</Paragraph>
                </>
              )}
            </Card.Content>
            <Card.Actions>
              {editing ? (
                <>
                  <Button onPress={handleSubmit}>Save</Button>
                  <Button onPress={handleCancel}>Cancel</Button>
                </>
              ) : (
                <Button onPress={handleEdit}>Edit</Button>
              )}
            </Card.Actions>
          </Card>
        ) : (
          <Text>No profile data available</Text>
        )}
      </ScrollView>
      <BottomNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
  },
  appBar: {
    backgroundColor: '#fff',
  },
  appBarTitle: {
    color: '#000',
  },
});

export default BusinessProfileScreen;
