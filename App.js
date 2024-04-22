import React from 'react';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from 'react-query';
import MainScreen from './src/screens/MainScreen';
import LoginScreen from './src/screens/login';
import Home from './src/screens/Homescreen';
import RegisterScreen from './src/screens/Registerscreen';
import FranchiseRegisterUser from './src/screens/Franchiseuser';
import CompanyRegister from './src/screens/Comanyreigister';
import bussinessform from './src/screens/bussinessform';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import NotificationScreen from './src/screens/NotificationScreen';
import UserProfileContent from './src/screens/UserProfileContent';
import BusinessProfileContent from './src/screens/BusinessProfileContent';
import UploadPostForm from './src/screens/UploadPostForm';
import profiles from './src/screens/profiles';
import ChatScreen from './src/screens/chatscreen';
import Application from './src/screens/application';
import Bussinessprofile from './src/screens/bussinessprofile';
import SinglepostDetails from './src/screens/singlepost';
import FranchiseProfileContent from './src/screens/Franchiseprofilecontent';
import Admin from './src/screens/adminscreen';
import PendingBussiness from './src/screens/pendingbusiness';

const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  // Customize the theme if needed
};

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="MainScreen">
            <Stack.Screen name="MainScreen" component={MainScreen} options={{ title: 'MainScreen', headerShown: false }} />
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'LoginScreen', headerShown: false }} />
            <Stack.Screen name="Home" component={Home} options={{ title: 'Home', headerShown: false }} />
            <Stack.Screen name="Registerscreen" component={RegisterScreen} options={{ title: 'Registerscreen', headerShown: false }} />
            <Stack.Screen name="FranchiseRegisterUser" component={FranchiseRegisterUser} options={{ title: 'FranchiseRegisterUser', headerShown: false }} />
            <Stack.Screen name="CompanyRegister" component={CompanyRegister} options={{ title: 'CompanyRegister', headerShown: false }} />
            <Stack.Screen name="bussinessform" component={bussinessform} options={{ title: 'bussinessform', headerShown: false }} />
            <Stack.Screen name="SearchScreen" component={SearchScreen} options={{ title: 'SearchScreen', headerShown: false }} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ title: 'ProfileScreen', headerShown: false }} />
            <Stack.Screen name="NotificationScreen" component={NotificationScreen} options={{ title: 'NotificationScreen', headerShown: false }} />
            <Stack.Screen name="UserProfileContent" component={UserProfileContent} options={{ title: 'UserProfileContent', headerShown: false }} />
            <Stack.Screen name="BusinessProfileContent" component={BusinessProfileContent} options={{ title: 'BusinessProfileContent', headerShown: false }} />
            <Stack.Screen name="UploadPostForm" component={UploadPostForm} options={{ title: 'UploadPostForm', headerShown: false }} />
            <Stack.Screen name="Profiles" component={profiles} options={{ title: 'Profiles', headerShown: false }} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'ChatScreen', headerShown: false }} />
            <Stack.Screen name="Application" component={Application} options={{ title: 'Application', headerShown: false }} />
            <Stack.Screen name="Bussinessprofile" component={Bussinessprofile} options={{ title: 'Bussinessprofile', headerShown: false }} />
            <Stack.Screen name="SinglepostDetails" component={SinglepostDetails} options={{ title: 'SinglepostDetails', headerShown: false }} />
            <Stack.Screen name="FranchiseProfileContent" component={FranchiseProfileContent} options={{ title: 'FranchiseProfileContent', headerShown: false }} />
            <Stack.Screen name="Admin" component={Admin} options={{ title: 'Admin', headerShown: false }} />
            <Stack.Screen name="PendingBussiness" component={PendingBussiness} options={{ title: 'PendingBussiness', headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </QueryClientProvider>
  );
}

export default App;
