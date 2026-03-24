import { useBackendStatus } from '@/stores/backend-status';
import { COLORS } from '@/styles/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';

export function ServiceUnavailableAlert() {
  const { isOutageModalVisible, hideOutageModal } = useBackendStatus();
  const animation = useRef(new Animated.Value(0)).current;
  const [shouldRender, setShouldRender] = useState(isOutageModalVisible);

  useEffect(() => {
    if (isOutageModalVisible) {
      setShouldRender(true);
    }

    Animated.timing(animation, {
      toValue: isOutageModalVisible ? 1 : 0,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && !isOutageModalVisible) {
        setShouldRender(false);
      }
    });
  }, [animation, isOutageModalVisible]);

  if (!shouldRender) {
    return null;
  }

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-24, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <Animated.View
      pointerEvents={isOutageModalVisible ? 'auto' : 'none'}
      style={[
        styles.toastContainer,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.content}>
        <Pressable style={styles.closeButton} onPress={hideOutageModal}>
          <MaterialCommunityIcons name="close" size={22} color={COLORS.grayDark} />
        </Pressable>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="weather-pouring"
            size={34}
            color={COLORS.lightBlue}
          />
          <Text style={styles.title}>Serviço indisponível</Text>
        </View>
        <Text style={styles.message}>Tente novamente em alguns instantes.</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 20,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.gray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 8,
  },
  content: {
    position: 'relative',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 20
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.black,
    paddingRight: 28,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.grayDark,
    paddingRight: 20,
  },
});
