// src/components/TransactionListItem.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export type Transaction = {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'deposit' | 'payment'; // Nạp tiền hoặc thanh toán
};

interface TransactionListItemProps {
  item: Transaction;
}

const TransactionListItem = ({ item }: TransactionListItemProps) => {
  const isDeposit = item.type === 'deposit';
  const amountColor = isDeposit ? '#2ecc71' : '#e74c3c';
  const amountSign = isDeposit ? '+' : '-';
  const iconName = isDeposit ? 'arrow-down-left' : 'arrow-up-right';

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: isDeposit ? '#e7f7ef' : '#feeef0'}]}>
        <Icon name={iconName} size={20} color={amountColor} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <Text style={[styles.amount, { color: amountColor }]}>
        {amountSign} {item.amount.toLocaleString('vi-VN')}đ
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    padding: 12,
    borderRadius: 25,
    marginRight: 15,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  date: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionListItem;