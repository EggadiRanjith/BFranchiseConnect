import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Modal, Text, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome5 icons
import Header from '../components/Header'; // Import your Header component
import BottomNavbar from '../components/BottomNavBar'; // Import your BottomNavbar component
import { useNavigation } from '@react-navigation/native';

const ApplicationForm = ({ route }) => {
  // State variables to store form data and modal visibility
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investmentPlanDetails, setInvestmentPlanDetails] = useState('');
  const [priorInvestmentExperience, setPriorInvestmentExperience] = useState('');
  const [purposeOfInvestment, setPurposeOfInvestment] = useState('');
  const [durationOfInvestment, setDurationOfInvestment] = useState('');
  const [relevantDocumentsUploaded, setRelevantDocumentsUploaded] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); // State for modal message
  const [validationError, setValidationError] = useState(''); // State for validation error message

  const { userId, business_id, user_id } = route.params;

  const navigation = useNavigation(); // Initialize navigation

  // Function to handle form submission
  const handleSubmit = async () => {
    // Validate form fields
    if (
      isNaN(Number(investmentAmount)) ||
      isNaN(Number(priorInvestmentExperience)) ||
      isNaN(Number(durationOfInvestment)) ||
      !investmentPlanDetails ||
      !purposeOfInvestment ||
      !relevantDocumentsUploaded
    ) {
      setValidationError('All fields are required and investment amount, prior investment experience, and duration of investment must be numeric.');
      return;
    }

    try {
      const response = await axios.post('https://franchiseconnectt.up.railway.app/api/submitform', {
        investor_id: userId,
        business_id: business_id,
        investment_amount: investmentAmount,
        investment_plan_details: investmentPlanDetails,
        prior_investment_experience: priorInvestmentExperience,
        purpose_of_investment: purposeOfInvestment,
        duration_of_investment: durationOfInvestment,
        relevant_documents_uploaded: relevantDocumentsUploaded,
      });
      setModalMessage('Form submitted successfully');
      setModalVisible(true); // Show modal
    } catch (error) {
      console.error('Error submitting form:', error);
      setModalMessage('Error submitting form'); // Set error message for modal
      setModalVisible(true); // Show modal
    }
  };

  // Function to handle numeric input
  const handleNumericInputChange = (value, setterFunction) => {
    if (/^\d+$/.test(value) || value === '') {
      setterFunction(value);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false); // Close modal
    navigation.navigate('ChatScreen', {
      userId: userId,
      otherUserId: user_id,
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Application Form" iconName="arrow-left" iconColor="#fff" onPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="dollar-sign" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              placeholder="Investment Amount"
              value={investmentAmount}
              onChangeText={(text) => handleNumericInputChange(text, setInvestmentAmount)}
              style={styles.input}
              keyboardType="numeric" // Set keyboard type to numeric
            />
          </View>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="file-alt" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              placeholder="Investment Plan Details"
              value={investmentPlanDetails}
              onChangeText={(text) => setInvestmentPlanDetails(text)}
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="briefcase" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              placeholder="Prior Investment Experience (years)"
              value={priorInvestmentExperience}
              onChangeText={(text) => handleNumericInputChange(text, setPriorInvestmentExperience)}
              style={styles.input}
              keyboardType="numeric" // Set keyboard type to numeric
            />
          </View>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="bullseye" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              placeholder="Purpose of Investment"
              value={purposeOfInvestment}
              onChangeText={(text) => setPurposeOfInvestment(text)}
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="calendar-alt" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              placeholder="Duration of Investment (months)"
              value={durationOfInvestment}
              onChangeText={(text) => handleNumericInputChange(text, setDurationOfInvestment)}
              style={styles.input}
              keyboardType="numeric" // Set keyboard type to numeric
            />
          </View>
          <View style={styles.inputContainer}>
            <FontAwesome5 name="file-upload" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              placeholder="Relevant Documents Uploaded"
              value={relevantDocumentsUploaded}
              onChangeText={(text) => setRelevantDocumentsUploaded(text)}
              style={styles.input}
            />
          </View>
          {/* Add validation error message */}
          <Text style={styles.errorText}>{validationError}</Text>
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
            <TouchableOpacity onPress={handleModalClose} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <BottomNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 60, // Adjust to accommodate BottomNavbar height
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    color: '#555',
    fontSize: 16,
    paddingLeft: 5,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  modalButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default ApplicationForm;
