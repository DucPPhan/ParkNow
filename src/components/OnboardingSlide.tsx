import React from 'react';
import {View, Text, StyleSheet, useWindowDimensions} from 'react-native';

const OnboardingSlide = ({item}: any) => {
  const {width} = useWindowDimensions();
  const {SvgComponent, title, description} = item;

  return (
    <View style={[styles.container, {width}]}>
      <SvgComponent width={width * 0.8} height="50%" />
      <View style={{width: '80%'}}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
    fontSize: 28,
    marginBottom: 10,
    color: '#493d8a',
    textAlign: 'center',
  },
  description: {
    fontWeight: '300',
    color: '#62656b',
    textAlign: 'center',
    paddingHorizontal: 20,
    fontSize: 16,
  },
});

export default OnboardingSlide;