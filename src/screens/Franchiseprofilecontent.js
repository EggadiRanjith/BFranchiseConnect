import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, ActivityIndicator, Button } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Card } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome5 for icons
import Header from '../components/Header'; // Import your Header component
import BottomNavbar from '../components/BottomNavBar';
import Dropdown from '../components/datepicker'; // Import your Dropdown component
import axios from 'axios'; // Import axios for making HTTP requests

const Tab = createMaterialTopTabNavigator();

const BusinessListScreen = ({ businessProfiles }) => {
  if (!businessProfiles || businessProfiles.length === 0) {
    return (
      <View style={styles.scene}>
        <Text style={styles.heading}>No Businesses Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.scene}>
      <Text style={styles.heading}>List of Businesses:</Text>
      {businessProfiles.map((business, index) => (
        <Card key={index} style={styles.card}>
          <View style={styles.userInfoContainer}>
            <FontAwesome5 name="user" size={24} color="black" style={styles.icon} />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{business.business.business_name}</Text>
              <Text style={styles.userDetails}>{business.business.user.email}</Text>
              <Text style={styles.userDetails}>{business.business.user.contact_info}</Text>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
};

const FinancialSubmitScreen = ({ route }) => {
  const { business } = route.params;
  const [financialData, setFinancialData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [userViewLabel, setUserViewLabel] = useState('Overall');
  const [isYearDropdownVisible, setIsYearDropdownVisible] = useState(false);
  const [isMonthDropdownVisible, setIsMonthDropdownVisible] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, index) => currentYear - index);
  const months = Array.from({ length: 12 }, (_, index) => ({
    value: index + 1,
    label: new Date(0, index).toLocaleString('default', { month: 'long' }),
  }));

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const response = await axios.get(`https://franchiseconnectt.up.railway.app/api/financial-data?business_id=${business.business.business_id}&user_id=${business.investor.user_id}`);
        if (response.status === 200) {
          const data = response.data;
          const filteredData = data.filter(entry => {
            const entryDate = new Date(entry.investment_date);
            const entryYear = entryDate.getFullYear();
            const entryMonth = entryDate.getMonth() + 1;
            
            if (selectedYear && selectedMonth) {
              return entryYear === selectedYear && entryMonth === selectedMonth;
            } else if (selectedYear) {
              return entryYear === selectedYear;
            } else {
              return true;
            }
          });

          setFinancialData(filteredData);
        } else {
          // Handle errors
        }
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinancialData();

    setUserViewLabel(getUserViewLabel(selectedYear, selectedMonth));
  }, [business, selectedYear, selectedMonth]);

  const getUserViewLabel = (year, month) => {
    if (!year) {
      return 'Overall';
    } else if (!month) {
      return `Year: ${year}`;
    } else {
      return `Year: ${year}, Month: ${getMonthName(month)}`;
    }
  };

  const getMonthName = (month) => {
    const monthNames = [
      "December", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November",
    ];
    return monthNames[month - 1];
  };

  const calculateProfitLoss = () => {
    if (financialData.length === 0) return 0;

    const totalIncome = financialData.reduce((acc, curr) => acc + curr.income_amount, 0);
    const totalInvestment = financialData.reduce((acc, curr) => acc + curr.investment_amount, 0);
    return totalIncome - totalInvestment;
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>{business.business_name} Growth Data ({userViewLabel}):</Text>

      <View style={styles.filtersContainer}>
        <View style={[styles.pickerContainer, styles.yearPickerContainer]}>
          <Button title={`${selectedYear || 'Select Year'}`} onPress={() => setIsYearDropdownVisible(true)} />
          <Dropdown
            options={years.map(year => ({ value: year, label: year.toString() }))}
            selectedValue={selectedYear}
            onSelect={setSelectedYear}
            isVisible={isYearDropdownVisible}
            onClose={() => setIsYearDropdownVisible(false)}
          />
        </View>

        <View style={[styles.pickerContainer, styles.monthPickerContainer]}>
          <Button title={`${selectedMonth ? getMonthName(selectedMonth) : 'Select Month'}`} onPress={() => setIsMonthDropdownVisible(true)} />
          <Dropdown
            options={months}
            selectedValue={selectedMonth}
            onSelect={setSelectedMonth}
            isVisible={isMonthDropdownVisible}
            onClose={() => setIsMonthDropdownVisible(false)}
          />
        </View>
      </View>

      {financialData.length > 0 ? (
        <View>
          <Text style={styles.subtitle}>Profit/Loss Summary</Text>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryText}>Total Income: ${financialData.reduce((acc, curr) => acc + curr.income_amount, 0)}</Text>
            <Text style={styles.summaryText}>Total Investment: ${financialData.reduce((acc, curr) => acc + curr.investment_amount, 0)}</Text>
            <Text style={[styles.summaryText, { color: calculateProfitLoss() >= 0 ? 'green' : 'red' }]}>
              Total Profit/Loss: ${calculateProfitLoss()}
            </Text>
          </View>
        </View>
      ) : (
        <Text>No financial data available</Text>
      )}
    </ScrollView>
  );
};

const App = ({ route, navigation }) => {
  const [businessProfiles, setBusinessProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user_id } = route.params;

  useEffect(() => {
    const fetchBusinessProfiles = async () => {
      try {
        const response = await axios.get(`https://franchiseconnectt.up.railway.app/api/businessProfiles/${user_id}`);
        if (response.status === 200) {
          const data = response.data;
          if (Array.isArray(data)) {
            setBusinessProfiles(data);
          } else {
            console.error('Invalid data format:', data);
          }
        } else {
          console.error('Error fetching business profiles:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching business profiles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessProfiles();
  }, [user_id]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff"/>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: '#007bff' },
          tabBarScrollEnabled: true,
        }}
      >
        <Tab.Screen name="BusinessList">
          {() => <BusinessListScreen businessProfiles={businessProfiles} />}
        </Tab.Screen>
        {businessProfiles.map((business, index) => (
          <Tab.Screen
            key={index}
            name={business.business.business_name} // Change the name to investor's username
            component={FinancialSubmitScreen}
            initialParams={{ business }}
          />
        ))}
      </Tab.Navigator>
      <BottomNavbar />
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scene: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    elevation: 3,
  },
  icon: {
    marginRight: 15,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userDetails: {
    fontSize: 16,
    marginBottom: 3,
  },
  businessCount: {
    fontSize: 16,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '100%',
  },
  button: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '40%',
  },
  submitButton: {
    backgroundColor: '#007bff',
  },
  closeButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  buttonIcon: {
    marginRight: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {    
    marginBottom: 15,
    textAlign: 'center',
  },
  calendar: {
    marginBottom: 20,
  },
  dayContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  alreadySubmitted: {
    backgroundColor: 'gray', // Change to your desired color for already submitted dates
  },
  summaryContainer: {
    marginTop: 20,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
  },
  dayText: {
    fontSize: 16,
    color: '#2d4150',
  },
  filtersContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 5,
    borderColor: '#007bff',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10, // Add margin bottom to create space between picker containers
  },
  yearPickerContainer: {
    flex:1,
    alignSelf:'stretch',
    marginRight: 5,
  },
  monthPickerContainer: {
    flex:1,
    alignSelf:'stretch',
    marginRight: 5,
  },
  picker: {
    flex: 1,
    color: '#000', // Text color
  },
});

export { App };
