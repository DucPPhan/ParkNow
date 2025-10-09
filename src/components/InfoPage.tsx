import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Section {
    title: string;
    content: string;
}

interface InfoPageProps {
    pageTitle: string;
    sections: Section[];
}

const InfoPage = ({ pageTitle, sections }: InfoPageProps) => {
    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.pageTitle}>{pageTitle}</Text>
                {sections.map((section, index) => (
                    <View key={index} style={styles.section}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Text style={styles.sectionContent}>{section.content}</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        padding: 24,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3498db',
        marginBottom: 8,
    },
    sectionContent: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
    },
});

export default InfoPage;