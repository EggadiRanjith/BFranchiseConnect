import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

const Header = ({ title, iconName, iconColor, onPress }) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
        {iconName && <FontAwesome5 name={iconName} size={24} color={iconColor} />}
      </TouchableOpacity>
      <Text style={styles.title}>Franchise Connect</Text>
      <View style={styles.iconContainer} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#3498db', // Header background color
    height: 60,
    paddingHorizontal: 10,
    elevation: 5, // Shadow for Android
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff', // Header title color
  },
  iconContainer: {
    width: 40,
    alignItems: 'center',
  },
});

export default Header;
