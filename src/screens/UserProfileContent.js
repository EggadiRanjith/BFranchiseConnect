// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TextInput, Image } from 'react-native';
import { Appbar, Card, Title, List, Divider, Avatar, Paragraph, Button, IconButton, Switch } from 'react-native-paper';
import BottomNavbar from '../components/BottomNavBar';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

// UserProfileContent component
const UserProfileContent = () => {
  const navigation = useNavigation();
  const [editUserDataModalVisible, setEditUserDataModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [editPostModalVisible, setEditPostModalVisible] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [updatedPostContent, setUpdatedPostContent] = useState('');
  const [userProfileData, setUserProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newProfilePicture, setNewProfilePicture] = useState(null);
  const [newContactInfo, setNewContactInfo] = useState('');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  useEffect(() => {
    const fetchUserDataFromStorage = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedToken = await AsyncStorage.getItem('token');

      if (storedUserId && storedToken) {
        fetchUserData(storedUserId, storedToken);
        fetchUserPosts(storedUserId, storedToken);
      }
    };

    fetchUserDataFromStorage();
  }, []);

  const fetchUserData = async (storedUserId, token) => {
    try {
      const response = await fetch(`https://franchiseconnectt.up.railway.app/api/profile`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const userData = await response.json();
      setUserProfileData(userData.user);
      setNewName(userData.user.username);
      setNewLocation(userData.user.address);
      setNewContactInfo(userData.user.contact_info);
      setTwoFactorAuth(userData.user.two_factor_auth);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchUserPosts = async (userId, token) => {
    try {
      const response = await fetch(`https://franchiseconnectt.up.railway.app/api/posts/user/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const postsData = await response.json();
      setUserPosts(postsData.posts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const handleEditPost = (postId) => {
    setEditPostId(postId);
    setUpdatedPostContent(userPosts.find(post => post.post_id === postId).content);
    setEditPostModalVisible(true);
  };

  const handleDeletePost = async (postId) => {
    try {
      const storedToken = await AsyncStorage.getItem('token');

      const response = await fetch(`https://franchiseconnectt.up.railway.app/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${storedToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Remove the deleted post from the state
      setUserPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleUpdatePost = async (postId, updatedContent) => {
    try {
      const storedToken = await AsyncStorage.getItem('token');

      const response = await fetch(`https://franchiseconnectt.up.railway.app/api/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ content: updatedContent }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Update the post content in the state
      setUserPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_id === postId ? { ...post, content: updatedContent } : post
        )
      );

      // Close the edit post modal
      setEditPostModalVisible(false);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleSettingsUpdate = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUserId = await AsyncStorage.getItem('userId');
  
      const requestData = {
        name: newName,
        location: newLocation,
        contact_info: newContactInfo,
        two_factor_auth: twoFactorAuth,
      };
  
      // Check if newPassword is provided and add it to the request data
      if (newPassword) {
        requestData.password = newPassword;
      }
  
      // Check if newProfilePicture is provided and add its URL to the request data
      if (newProfilePicture) {
        requestData.profile_picture = newProfilePicture.uri; // Assuming `newProfilePicture.uri` contains the URL
      }
  
      const requestURL = `https://franchiseconnectt.up.railway.app/api/update-settings/${storedUserId}`;
      console.log('Request URL:', requestURL);
  
      const response = await fetch(requestURL, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });
  
      console.log('Response:', response);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Close the settings modal
      setSettingsModalVisible(false);
  
      // Fetch updated user data
      fetchUserData(storedUserId, storedToken);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };
  
  
  
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      // Access selected assets through the "assets" array
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedAsset = result.assets[0];
        setNewProfilePicture(selectedAsset);

        // If you need the URI specifically, you can access it like this
        const uri = selectedAsset.uri;
        // Do something with the URI...
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };
  
  

  if (!userProfileData ) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.appBar}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="User Profile" titleStyle={styles.appBarTitle} />
        <Appbar.Action
          icon="cog"
          onPress={() => setSettingsModalVisible(true)}
        />
      </Appbar.Header>

      <ScrollView>
        <View style={styles.contentContainer}>
          <Avatar.Image
            size={120}
            source={{ uri: userProfileData.profile_picture }}
            style={styles.profilePicture}
          />

          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.userName}>{userProfileData.username}</Title>
              <Paragraph style={styles.userBio}>{userProfileData.createdAt}</Paragraph>
              <List.Section style={styles.infoContainer}>
                <List.Item title="Location" description={userProfileData.address} />
                <Divider />
                <List.Item title="Email" description={userProfileData.email} />
              </List.Section>
            </Card.Content>
          </Card>

          <Card style={styles.postContainer}>
            <Card.Content>
              <Title>Posts</Title>
              {userPosts.map((post) => (
                <Card key={post.post_id} style={styles.postCard}>
                  <Card.Content>
                    <Paragraph>
                      Description: {post.content}
                    </Paragraph>
                  </Card.Content>
                  {post.image && (
                    <Card.Cover source={{ uri: post.image }} style={styles.postImage} />
                  )}
                  <Card.Actions style={styles.postActions}>
                    <IconButton
                      icon="pencil"
                      color="#3498db"
                      size={20}
                      onPress={() => handleEditPost(post.post_id)}
                    />
                    <IconButton
                      icon="delete"
                      color="#e74c3c"
                      size={20}
                      onPress={() => handleDeletePost(post.post_id)}
                    />
                  </Card.Actions>
                </Card>
              ))}
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      <BottomNavbar />

      {/* Edit Post Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editPostModalVisible}
        onRequestClose={() => setEditPostModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Edit Post</Text>
            <TextInput
              placeholder="Updated content..."
              multiline
              value={updatedPostContent}
              onChangeText={(text) => setUpdatedPostContent(text)}
              style={styles.modalInput}
            />
            <Button mode="contained" onPress={() => handleUpdatePost(editPostId, updatedPostContent)}>
              Update
            </Button>
            <Button mode="outlined" onPress={() => setEditPostModalVisible(false)}>
              Cancel
            </Button>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsModalVisible}
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Edit Settings</Text>
            <TextInput
              placeholder="New Name"
              value={newName}
              onChangeText={(text) => setNewName(text)}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="New Location"
              value={newLocation}
              onChangeText={(text) => setNewLocation(text)}
              style={styles.modalInput}
            />
            <TextInput
              placeholder="New Password"
              secureTextEntry
              value={newPassword}
              onChangeText={(text) => setNewPassword(text)}
              style={styles.modalInput}
            />
            <Button onPress={handlePickImage}>Pick New Profile Picture</Button>
            {newProfilePicture && (
              <Avatar.Image
                size={100}
                source={{ uri: newProfilePicture.uri }}
                style={styles.circularPicturePreview}
              />
            )}
            <TextInput
              placeholder="New Contact Info"
              value={newContactInfo}
              onChangeText={(text) => setNewContactInfo(text)}
              style={styles.modalInput}
            />
            <View style={styles.switchContainer}>
              <Text>Enable Two-Factor Authentication</Text>
              <Switch
                value={twoFactorAuth}
                onValueChange={() => setTwoFactorAuth(!twoFactorAuth)}
              />
            </View>
            <Button mode="contained" onPress={handleSettingsUpdate}>
              Update Settings
            </Button>
            <Button mode="outlined" onPress={() => setSettingsModalVisible(false)}>
              Cancel
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    backgroundColor: '#3498db',
    elevation: 0,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  contentContainer: {
    alignItems: 'center',
    padding: 20,
  },
  profilePicture: {
    marginTop: 20,
    marginBottom: 20,
  },
  card: {
    width: '100%',
    alignSelf: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  userBio: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    width: '100%',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postContainer: {
    width: '100%',
    alignSelf: 'center',
    marginBottom: 20,
    elevation: 2,
  },
  postCard: {
    marginBottom: 20,
    elevation: 2,
  },
  postImage: {
    height: 200,
    marginBottom: 10,
  },
  postActions: {
    justifyContent: 'space-between',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalInput: {
    marginVertical: 10,
    height: 80,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  PicturePreview: {
    width: '100%',
    height: 100,
    marginBottom: 10,
    borderRadius: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  circularPicturePreview: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 50,
    overflow: 'hidden',
  },  
});

export default UserProfileContent;
