import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Avatar, Card, Title, IconButton, Caption } from 'react-native-paper'; // Removed Appbar import
import { useNavigation } from '@react-navigation/native';
import BottomNavbar from '../components/BottomNavBar'; // Importing the BottomNavbar component
import Header from '../components/Header'; // Importing the Header component

const PostDetailsScreen = ({ route }) => {
  const { post_id } = route.params;
  const [post, setPost] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchPostData(post_id);
  }, [post_id]);

  const fetchPostData = async (postId) => {
    try {
      const postResponse = await fetch(`https://franchiseconnectt.up.railway.app/api/posts/${postId}`);
      const postData = await postResponse.json();
      setPost(postData);
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };

  const navigateToProfile = (userId) => {
    navigation.navigate('Profiles', { userId });
  };

  if (!post) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="FranchiseConnect" /> 
      <ScrollView>
        <View style={styles.postHeader}>
          <Avatar.Image
            source={{ uri: post.user?.profile_picture }}
            size={40}
            style={styles.avatar}
          />
          <TouchableOpacity onPress={() => navigateToProfile(post.user?.user_id)}>
            <Title style={styles.userName}>{post.user?.username || 'Unknown User'}</Title>
          </TouchableOpacity>
        </View>

        <Card>
          <Card.Cover source={{ uri: post.image }} style={styles.cardCover} />
          <Card.Content style={styles.cardContent}>
            <View style={styles.interactionContainer}>
              <IconButton
                icon={post.isLiked ? 'heart' : 'heart-outline'}
                color={post.isLiked ? 'red' : '#000'}
                size={20}
                onPress={() => console.log('Like pressed')}
              />
              <Text style={styles.iconText}>{post.likes}</Text>
              <IconButton
                icon="comment"
                color="#000"
                size={20}
                onPress={() => console.log('Comment pressed')}
              />
              <Text style={styles.iconText}>{post.comments.length}</Text>
            </View>
            <Title style={styles.title}>{post.content}</Title>
            <Caption style={styles.caption}>
              {`${post.likes} ${post.likes === 1 ? 'like' : 'likes'} • ${post.comments.length} comments`}
            </Caption>

            <View style={styles.commentsContainer}>
              <Text style={styles.commentsTitle}>Comments:</Text>

              {post.comments.length > 0 ? (
                post.comments.map((comment, index) => (
                  <TouchableOpacity key={index} style={styles.commentItem}>
                    <Avatar.Image
                      source={{ uri: comment.user?.profile_picture }}
                      size={20}
                      style={styles.commentProfileImage}
                    />
                    <View style={styles.commentContent}>
                    <TouchableOpacity onPress={() => navigateToProfile(post.user?.user_id)}>
                      <Text style={styles.commentUsername}>{comment.user?.username}</Text>
                      </TouchableOpacity>
                      <Text>{comment.content}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>No comments available</Text>
              )}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <BottomNavbar /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
  },
  avatar: {
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardCover: {
    height: 200,
  },
  cardContent: {
    padding: 10,
  },
  interactionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconText: {
    marginLeft: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  caption: {
    fontSize: 14,
    color: '#666',
  },
  commentsContainer: {
    marginTop: 10,
  },
  commentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  commentProfileImage: {
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    fontWeight: 'bold',
    marginRight: 5,
  },
});

export default PostDetailsScreen;
