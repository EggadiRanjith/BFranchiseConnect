import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Appbar, Avatar, Modal, Portal, Button, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabView, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import BottomNavbar from '../components/BottomNavBar';
import LoadingIndicator from '../components/loading';


const NotificationPage = () => {
  const navigator = useNavigation();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'messages', title: 'Messages' },
    { key: 'notifications', title: 'Notifications' },
  ]);

  const [notifications, setNotifications] = useState({ messages: [], otherNotifications: [] });
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem('userId');
        setUserId(storedUserId);
      } catch (error) {
        console.error('Error retrieving user ID from AsyncStorage:', error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (userId) {
          const response = await fetch(`https://franchiseconnectt.up.railway.app/api/notifications/${userId}`);
          const data = await response.json();

          const messages = data.filter(notification => notification.type === 'message');
          const otherNotifications = data.filter(notification => notification.type !== 'message');

          setNotifications({ messages, otherNotifications });
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [userId]);

  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        const response = await fetch(`https://franchiseconnectt.up.railway.app/api/messages/${userId}`);
        const data = await response.json();
        console.log(data);
        setRecentChats(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent chats:', error);
        setLoading(false);
      }
    };

    fetchRecentChats();
  }, []);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'messages':
        return <RecentChats />;
      case 'notifications':
        return <NotificationTab title="Notifications" notifications={notifications.otherNotifications} />;
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
    />
  );

  const Header = () => (
    <Appbar.Header style={styles.appBar}>
      <Appbar.Content title="FranchiseConnect" titleStyle={styles.appBarTitle} />
    </Appbar.Header>
  );

  const NotificationTab = ({ title, notifications = [] }) => {
    const trimDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    };

    const sortedNotifications = notifications.sort((a, b) => new Date(b.notification_timestamp) - new Date(a.notification_timestamp));

    return (
      <ScrollView style={styles.tabContent}>
        {sortedNotifications.length > 0 ? (
          sortedNotifications.map((notification) => (
            <NotificationCard
              key={notification.notification_id}
              notification={notification}
              onPress={handleNotificationPress}
            />
          ))
        ) : (
          <Text>No {title.toLowerCase()} available</Text>
        )}
      </ScrollView>
    );
  };

  const NotificationCard = ({ notification, onPress }) => {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isRead, setIsRead] = useState(notification.read_status === 'read');

    const showModal = () => {
      setModalVisible(true);
      if (!isRead) {
        setIsRead(true);
      }
    };

    const hideModal = () => setModalVisible(false);

    const cardStyle = isRead ? styles.notificationCard : styles.unreadNotificationCard;

    const handlePress = async () => {
      showModal();
      if (!isRead) {
        setIsRead(true);
        try {
          const response = await fetch(`https://franchiseconnectt.up.railway.app/api/notifications/${notification.notification_id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ read_status: 'read' }),
          });
          if (response.ok) {
            console.log(`Notification ${notification.notification_id} marked as read`);
          } else {
            console.error(`Failed to update notification ${notification.notification_id} status`);
          }
        } catch (error) {
          console.error('Error updating notification status:', error);
        }
      }
      onPress(notification);
    };

    return (
      <Card style={cardStyle}>
        <Card.Content>
          <TouchableOpacity onPress={handlePress}>
            <View style={styles.notificationContent}>
              <Avatar.Image source={{ uri: notification.sender.profile_picture }} size={50} />
              <View style={styles.notificationText}>
                <Text>{notification.notification_content}</Text>
                <Text style={styles.timestamp}>{notification.notification_timestamp}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Card.Content>

        <Portal>
          <Modal visible={isModalVisible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
            <Text style={styles.modalTitle}>Full Data</Text>
            <Text style={styles.modalText}>{notification.notification_content}</Text>
            <Button mode="contained" onPress={() => handleViewDetails(notification.post_id, hideModal,notification.type,notification.sender_id,notification.receiver_id )} style={styles.closeButton}>
              View
            </Button>
            <Button mode="contained" onPress={hideModal} style={styles.closeButton}>
              Close
            </Button>
          </Modal>
        </Portal>
      </Card>
    );
  };

  const handleViewDetails = (postId, hideModal,type,sender,reciever) => {
  // Close the modal first
  hideModal();

  try {
    // Navigate based on the notification type
    switch (type) {
      case 'Application':
        navigator.navigate('ChatScreen', {
          userId: sender,
          otherUserId: reciever,
        });
        break;
      case 'ApplicationStatusUpdate':
          navigator.navigate('ChatScreen', {
            userId: reciever,
            otherUserId: sender,
          });
          break;
      case 'LIKE':
        // Navigate to the screen for new form submissions
        navigator.navigate('SinglepostDetails', {
          post_id: postId,
        });
        break;
        case 'LIKE':
          // Navigate to the screen for new form submissions
          navigator.navigate('SinglepostDetails', {
            post_id: postId,
          });
          break;
    }
  } catch (error) {
    console.error('Error navigating:', error);
  }
};
  const RecentChats = () => {
    console.log('Recent Chats:', recentChats);

    // Check if recentChats is not null or undefined and contains the 'chattedUserProfiles' property
    if (!recentChats || !recentChats.chattedUserProfiles) {
      return  <LoadingIndicator />; 
    }

    const chats = recentChats.chattedUserProfiles; // Access the 'chattedUserProfiles' property

    const truncateMessage = (message, maxLength) => {
      if (!message) return ''; // Return empty string if message is null or undefined
      if (message.length > maxLength) {
        return message.slice(0, maxLength) + '...';
      } else {
        return message;
      }
    };

    const formatMessage = (message) => {
      return message.replace(/(\r\n|\n|\r)/gm, ' ');
    };

    const formatLastMessageTime = (timestamp) => {
      const date = new Date(timestamp);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    };
    

    return (
      <ScrollView style={styles.tabContent}>
        {loading ? (
          <LoadingIndicator />
        ) : chats.length > 0 ? (
          chats.map((chat) => {
            return (
              <TouchableOpacity key={chat.user_id} onPress={() => handleChatPress(chat)}>
                <Card style={styles.chatItem}>
                  <Card.Content>
                    <View style={styles.chatContent}>
                      <Avatar.Image source={{ uri: chat.profile_picture }} size={50} />
                      <View style={styles.chatText}>
                        <Text>{chat.username}</Text>
                        {chat.last_message && chat.last_message !== '' && (
                          <View style={styles.lastMessage}>
                            <Text numberOfLines={1} style={styles.lastMessageText}>
                              {truncateMessage(formatMessage(chat.last_message), 40)}
                            </Text>
                            <Text style={styles.lastMessageTime}>
                              {formatLastMessageTime(chat.last_message_time)}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text>No recent chats available</Text>
        )}
      </ScrollView>
    );
  };

  const handleChatPress = async (chat) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      navigator.navigate('ChatScreen', {
        userId: userId,
        otherUserId: chat.user_id,
      });
    } catch (error) {
      console.error('Error navigating to chat screen:', error);
    }
  };

  const handleNotificationPress = async () => {
    console.log('Notification pressed:');
  };

  return (
    <View style={styles.container}>
      <Header />
      {loading ? (
        <LoadingIndicator />
      ) : (
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: 300 }}
          renderTabBar={renderTabBar}
        />
      )}
      <BottomNavbar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  appBar: {
    backgroundColor: '#3498db',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    elevation: 0,
  },
  appBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  tabIndicator: {
    backgroundColor: 'white',
  },
  tabBar: {
    backgroundColor: '#3498db',
  },
  tabLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  tabContent: {
    padding: 16,
  },
  notificationCard: {
    marginBottom: 16,
    borderRadius: 8,
  },
  unreadNotificationCard: {
    backgroundColor: '#e1f5fe',
    marginBottom: 16,
    borderRadius: 8,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationText: {
    marginLeft: 16,
  },
  timestamp: {
    color: '#888',
    marginTop: 4,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
  },
  chatItem: {
    marginBottom: 16,
    borderRadius: 8,
  },
  chatContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatText: {
    marginLeft: 16,
  },
});

export default NotificationPage;
