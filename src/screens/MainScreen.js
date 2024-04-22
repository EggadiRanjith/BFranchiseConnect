import React, { useEffect, useRef } from 'react';
import { Platform, Image, Animated, Easing, StyleSheet } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { SafeAreaView, StatusBar, useColorScheme, View, Text } from 'react-native';

const MainScreen = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useNavigation();

  const backgroundStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFAF0', // Light peach background color
  };

  const logoScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Custom easing
        useNativeDriver: true,
      }).start(() => {
        // Redirect to the login screen after the logo animation is complete
        navigation.dispatch(CommonActions.navigate('LoginScreen'));
      });
    };

    // Start animation with a slight delay for better visual experience
    const animationTimeout = setTimeout(() => {
      startAnimation();
    }, 500);

    return () => clearTimeout(animationTimeout);
  }, [logoScale, navigation]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [
              {
                scale: logoScale.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1], // Interpolating the scale for more dynamic animation
                }),
              },
            ],
          },
        ]}
      >
        <Image
          source={require('../images/logo1.png')} // Replace with your logo path
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      <Text style={styles.title}>Franchise Connect</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#085f63',
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'San Francisco',
    marginBottom: 20,
  },
});

export default MainScreen;
