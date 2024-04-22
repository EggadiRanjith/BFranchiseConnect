import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View, TextInput } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import useUserData from '../components/useUserData';
import Header from '../components/Header';
import BottomNavbar from '../components/BottomNavBar';

const CompanyRegApp = () => {
    const navigation = useNavigation();
    const [businessName, setBusinessName] = useState('');
    const [description, setDescription] = useState('');
    const [industryType, setIndustryType] = useState('');
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [registeredAddress, setRegisteredAddress] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [minimumInvestment, setMinimumInvestment] = useState('');
    const [investmentDetails, setInvestmentDetails] = useState('');
    const [partnershipDetails, setPartnershipDetails] = useState('');
    const [franchiseOpportunities, setFranchiseOpportunities] = useState('');
    const [financialPerformance, setFinancialPerformance] = useState('');
    const [growthPotential, setGrowthPotential] = useState('');
    const [businessPlan, setBusinessPlan] = useState('');
    const [exitStrategy, setExitStrategy] = useState('');
    const [termsAndConditions, setTermsAndConditions] = useState('');
    const { userProfileData, fetchUserData } = useUserData();

    useEffect(() => {
        if (!userProfileData) {
            fetchUserData();
        }
    }, [userProfileData, fetchUserData]);

    const handleRegisterPress = async () => {
        try {
            const response = await fetch('https://franchiseconnectt.up.railway.app/api/register-business', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    business_name: businessName,
                    user_id: userProfileData.user_id,
                    description: description,
                    industry_type: industryType,
                    registration_number: registrationNumber,
                    registered_address: registeredAddress,
                    contact_info: contactInfo,
                    minimum_investment: Number(minimumInvestment),
                    investment_details: investmentDetails,
                    partnership_details: partnershipDetails,
                    franchise_opportunities: franchiseOpportunities,
                    financial_performance: Number(financialPerformance),
                    growth_potential: growthPotential,
                    business_plan: businessPlan,
                    exit_strategy: exitStrategy,
                    terms_and_conditions: termsAndConditions,
                }),
            });
            if (response.ok) {
                const business = await response.json();
                console.log('Business registered successfully:', business);
                navigation.dispatch(CommonActions.navigate('Bussinessprofile'));
            } else {
                console.error('Failed to register business');
            }
        } catch (error) {
            console.error('Error registering business:', error);
        }
    };

    const handleNumericInputChange = (value, setterFunction) => {
        // Allow only numeric input
        const numericValue = value.replace(/[^0-9]/g, '');
        setterFunction(numericValue);
    };

    return (
        <>
            <Header title="Franchiseconnect" />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Company Registration</Text>

                <View style={styles.inputContainer}>
                    <FontAwesome5 name="building" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Company Name"
                        value={businessName}
                        onChangeText={setBusinessName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <FontAwesome5 name="info-circle" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <FontAwesome5 name="industry" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Industry Type"
                        value={industryType}
                        onChangeText={setIndustryType}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <FontAwesome5 name="id-badge" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Registration Number"
                        value={registrationNumber}
                        onChangeText={setRegistrationNumber}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <FontAwesome5 name="address-card" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Registered Address"
                        value={registeredAddress}
                        onChangeText={setRegisteredAddress}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <FontAwesome5 name="phone" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Contact Info"
                        value={contactInfo}
                        onChangeText={(value) => handleNumericInputChange(value, setContactInfo)}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <FontAwesome5 name="hand-holding-usd" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Minimum Investment"
                        value={minimumInvestment}
                        onChangeText={(value) => handleNumericInputChange(value, setMinimumInvestment)}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <FontAwesome5 name="coins" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Investment Details"
                        value={investmentDetails}
                        onChangeText={setInvestmentDetails}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <FontAwesome5 name="handshake" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Partnership Details"
                        value={partnershipDetails}
                        onChangeText={setPartnershipDetails}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <FontAwesome5 name="user-friends" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Franchise Opportunities"
                        value={franchiseOpportunities}
                        onChangeText={setFranchiseOpportunities}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <FontAwesome5 name="chart-line" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Financial Performance"
                        value={financialPerformance}
                        onChangeText={(value) => handleNumericInputChange(value, setFinancialPerformance)}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <FontAwesome5 name="chart-area" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Growth Potential"
                        value={growthPotential}
                        onChangeText={setGrowthPotential}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <FontAwesome5 name="file-alt" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Business Plan"
                        value={businessPlan}
                        onChangeText={setBusinessPlan}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <FontAwesome5 name="door-open" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Exit Strategy"
                        value={exitStrategy}
                        onChangeText={setExitStrategy}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <FontAwesome5 name="file-contract" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Terms and Conditions"
                        value={termsAndConditions}
                        onChangeText={setTermsAndConditions}
                    />
                </View>

                <TouchableOpacity style={styles.registerButton} onPress={handleRegisterPress}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </ScrollView>
            <BottomNavbar />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    icon: {
        marginRight: 10,
        fontSize: 20,
        color: 'gray',
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
    },
    registerButton: {
        backgroundColor: '#3498db',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default CompanyRegApp;
