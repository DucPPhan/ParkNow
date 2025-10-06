import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

const NotificationScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Trung tâm thông báo</Text>
        <Text style={styles.subtitle}>Chưa có thông báo nào.</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
  },
});

export default NotificationScreen;