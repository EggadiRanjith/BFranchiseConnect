import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import {
  Avatar,
  Title,
  Subheading,
  Card,
  Paragraph,
  Appbar,
  IconButton,
  TextInput,
  Button,
  Portal,
  Provider as PaperProvider,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from 'react-query';
import BottomNavBar from '../components/BottomNavBar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import useUserData from '../components/useUserData';

const ProfileView = ({ route, navigation }) => {
  const { userId } = route.params;
  const [profileData, setProfileData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isCommentBoxOpen, setCommentBoxOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPostComments, setSelectedPostComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const { userProfileData, fetchUserData } = useUserData();
  let storedUserId;

  const likePost = useMutation(handleLike, {
    onSuccess: async () => {
      await fetchProfileData();
    },
  });

  const addComment = useMutation(postComment, {
    onSuccess: async () => {
      await fetchProfileData();
      closeCommentBox();
    },
  });

  const openCommentBox = (postId, comments) => {
    console.log('Selected Post ID:', postId);
    console.log('Selected Post Comments:', comments);
    setSelectedPostId(postId);
    setSelectedPostComments(comments || []);
    setCommentBoxOpen(true);
  };

  const closeCommentBox = () => {
    setSelectedPostId(null);
    setSelectedPostComments([]);
    setCommentBoxOpen(false);
    setCommentText('');
  };

  const navigator = useNavigation();

  // Define an async function for fetching profile data
  const fetchProfileData = async () => {
    try {
      storedUserId = await AsyncStorage.getItem('userId');
      console.log(storedUserId);
      const profileResponse = await fetch(`https://franchiseconnectt.up.railway.app/api/user/profile/${userId}`);
      const postsResponse = await fetch(`https://franchiseconnectt.up.railway.app/api/posts/user/${userId}`);

      if (!profileResponse.ok || !postsResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      const profileData = await profileResponse.json();
      console.log('hi',profileData.user_id)
      const postsData = await postsResponse.json();
      setProfileData(profileData);
      setUserPosts(postsData.posts);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  useEffect(() => {
    // Call the async function within useEffect
    fetchProfileData();
    fetchUserData();
  }, []);

  async function handleLike(postId) {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const hasLikedKey = `liked:${userId}:${postId}`;
      const hasLiked = await AsyncStorage.getItem(hasLikedKey);

      if (hasLiked) {
        console.log('User has already liked this post');
        return;
      }

      await fetch(`https://franchiseconnectt.up.railway.app/api/posts/${postId}/like`, {
        method: 'POST',
      });

      const response = await fetch(`https://franchiseconnectt.up.railway.app/api/posts/${postId}`);
      const postData = await response.json();
      const ownerId = postData.author_id;

      const username = await AsyncStorage.getItem('username');
      const notificationContent = `${username} liked your post`;

      await fetch('https://franchiseconnectt.up.railway.app/api/insert-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: userId,
          receiverId: ownerId,
          type: 'LIKE',
          content: notificationContent,
        }),
      });

      await AsyncStorage.setItem(hasLikedKey, 'true');
      await fetchProfileData();
    } catch (error) {
      console.error('Error liking post and adding notification:', error.message);
      throw error;
    }
  }

  async function postComment({ postId, text }) {
    try {
      const user_id = await AsyncStorage.getItem('userId');
      const username = await AsyncStorage.getItem('username');

      const response = await fetch(`https://franchiseconnectt.up.railway.app/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          content: text,
          user_id: user_id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedPostComments((prevComments) => [...prevComments, data]);

        const postResponse = await fetch(`https://franchiseconnectt.up.railway.app/api/posts/${postId}`);
        const postData = await postResponse.json();
        const ownerId = postData.author_id;

        const notificationContent = `${username} commented on your post`;

        await fetch('https://franchiseconnectt.up.railway.app/api/insert-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderId: user_id,
            receiverId: ownerId,
            type: 'COMMENT',
            content: notificationContent,
          }),
        });

        await fetchProfileData();
      } else {
        console.error('Error posting comment:', response.status);
      }
    } catch (error) {
      console.error('Error posting comment:', error.message);
      throw error;
    }
  }

  const handleNavigateToChat = async () => {
    try {
      // Ensure that storedUserId is set before navigating
      if (!storedUserId) {
        storedUserId = await AsyncStorage.getItem('userId');
      }
  
      const otherUserId = profileData?.user_id;
  
      if (otherUserId !== undefined && otherUserId !== null) {
        console.log('Navigating to ChatScreen with data:', {
          userId: storedUserId,
          otherUserId: otherUserId,
        });
  
        navigator.navigate('ChatScreen', {
          userId: storedUserId,
          otherUserId: otherUserId,
        });
      } else {
        console.error('Error: otherUserId is undefined or null');
        // Handle the error or provide a default value if necessary
      }
    } catch (error) {
      console.error('Error getting userId from AsyncStorage:', error);
    }
  };
  
  const renderProfileByUserType = () => {
    if (!profileData || !userProfileData) {
      return null;
    }
  
    const { user_type, user_id } = profileData;
    const currentUserID = userProfileData.user_id !== profileData.user_id; // Function to get current user's ID
    const isCurrentUserBusiness = userProfileData.user_type=== 'business'; // Function to get current user's type
  
    switch (user_type) {
      case 'user':
        return (
          <>
            {renderUserProfile()}
            {currentUserID && renderMessageButton()}
            {renderUserPosts()}
          </>
        );
      case 'franchise':
        return (
          <>
            {renderFranchiseUserProfile()}
            {currentUserID && renderMessageButton()}
            {renderUserPosts()}
          </>
        );
      case 'business':
        return (
          <>
            {renderBusinessUserProfile()}
            {currentUserID && !isCurrentUserBusiness && renderApplicationButton()}
            {currentUserID && renderMessageButton()}
            {renderUserPosts()}
          </>
        );
      default:
        return null;
    }
  };
  
  const renderMessageButton = () => (
    <Button mode="contained" onPress={handleNavigateToChat} style={styles.messageButton}>
      Message
    </Button>
  );

  const renderApplicationButton = () => (
    <Button mode="contained" onPress={handleApplication} style={styles.applicationButton}>
      Apply
    </Button>
  );

  const handleApplication = async() => {
    try {
      // Ensure that storedUserId is set before navigating
      if (!storedUserId) {
        storedUserId = await AsyncStorage.getItem('userId');
      }
  
      const business_id = profileData.business?.business_id;
      const  user_id1 = profileData.business?.user_id;
      const admin_approval_status = profileData.business?.admin_approval_status;
      console.log(admin_approval_status);
  
      if (business_id !== undefined && business_id !== null && admin_approval_status == 'agreed' ) {
        console.log('Navigating to ChatScreen with data:', {
          userId: storedUserId,
          business_id: business_id,
          user_id: user_id1,
        });
  
        navigator.navigate('Application', {
          userId: storedUserId,
          business_id: business_id,
          user_id: user_id1,
        });
      } else {
        setIsBusinessNotReadyModalVisible(true); // Show modal when business ID is not available
      }
    } catch (error) {
      console.error('Error getting userId from AsyncStorage:', error);
    }
  };

  const renderUserProfile = () => (
    <Card style={styles.cardContainer}>
      <Card.Content>
        <Avatar.Image
          size={150}
          source={profileData.profile_picture ? { uri: profileData.profile_picture } : require('../images/default-profilepicture.png')}
          style={styles.profileImage}
        />
        <Title style={styles.username}>{profileData.username || 'No Data'}</Title>
        <Subheading style={styles.bio}>{profileData.user_type || 'No Data'}</Subheading>
        <Paragraph>Email: {profileData.email || 'No Data'}</Paragraph>
        <Paragraph>contactInfo: {profileData.contact_info || 'No Data'}</Paragraph>
        <Paragraph>Address: {profileData.address || 'No Data'}</Paragraph>
      </Card.Content>
    </Card>
  );

  const renderFranchiseUserProfile = () => (
    <Card style={styles.cardContainer}>
      <Card.Content>
        <Avatar.Image
          size={150}
          source={profileData.profile_picture ? { uri: profileData.profile_picture } : require('../images/default-profilepicture.png')}
          style={styles.profileImage}
        />
        <Title style={styles.username}>{profileData.username || 'No Data'}</Title>
        <Subheading style={styles.bio}>{profileData.user_type || 'No Data'}</Subheading>
        <Paragraph>Email: {profileData.email || 'No Data'}</Paragraph>
        <Paragraph>contactInfo: {profileData.contact_info || 'No Data'}</Paragraph>
        <Paragraph>Address: {profileData.address || 'No Data'}</Paragraph>
      </Card.Content>
    </Card>
  );

  const renderBusinessUserProfile = () => (
    <Card style={styles.cardContainer}>
      <Card.Content>
        <Avatar.Image
          size={150}
          source={profileData.profile_picture ? { uri: profileData.profile_picture } : require('../images/default-profilepicture.png')}
          style={styles.profileImage}
        />
        <Title style={styles.username}>{profileData.username || 'Business Name'}</Title>
        <Subheading style={styles.bio}>{profileData.user_type || 'Business Owner'}</Subheading>
        <Paragraph>Email: {profileData.email || 'business.owner@example.com'}</Paragraph>
        <Paragraph>Industry: {profileData.business?.industry_type || 'Technology'}</Paragraph>
        <Paragraph>Description: {profileData.business?.description || 'No description available'}</Paragraph>
        <Paragraph>Registration Number: {profileData.business?.registration_number || 'Not provided'}</Paragraph>
        <Paragraph>Registered Address: {profileData.business?.registered_address || 'Not provided'}</Paragraph>
        <Paragraph>Contact Info: {profileData.contact_info || 'Not provided'}</Paragraph>
        <Paragraph>Registration Date: {profileData.business?.registration_date || 'Not available'}</Paragraph>
        <Paragraph>Minimum Investment: {profileData.business?.minimum_investment || 'Not provided'}</Paragraph>
        <Paragraph>Investment Details: {profileData.business?.investment_details || 'Not provided'}</Paragraph>
        <Paragraph>Partnership Details: {profileData.business?.partnership_details || 'Not provided'}</Paragraph>
        <Paragraph>Franchise Opportunities: {profileData.business?.franchise_opportunities || 'Not provided'}</Paragraph>
        <Paragraph>Financial Performance: {profileData.business?.financial_performance || 'Not provided'}</Paragraph>
        <Paragraph>Growth Potential: {profileData.business?.growth_potential || 'Not provided'}</Paragraph>
        <Paragraph>Business Plan: {profileData.business?.business_plan || 'Not provided'}</Paragraph>
        <Paragraph>Exit Strategy: {profileData.business?.exit_strategy || 'Not provided'}</Paragraph>
        <Paragraph>Terms and Conditions: {profileData.business?.terms_and_conditions || 'Not provided'}</Paragraph>
      </Card.Content>
    </Card>
  );

  const renderUserPosts = () => (
    <ScrollView>
      <Title>Posts:</Title>
      {userPosts.map((post) => (
        <Card key={post.post_id} style={styles.postCard}>
          <Card.Cover source={{ uri: post.image }} />
          <Card.Content>
            <Paragraph>Description : {post.content}</Paragraph>
            <View style={styles.postFooter}>
              <TouchableOpacity style={styles.likeButton} onPress={() => likePost.mutate(post.post_id)}>
                <Icon name={post.isLiked ? 'heart' : 'heart-outline'} size={20} color={post.isLiked ? 'red' : 'black'} />
                <Text style={styles.likeCountText}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentButton} onPress={() => openCommentBox(post.post_id, post.comments || [])}>
                <Icon name="comment" size={20} color="black" />
                <Text style={styles.commentCountText}>{post.comments ? post.comments.length : 0}</Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );

  const renderCommentBox = () => (
    <Portal>
      <Modal visible={isCommentBoxOpen} animationType="slide" transparent>
        <View style={styles.commentBox}>
          <IconButton icon="close" color="#000" size={20} style={styles.closeButton} onPress={closeCommentBox} />
         
          <FlatList
            data={selectedPostComments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Text style={styles.commentUsername}>
                  {item.user?.username || 'Unknown User'}:
                </Text>
                <Text>{item.content}</Text>
              </View>
            )}
          />
          <TextInput
            label="Add a comment"
            value={commentText}
            onChangeText={(text) => setCommentText(text)}
            multiline
            style={styles.commentInput}
          />
          <Button
            mode="contained"
            onPress={() => addComment.mutate({ postId: selectedPostId, text: commentText })}
            style={styles.postButton}
          >
            Post
          </Button>
        </View>
      </Modal>
    </Portal>
  );

  const [isBusinessNotReadyModalVisible, setIsBusinessNotReadyModalVisible] = useState(false);

  const renderBusinessNotReadyModal = () => (
    <Modal visible={isBusinessNotReadyModalVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Business Not Ready</Text>
          <Text style={styles.modalText}>This business is not ready to take applications at the moment.</Text>
          <Button mode="contained" onPress={() => setIsBusinessNotReadyModalVisible(false)}>
            OK
          </Button>
        </View>
      </View>
    </Modal>
  );

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Appbar.Header style={styles.appbar}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Profile" />
        </Appbar.Header>

        <ScrollView>
          {renderProfileByUserType()}
        </ScrollView>

        {renderCommentBox()}
        {renderBusinessNotReadyModal()}

        <BottomNavBar />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  appbar: {
    backgroundColor: '#3498db',
    elevation: 0,
  },
  cardContainer: {
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  profileImage: {
    alignSelf: 'center',
    marginTop: 16,
  },
  username: {
    alignSelf: 'center',
    marginVertical: 8,
    fontSize: 18,
    fontWeight: 'bold',
  },
  bio: {
    alignSelf: 'center',
    marginBottom: 16,
    color: '#555',
  },
  postCard: {
    margin: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
  },
  commentInput: {
    height: 100,
    marginBottom: 16,
  },
  postButton: {
    width: '50%',
    alignSelf: 'center',
  },
  commentItem: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  commentUsername: {
    fontWeight: 'bold',
    marginRight: 4,
  },
  likeCountText: {
    marginLeft: 4,
  },
  commentCountText: {
    marginLeft: 4,
  },
  messageButton: {
    margin: 16,
  },
  applicationButton: {
    margin: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ProfileView;
