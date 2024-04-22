import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Keyboard, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';
import BottomNavBar from '../components/BottomNavBar';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      // Keyboard has been dismissed
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleImageSelect = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        if (result.assets && result.assets.length > 0) {
          setImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const handleSubmit = async () => {
    const storedUserId = await AsyncStorage.getItem('userId');
    const storedToken = await AsyncStorage.getItem('token');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);

      if (image) {
        const uriParts = image.split('.');
        const fileType = uriParts[uriParts.length - 1];
        formData.append('image', {
          uri: image,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        });
      }
      console.log(formData)
      formData.append('author_id', storedUserId);

      const response = await fetch('https://franchiseconnectt.up.railway.app/api/posts', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${storedToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Post submitted successfully:', responseData);
        navigation.navigate('Home');
      } else {
        console.error('Error submitting post:', response.status);
      }
    } catch (error) {
      console.error('Error submitting post:', error);
    }

    setTitle('');
    setContent('');
    setImage(null);
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.contentContainer}>
          <Text style={styles.label}>Title:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter title"
            value={title}
            onChangeText={(text) => setTitle(text)}
            onBlur={Keyboard.dismiss}
          />

          <Text style={styles.label}>Content:</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Enter content"
            multiline
            value={content}
            onChangeText={(text) => setContent(text)}
            onSubmitEditing={Keyboard.dismiss} // Dismiss keyboard on submit
          />

          <TouchableOpacity style={styles.selectImageBtn} onPress={handleImageSelect}>
            <Text style={styles.selectImageText}>Select Image</Text>
          </TouchableOpacity>

          {image && <Image source={{ uri: image }} style={styles.image} />}

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <FontAwesome5 name="paper-plane" size={24} color="#fff" />
            <Text style={styles.submitBtnText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNavBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 16,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top', // Ensure vertical alignment at top for multiline input
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  selectImageBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectImageText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
  submitBtn: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 5,
  },
});

export default PostForm;
