import React, { useState } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const PullToRefreshWrapper = ({ children, onRefresh }) => {
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      onRefresh();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    onRefresh().then(() => {
      setRefreshing(false);
    });
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      {children}
    </ScrollView>
  );
};

export default PullToRefreshWrapper;
