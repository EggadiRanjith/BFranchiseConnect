import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { Avatar } from 'react-native-paper';
import io from 'socket.io-client';
import { useNavigation } from '@react-navigation/native';

// Default avatar URL
const DEFAULT_AVATAR_URL = 'https://example.com/default-avatar.png';

const ChatScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userId, otherUserId } = route.params;
  const [messages, setMessages] = useState([]);
  const [usersData, setUsersData] = useState({});
  const [inputText, setInputText] = useState('');
  const [applicationDetails, setApplicationDetails] = useState(null);
  const socket = useRef(null);

  useEffect(() => {
    console.log('Attempting WebSocket connection...');
    socket.current = io('wss://franchiseconnectt.up.railway.app');
  
// Inside the WebSocket connection setup
socket.current.on('message', (message) => {
  console.log('WebSocket message received:', message); // Log the raw message received
  try {
    const parsedMessage = JSON.parse(message);
    console.log('Parsed WebSocket message:', parsedMessage); // Log the parsed message
    // Handle the parsed message further
    handleIncomingMessage(parsedMessage); // Add this line to process incoming messages
  } catch (error) {
    console.error('Error parsing WebSocket message:', error);
  }
});
socket.current.on('connect', () => {
  console.log('WebSocket connected:', socket.current.id);
});

socket.current.on('disconnect', (reason) => {
  console.log('WebSocket disconnected:', reason);
});

socket.current.on('error', (error) => {
  console.error('WebSocket error:', error);
});

  
    return () => {
      if (socket.current) {
        console.log('Closing WebSocket connection...');
        socket.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        // Fetch user data for userId and otherUserId separately
        const [userData, otherUserData] = await Promise.all([
          fetch(`https://franchiseconnectt.up.railway.app/api/user/profile/${userId}`).then(response => response.json()),
          fetch(`https://franchiseconnectt.up.railway.app/api/user/profile/${otherUserId}`).then(response => response.json())
        ]);
        
        // Update usersData state with fetched user data
        setUsersData({
          [userId]: userData,
          [otherUserId]: otherUserData
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUsersData();
  }, [userId, otherUserId]);

  useEffect(() => {
    // Fetch initial messages
    fetchMessages();
  }, [userId, otherUserId]);

  useEffect(() => {
    // Fetch application details when the component mounts
    fetchApplicationDetailsForMessages();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      // Fetch messages from the server
      const response = await fetch(
        `https://franchiseconnectt.up.railway.app/api/messages/${userId}/${otherUserId}`
      );
      const messagesData = await response.json();
  
      const formattedMessages = messagesData.messages.map((msg) => {
        const isCurrentUser = msg.sender_id?.toString() === userId.toString();
        const senderName = isCurrentUser ? 'You' : usersData[msg.sender_id]?.username || 'User';
  
        return {
          _id: msg.message_id?.toString(),
          text: msg.message_content || '',
          createdAt: msg.timestamp ? new Date(msg.timestamp) : new Date(),
          user: {
            _id: msg.sender_id,
            name: senderName,
          },
          position: isCurrentUser ? 'right' : 'left',
        };
      });
  
      // Filter out any existing messages from the state to prevent duplicates
      const newMessages = formattedMessages.filter(msg => !messages.find(existingMsg => existingMsg._id === msg._id));
  
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      scrollFlatListToEnd();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  

  // Inside handleIncomingMessage function
  const handleIncomingMessage = (message) => {
    // Check if the message already exists in the state array
    const isDuplicateMessage = messages.some(msg => msg._id === message.message_id?.toString());
  
    // If the message is not a duplicate, add it to the state array
    if (!isDuplicateMessage) {
      const isCurrentUser = message.sender_id?.toString() === userId.toString();
      const senderName = isCurrentUser ? 'You' : usersData[message.sender_id]?.username || 'User';
  
      const newMessage = {
        _id: message.message_id?.toString() || uuidv4(), // Generate a UUID if _id is not present
        text: message.message_content || '',
        createdAt: message.timestamp ? new Date(message.timestamp) : new Date(),
        user: {
          _id: message.sender_id,
          name: senderName,
        },
        position: isCurrentUser ? 'right' : 'left',
      };
  
      // Log the new message being added to state
      console.log('Adding new message to state:', newMessage);
  
      // Update state asynchronously using the state updater function provided by setMessages
      setMessages(prevMessages => [...prevMessages, newMessage]);
  
      // Log the state after update using the state updater function
      setMessages(prevMessages => {
        console.log('Messagssses state after update:', prevMessages);
        return prevMessages;
      });
  
      // Scroll to the end of the list
      scrollFlatListToEnd();
    } else {
      // Log that a duplicate message was detected
      console.log('Duplicate message received, skipping...');
    }
  };
  
  

  const navigateToProfile = (userId) => {
    navigation.navigate('Profiles', { userId });
  };

  const onSend = async () => {
    // Validate input text
    if (!inputText.trim()) {
      return; // Prevent sending empty messages
    }
    
    try {
      // Optimistically add the new message to the state
      const newMessage = {
        _id: Math.random().toString(), // Generate a temporary ID
        text: inputText,
        createdAt: new Date(),
        user: {
          _id: userId,
          name: 'You',
        },
        position: 'right',
      };
    
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setInputText('');
      scrollFlatListToEnd();
    
      // Send message to the server
      const response = await fetch('https://franchiseconnectt.up.railway.app/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_id: userId,
          receiver_id: otherUserId,
          message_content: inputText,
          timestamp: new Date().toISOString(),
        }),
      });
    
      const result = await response.json();
    
      if (result.success && result.message.message_id) {
        // Update the temporary ID with the actual ID from the server response
        newMessage._id = result.message.message_id.toString();
    
        // Update the state with the new message ID from the server
        const updatedMessages = [...messages.filter(msg => msg._id !== newMessage._id), newMessage];
        setMessages(updatedMessages);
    
        // Remove the optimistic message from the state
        setMessages(prevMessages => prevMessages.filter(msg => msg._id !== newMessage._id));
    
        // Scroll to the end of the list
        scrollFlatListToEnd();
    
        // Send the message through WebSocket
        if (socket.current) {
          socket.current.send(JSON.stringify(result.message));
        }
      } else {
        console.log('Message sent, but unexpected response:', result);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  
  const scrollFlatListToEnd = () => {
    if (flatListRef.current) {
      const itemCount = messages.length;
      if (itemCount > 0) {
        flatListRef.current.scrollToIndex({ index: itemCount - 1, animated: true });
      }
    }
  };
  

  const goBack = () => {
    navigation.goBack();
  };

  const handleCancel = async (applicationId) => {
    if (!applicationId) {
      console.error('Application ID not found.');
      return;
    }
  
    try {
      const updateStatusUrl = `https://franchiseconnectt.up.railway.app/api/updateApplicationStatus/${applicationId}`;
      console.log('Update status URL:', updateStatusUrl);
      // Send request to update application status to 'cancelled' and investor verification status to 'cancelled'
      const response = await fetch(updateStatusUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ application_status: 'cancelled' }), // Assuming the backend API accepts status in the request body
      });
  
      if (!response.ok) {
        throw new Error('Failed to update application status.');
      }
      console.log('Application cancelled successfully.');
      fetchMessages();
    } catch (error) {
      console.error('Error cancelling application:', error);
    }
  };
  
  const handleAgree = async (applicationId) => {
    if (!applicationId) {
      console.error('Application ID not found.');
      return;
    }
  
    try {
      const updateStatusUrl = `https://franchiseconnectt.up.railway.app/api/updateApplicationStatus/${applicationId}`;
      console.log('Update status URL:', updateStatusUrl);
      // Send request to update application status to 'Agreed' and investor verification status to 'agreed'
      const response = await fetch(updateStatusUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ application_status: 'Agreed' }), // Assuming the backend API accepts status in the request body
      });
  
      if (!response.ok) {
        throw new Error('Failed to update application status.');
      }
      console.log('Application Agreed successfully.');
      fetchMessages();
    } catch (error) {
      console.error('Error Agreeing the application:', error);
    }
  };
  
  const handleCancelInvestor = async (applicationId) => {
    if (!applicationId) {
      console.error('Application ID not found.');
      return;
    }
  
    try {
      const updateStatusUrl = `https://franchiseconnectt.up.railway.app/api/updateApplicationStatus/${applicationId}`;
      console.log('Update status URL:', updateStatusUrl);
      // Send request to update application status to 'cancelled' and investor verification status to 'cancelled'
      const response = await fetch(updateStatusUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ investor_verification_status: 'cancelled' }), // Assuming the backend API accepts status in the request body
      });
  
      if (!response.ok) {
        throw new Error('Failed to update application status.');
      }
      console.log('Application cancelled investor successfully.');
      fetchMessages();
    } catch (error) {
      console.error('Error cancelling investor application:', error);
    }
  };
  
  const handleAgreeInvsetor = async (applicationId) => {
    if (!applicationId) {
      console.error('Application ID not found.');
      return;
    }
  
    try {
      const updateStatusUrl = `https://franchiseconnectt.up.railway.app/api/updateApplicationStatus/${applicationId}`;
      console.log('Update status URL:', updateStatusUrl);
      // Send request to update application status to 'Agreed' and investor verification status to 'agreed'
      const response = await fetch(updateStatusUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ investor_verification_status: 'agreed' }), // Assuming the backend API accepts status in the request body
      });
  
      if (!response.ok) {
        throw new Error('Failed to update application status.');
      }
      console.log('Application Agreed investor successfully.');
      fetchMessages();
    } catch (error) {
      console.error('Error Agreeing investor the application:', error);
    }
  };
  
  const extractApplicationId = (text) => {
    // Extracting application_id from text (assuming it follows a specific format)
    // Implement your logic to extract application_id from text
    // Example logic: Extracting digits after 'application_id:'
    const match = text.match(/application_id: (\d+)/);
    if (match && match[1]) {
      console.log(match[1]);
      return parseInt(match[1], 10);
    }
    return null; // Return null if application_id is not found or if the format doesn't match
  };

  const fetchApplicationDetails = async (applicationId) => {
    try {
      // Fetch application details from the server using the provided applicationId
      const response = await fetch(`https://franchiseconnectt.up.railway.app/api/applications/${applicationId}`);
      const applicationData = await response.json();
      // Update applicationDetails state with fetched data
      setApplicationDetails(applicationData);
    } catch (error) {
      console.error('Error fetching application details:', error);
    }
  };

  const fetchApplicationDetailsForMessages = async () => {
    // Iterate through messages and fetch application details
    for (const item of messages) {
      if (item.text.startsWith('New form submission')) {
        const applicationId = extractApplicationId(item.text);
        if (applicationId) {
          await fetchApplicationDetails(applicationId);
        }
      }
    }
  };

  const flatListRef = useRef(null);

  const renderItem = ({ item }) => {
  
    
    const isSender = item.position === 'right';
    
    return (
      <View style={isSender ? styles.sentMessage : styles.receivedMessage}>
        <View style={styles.messageContent}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
        {item.text.startsWith('Congratulations') && (
          <>
            {applicationDetails && applicationDetails.application && (
              <>
                {applicationDetails.application.investor_verification_status === 'pending' && (
                  !isSender ? (
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity style={styles.button} onPress={() => handleAgreeInvsetor(applicationDetails.application.application_id)}>
                        <Text style={styles.buttonText}>Agree</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.button} onPress={() => handleCancelInvestor(applicationDetails.application.application_id)}>
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={{ color: 'orange' }}>Pending</Text>
                  )
                )}
                {applicationDetails.application.investor_verification_status === 'cancelled' && (
                  <Text style={{ color: 'red' }}>Cancelled</Text>
                )}
                {applicationDetails.application.investor_verification_status === 'agreed' && (
                  <Text style={{ color: 'orange' }}>Agreed</Text>
                )}
              </>
            )}
          </>
        )}
        {item.text.startsWith('New form submission') && (
          <>
            {applicationDetails && applicationDetails.application && (
              <>
              {applicationDetails.application.application_status === 'pending' && (
                  !isSender ? (
                    <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => handleCancel(applicationDetails.application.application_id)}>
                    <Text style={styles.buttonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button} onPress={() => handleAgree(applicationDetails.application.application_id)}>
                    <Text style={styles.buttonText}>Agree</Text>
                  </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={{ color: 'orange' }}>Pending</Text>
                  )
                )}
                {applicationDetails.application.application_status === 'cancelled' && (
                  <Text style={{ color: 'red' }}>Cancelled</Text>
                )}
                {applicationDetails.application.application_status === 'agreed' && (
                  <Text style={{ color: 'orange' }}>Agreed</Text>
                )}
              </>
            )}
          </>
        )}
      </View>
    );
  };
  
  
  

  return (
    <View style={styles.container}>
      {/* User Info Section */}
      <View style={styles.userInfoContainer}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Avatar.Image
          size={40}
          source={{ uri: usersData[otherUserId]?.profile_picture || DEFAULT_AVATAR_URL }}
          style={styles.profilePicture}
        />
        <TouchableOpacity onPress={() => navigateToProfile(usersData[otherUserId]?.user_id)}>
          <Text style={styles.username}>{usersData[otherUserId]?.username || 'User'}</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Section */}
      <FlatList
  ref={flatListRef}
  data={messages}
  renderItem={renderItem}
  keyExtractor={(item, index) => item._id.toString() + index}
  initialNumToRender={5}
  maxToRenderPerBatch={5}
  windowSize={10}
  onContentSizeChange={() => {
    flatListRef.current.scrollToEnd({ animated: true });
  }}
  onLayout={() => {
    flatListRef.current.scrollToEnd({ animated: true });
  }}
/>


      {/* Input Toolbar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputToolbar}
      >
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={inputText}
          onChangeText={(text) => setInputText(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={onSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#87CEFA',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FDF5E6',
  },
  backButton: {
    marginRight: 10,
    fontSize: 20,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profilePicture: {
    marginLeft: 10,
    marginRight: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'blue',
    borderRadius: 10,
    margin: 5,
    padding: 10,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'green',
    borderRadius: 10,
    margin: 5,
    padding: 10,
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    color: 'white',
  },
  inputToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  input: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
