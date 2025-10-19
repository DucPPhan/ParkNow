import React, {useRef, useState} from 'react';
import {View, FlatList, StyleSheet, useWindowDimensions, Animated} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigation/types';
import Button from '../components/Button';
import slides from '../data/slides';
import OnboardingSlide from '../components/OnboardingSlide';
import Paginator from '../components/Paginator';
import { useAuth } from '../context/AuthContext';

type OnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Onboarding'
>;

type Props = {
  navigation: OnboardingScreenNavigationProp;
};

const OnboardingScreen = ({navigation}: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const {width} = useWindowDimensions();
  const { completeOnboarding } = useAuth();

  const viewableItemsChanged = useRef(({viewableItems}: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

  const scrollTo = async () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({index: currentIndex + 1});
    } else {
      // Đánh dấu đã xem onboarding và chuyển đến màn hình Login
      await completeOnboarding();
      navigation.replace('Login');
    }
  };

  const skip = async () => {
    // Đánh dấu đã xem onboarding và chuyển đến màn hình Login
    await completeOnboarding();
    navigation.replace('Login');
  };


  return (
    <View style={styles.container}>
      <View style={{flex: 3}}>
        <FlatList
          data={slides}
          renderItem={({item}) => <OnboardingSlide item={item} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          keyExtractor={item => item.id}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {x: scrollX}}}],
            {
              useNativeDriver: false,
            },
          )}
          scrollEventThrottle={32}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          ref={slidesRef}
        />
      </View>
      <Paginator data={slides} scrollX={scrollX} />
       <View style={styles.buttonContainer}>
        {currentIndex < slides.length - 1 && (
            <Button title="Bỏ qua" onPress={skip} type="secondary" style={styles.button}/>
        )}
        <Button
            title={currentIndex === slides.length - 1 ? "Bắt đầu" : "Tiếp theo"}
            onPress={scrollTo}
            style={styles.button}
        />
       </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    paddingBottom: 40,
  },
  button: {
      flex: 1,
      marginHorizontal: 5,
  }
});

export default OnboardingScreen;