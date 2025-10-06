import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Platform, SafeAreaView, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { RegistrationStackParamList } from '../../navigation/types';
import { useRegistration } from '../../context/RegistrationContext';
import Button from '../../components/Button';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = StackNavigationProp<RegistrationStackParamList, 'Step2_PersonalInfo'>;

const Step2_PersonalInfoScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const { updateRegistrationData } = useRegistration();
  
    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState(new Date(2000, 0, 1));
    const [gender, setGender] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
  
    const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
      const currentDate = selectedDate || dateOfBirth;
      setShowDatePicker(Platform.OS === 'ios');
      setDateOfBirth(currentDate);
    };
  
    const handleNext = () => {
      if (!name || !gender) {
        Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin.");
        return;
      }
      updateRegistrationData({ name, dateOfBirth, gender });
      navigation.navigate('Step3_IDCard');
    };

  return (
    <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
              <Text style={styles.title}>Về bạn</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={22} color="#888" style={styles.icon} />
                <TextInput style={styles.input} placeholder="Họ và tên" value={name} onChangeText={setName} />
              </View>

              <Text style={styles.label}>Giới tính</Text>
              <View style={styles.genderContainer}>
                <TouchableOpacity 
                    style={[styles.genderButton, gender === 'Nam' && styles.genderButtonSelected, { marginRight: 10 }]}
                    onPress={() => setGender('Nam')}
                >
                    <Text style={[styles.genderText, gender === 'Nam' && styles.genderTextSelected]}>Nam</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.genderButton, gender === 'Nữ' && styles.genderButtonSelected]}
                    onPress={() => setGender('Nữ')}
                >
                    <Text style={[styles.genderText, gender === 'Nữ' && styles.genderTextSelected]}>Nữ</Text>
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.inputContainer}>
                <Ionicons name="calendar-outline" size={22} color="#888" style={styles.icon} />
                <Text style={styles.dateText}>Ngày sinh: {dateOfBirth.toLocaleDateString('vi-VN')}</Text>
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  maximumDate={new Date(2010, 11, 31)}
                />
              )}
            </ScrollView>
            <View style={styles.footer}>
              <Button title="Tiếp theo" onPress={handleNext} />
            </View>
        </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },
    container: { flex: 1 },
    content: {
      flexGrow: 1,
      padding: 24,
      justifyContent: 'center'
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      textAlign: 'center',
      marginBottom: 30,
    },
    label: {
      fontSize: 14,
      color: 'gray',
      marginBottom: 10,
      marginLeft: 5
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#eee',
      paddingHorizontal: 15,
      height: 55,
      marginBottom: 20,
    },
    icon: {
      marginRight: 10,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: '#333',
    },
    dateText: {
      fontSize: 16,
      color: '#333',
    },
    genderContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    genderButton: {
      flex: 1,
      height: 55,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f9f9f9',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#eee',
    },
    genderButtonSelected: {
      backgroundColor: '#eaf5ff',
      borderColor: '#00B14F',
    },
    genderText: {
      fontSize: 16,
      color: '#333',
    },
    genderTextSelected: {
      color: '#00B14F',
      fontWeight: 'bold',
    },
    footer: {
      padding: 24,
      borderTopWidth: 1,
      borderTopColor: '#f0f0f0'
    },
});


export default Step2_PersonalInfoScreen;