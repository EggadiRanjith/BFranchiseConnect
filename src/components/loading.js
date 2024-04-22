import React from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet, View } from 'react-native';

const LoadingIndicator = () => (
  <View style={styles.container}>
    <LottieView
      source={require('../images/Animation - 1710001815350.json')} // Replace 'path_to_your_loading_animation.json' with the path to your Lottie animation JSON file
      autoPlay
      loop
      style={styles.animation}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 100, // Adjust width as needed
    height: 100, // Adjust height as needed
  },
});

export default LoadingIndicator;
