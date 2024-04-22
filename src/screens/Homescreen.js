import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Modal, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Appbar, Card, Title, Caption, Portal, TextInput, Button, Avatar } from 'react-native-paper';
import { useQuery, useMutation } from 'react-query';
import BottomNavbar from '../components/BottomNavBar';
import LoadingIndicator from '../components/loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { TouchableRipple } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome5

const PostFeed = ({ navigation }) => {
  const [posts, setPosts] = useState([]); // State to hold posts data
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPostComments, setSelectedPostComments] = useState([]);
  const [isCommentBoxOpen, setCommentBoxOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [error, setError] = useState(null);
  const [showLoading, setShowLoading] = useState(true); // State to control loading screen

  const fetchPosts = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`https://franchiseconnectt.up.railway.app/api/posts`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const postData = await response.json();
      console.log(postData);
      // Fetch the liked status for each post
      const postsWithLikedStatus = await Promise.all(postData.map(async (post) => {
        const hasLikedKey = `liked:${userId}:${post.post_id}`;
        const hasLiked = await AsyncStorage.getItem(hasLikedKey);
        return { ...post, hasLiked: !!hasLiked };
      }));

      setPosts(postsWithLikedStatus); // Update state with fetched posts data
    } catch (error) {
      console.error('Error fetching posts:', error.message);
      setError('Failed to fetch posts. Please try again later.');
    }
  };

  const likePost = useMutation(handleLike, {
    onSuccess: async () => {
      await fetchPosts();
    },
  });

  const addComment = useMutation(postComment, {
    onSuccess: async () => {
      await fetchPosts();
    },
  });

  const openCommentBox = (postId, comments) => {
    setSelectedPostId(postId);
    setSelectedPostComments(comments || []);
    setCommentBoxOpen(true);
  };

  const closeCommentBox = () => {
    setSelectedPostId(null);
    setSelectedPostComments([]);
    setCommentBoxOpen(false);
    setComment('');
    setError(null);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false); // Hide loading screen after 4 seconds
    }, 2000);

    return () => clearTimeout(timer); // Clear timer on component unmount
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchPosts(); // Fetch posts data every time the screen comes into focus
    }, [])
  );

  async function handleLike(postId) {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const hasLikedKey = `liked:${userId}:${postId}`;
      const hasLiked = await AsyncStorage.getItem(hasLikedKey);
      const method = hasLiked ? 'DELETE' : 'POST';
  
      await fetch(`https://franchiseconnectt.up.railway.app/api/posts/${postId}/like`, {
        method: method,
      });
  
      if (method === 'DELETE') {
        await AsyncStorage.removeItem(hasLikedKey);
      } else {
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
            post_id: postId,
            type: 'LIKE',
            content: notificationContent,
          }),
        });
  
        await AsyncStorage.setItem(hasLikedKey, 'true');
      }
  
      await fetchPosts();
    } catch (error) {
      console.error('Error toggling like:', error);
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
            post_id: postId,
            type: 'COMMENT',
            content: notificationContent,
          }),
        });

        closeCommentBox();
      } else {
        console.error('Error posting comment:', response.status);
      }
    } catch (error) {
      console.error('Error posting comment:', error.message);
      throw error;
    }
  }

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <TouchableRipple
        onPress={() => {
          navigation.navigate('Profiles', { userId: item.user.user_id });
        }}
      >
        <View style={styles.postHeader}>
          {item.user?.profile_picture ? (
            <Avatar.Image
              source={{ uri: item.user.profile_picture }}
              size={20}
              style={styles.avatar}
            />
          ) : (
            <Avatar.Icon
              icon="account-circle"
              size={20}
              style={styles.avatar}
            />
          )}
          <Title style={styles.userName}>{item.user?.username || 'Unknown User'}</Title>
        </View>
      </TouchableRipple>
      <Card.Cover source={{ uri: item.image }} style={styles.cardCover} />
      <Card.Content style={styles.cardContent}>
        <View style={styles.iconsContainer}>
          <FontAwesome5
            name={item.hasLiked ? 'heart' : 'heart'}
            solid={item.hasLiked}
            color={item.hasLiked ? 'red' : 'black'}
            size={20}
            style={styles.iconButton}
            onPress={() => {
              try {
                handleLike(item.post_id);
              } catch (error) {
                console.error('Error toggling like:', error);
              }
            }}
          />
          <FontAwesome5
            name="comment"
            color="black"
            size={20}
            style={styles.iconButton}
            onPress={() => openCommentBox(item.post_id, item.comments)}
          />
          <FontAwesome5
            name="paper-plane"
            color="black"
            size={20}
            style={styles.iconButton}
          />
        </View>
        <Title style={styles.title}>{item.content}</Title>
        <Caption style={styles.caption}>
          {`${item.likes} ${item.likes === 1 ? 'like' : 'likes'} • ${item.comments ? item.comments.length : 0} comments`}
        </Caption>
        {selectedPostId === item.post_id && (
          <View style={styles.commentsContainer}>
            <Text style={styles.commentsTitle}>Comments:</Text>
            {item.comments.length > 0 ? (
              item.comments.map((comment) => (
                <TouchableOpacity key={comment.comment_id} style={styles.commentItem}>
                  <Text style={styles.commentUsername}>
                    {comment.user?.username || 'Unknown User'}:
                  </Text>
                  <Text>{comment.content}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No comments available</Text>
            )}
          </View>
        )}
      </Card.Content>
    </Card>
  );

  if (showLoading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.headerContainer}>
        <Appbar.Content title="FranchiseConnect" titleStyle={styles.headerText} />
      </Appbar.Header>

      {posts.length === 0 && <Text style={styles.errorText}>{error || 'Failed to fetch posts. Please try again later.'}</Text>}

      <FlatList
        data={posts}
        keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
        renderItem={renderItem}
        style={styles.postList}
      />

      <BottomNavbar />
      <Portal>
        <Modal visible={isCommentBoxOpen} animationType="slide" transparent>
          <View style={styles.commentBox}>
            <TouchableOpacity style={styles.closeButton} onPress={closeCommentBox}>
              <FontAwesome5 name="times" size={20} color="#000" />
            </TouchableOpacity>
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
              value={comment}
              onChangeText={(text) => setComment(text)}
              multiline
              style={styles.commentInput}
            />
            <Button
              mode="contained"
              onPress={() => addComment.mutate({ postId: selectedPostId, text: comment })}
              style={styles.postButton}
            >
              Post
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postList: {
    flex: 1,
    padding: 8,
  },
  card: {
    marginBottom: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  cardCover: {
    height: 280,
  },
  cardContent: {
    padding: 10,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  caption: {
    fontSize: 14,
    color: '#777',
  },
  headerContainer: {
    backgroundColor: '#3498db',
    elevation: 0,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
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
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20
  },
  commentsContainer: {
    marginTop: 8,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8, // Add margin to separate avatar and username
  },
  avatar: {
    marginRight: 4, // Add margin to separate avatar and username
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconButton: {
    marginRight: 8,
  },
});

export default PostFeed;
