import { COLORS } from '@/styles/colors';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Easing, ViewProps } from 'react-native';

type Props = ViewProps & {
  children: React.ReactNode;
  isVisible: boolean;
};

const Modal = ({ children, isVisible }: Props) => {
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      style={[styles.modalContainer, { transform: [{ translateY }], opacity }]}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    bottom: 80,
    backgroundColor: 'white',
    borderTopStartRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    padding: 25,
    borderWidth: 1,
    borderColor: COLORS.gray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    zIndex: 5,
  },
});

export default Modal;
