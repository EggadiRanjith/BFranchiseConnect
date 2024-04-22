// useUserData.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useUserData = () => {
  const [userProfileData, setUserProfileData] = useState(null);

  const fetchUserData = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    const storedToken = await AsyncStorage.getItem('token');

    if (storedUserId && storedToken) {
      try {
        const response = await fetch(`https://franchiseconnectt.up.railway.app/api/profile`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorMessage}`);
        }

        const userData = await response.json();
        setUserProfileData(userData.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []); // Run only once when the component mounts

  return { userProfileData, fetchUserData };
};

export default useUserData;
