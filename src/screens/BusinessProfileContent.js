import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, ActivityIndicator, Button, Alert } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Card } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import Header from '../components/Header';
import BottomNavbar from '../components/BottomNavBar';
import Dropdown from '../components/datepicker';

const Tab = createMaterialTopTabNavigator();

const FranchiseListScreen = ({ businessProfiles, removeFranchise }) => {
  if (!businessProfiles || businessProfiles.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>No Franchises Found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>List of Franchises:</Text>
      {businessProfiles.map((franchise, index) => (
        <Card key={index} style={styles.card}>
          <View style={styles.userInfoContainer}>
            <FontAwesome name="user" size={24} color="black" style={styles.icon} />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{franchise.investor.username}</Text>
              <Text style={styles.userDetails}>{franchise.investor.email}</Text>
              <Text style={styles.userDetails}>{franchise.investor.contact_info}</Text>
            </View>
          </View>
          <Button title="Remove" onPress={() => removeFranchise(franchise)} />
        </Card>
      ))}
    </View>
  );
};

const FranchiseGrowthScreen = ({ route }) => {
  const { franchise } = route.params;
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
        const response = await fetch(`https://franchiseconnectt.up.railway.app/api/financial-data?business_id=${franchise.business_id}&user_id=${franchise.investor.user_id}`);
        if (response.ok) {
          const data = await response.json();
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
  }, [franchise, selectedYear, selectedMonth]);

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
      <Text style={styles.heading}>{franchise.name} Growth Data ({userViewLabel}):</Text>

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
  const { business_id } = route.params;

  useEffect(() => {
    const fetchBusinessProfiles = async () => {
      try {
        const response = await fetch(`https://franchiseconnectt.up.railway.app/api/franchiseProfiles/${business_id}`);
        if (response.ok) {
          const data = await response.json();
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
  }, [business_id]);

  const removeFranchise = async (franchise) => {
    try {
      console.log('Removing franchise with id ', franchise.application_id);
      const response = await fetch('https://franchiseconnectt.up.railway.app/api/removeFranchise', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ franchiseId: franchise.application_id }),
      });
      if (response.ok) {
        // Franchise removed successfully
        // Refresh the list of business profiles
        setBusinessProfiles(businessProfiles.filter(item => item.application_id !== franchise.application_id));
      } else {
        console.error('Failed to remove franchise:', response.statusText);
      }
    } catch (error) {
      console.error('Error removing franchise:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
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
        <Tab.Screen name="FranchiseList">
          {() => <FranchiseListScreen businessProfiles={businessProfiles} removeFranchise={removeFranchise} />}
        </Tab.Screen>
        {businessProfiles.map((franchise, index) => (
          <Tab.Screen
            key={index}
            name={franchise.investor.username}
            component={FranchiseGrowthScreen}
            initialParams={{ franchise }}
          />
        ))}
      </Tab.Navigator>
      <BottomNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    marginBottom: 10,
    padding: 10,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userDetails: {
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 20,
  },
  summaryContainer: {
    marginTop: 20,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 5,
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

export default App;
