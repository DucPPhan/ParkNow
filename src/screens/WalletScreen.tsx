// src/screens/WalletScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import TransactionListItem, { Transaction } from '../components/TransactionListItem';

// Dữ liệu giả
const TRANSACTIONS_DATA: Transaction[] = [
    { id: '1', title: 'Nạp tiền vào ví', date: '22/09/2025', amount: 200000, type: 'deposit' },
    { id: '2', title: 'Thanh toán đỗ xe Ga Sài Gòn', date: '21/09/2025', amount: 30000, type: 'payment' },
    { id: '3', title: 'Thanh toán đỗ xe Nowzone', date: '20/09/2025', amount: 15000, type: 'payment' },
    { id: '4', title: 'Nạp tiền vào ví', date: '19/09/2025', amount: 100000, type: 'deposit' },
];

type TabType = 'all' | 'deposit' | 'payment';

const WalletScreen = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Lọc danh sách giao dịch dựa trên tab đang hoạt động
  const filteredTransactions = useMemo(() => {
    if (activeTab === 'all') return TRANSACTIONS_DATA;
    return TRANSACTIONS_DATA.filter(t => t.type === activeTab);
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Ví ParkNow</Text>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Số dư khả dụng</Text>
          <Text style={styles.balanceAmount}>255,000đ</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Nạp tiền')}>
            <Icon name="plus-circle" size={24} color="#3498db" />
            <Text style={styles.actionText}>Nạp tiền</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Rút tiền')}>
            <Icon name="arrow-right-circle" size={24} color="#2ecc71" />
            <Text style={styles.actionText}>Rút tiền</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>Lịch sử giao dịch</Text>
          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => setActiveTab('all')} style={[styles.tabButton, activeTab === 'all' && styles.activeTab]}>
                <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>Tất cả</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('deposit')} style={[styles.tabButton, activeTab === 'deposit' && styles.activeTab]}>
                <Text style={[styles.tabText, activeTab === 'deposit' && styles.activeTabText]}>Nạp tiền</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveTab('payment')} style={[styles.tabButton, activeTab === 'payment' && styles.activeTab]}>
                <Text style={[styles.tabText, activeTab === 'payment' && styles.activeTabText]}>Thanh toán</Text>
            </TouchableOpacity>
          </View>

          {/* Transaction List */}
          {filteredTransactions.map(item => (
            <TransactionListItem key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#f8f8f8',
    },
    container: {
      padding: 20,
    },
    headerTitle: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 20,
    },
    balanceCard: {
      backgroundColor: '#3498db',
      borderRadius: 15,
      padding: 25,
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#3498db',
      shadowOpacity: 0.4,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 5 },
    },
    balanceLabel: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.8)',
    },
    balanceAmount: {
      fontSize: 36,
      fontWeight: 'bold',
      color: 'white',
      marginTop: 5,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 25,
      marginBottom: 15,
    },
    actionButton: {
      alignItems: 'center',
    },
    actionText: {
      marginTop: 8,
      fontSize: 15,
      color: '#333',
      fontWeight: '600',
    },
    historyContainer: {
        marginTop: 20,
    },
    historyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        padding: 4,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
    },
    activeTab: {
        backgroundColor: '#ffffff',
        elevation: 1
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
    },
    activeTabText: {
        color: '#3498db',
    },
  });

export default WalletScreen;