import { useRef, useState } from 'react';
import { Animated } from 'react-native';

export const useNavigationManager = (navigation) => {
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible((prev) => !prev);
    Animated.timing(menuAnimation, {
      toValue: isMenuVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleNavigation = (screen) => {
    if (navigation) {
      navigation.navigate(screen);
    } else {
      console.warn('Navigation prop is not provided');
    }
  };

  return {
    menuAnimation,
    isMenuVisible,
    toggleMenu,
    handleNavigation,
  };
};