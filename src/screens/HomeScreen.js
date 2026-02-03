import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, ImageBackground } from 'react-native';
import { FontAwesome, MaterialIcons, FontAwesome5 } from '@expo/vector-icons'; // Import icons
import { Tooltip } from 'react-native-elements'; // Import Tooltip
import * as Animatable from 'react-native-animatable'; // Import Animatable
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import { useSettings } from './SettingsContext';
import Themes, {
  getThemeStyles,
  getThemeTextStyles,
} from './Themes'; // Import themes

const HomeScreen = ({ navigation }) => {
  const { settings } = useSettings();
  const currentTheme = Themes[settings.themeIndex];
  const themeStyles = getThemeStyles(currentTheme);
  const [lastReadSurah, setLastReadSurah] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(0);

  const loadLastReadData = async () => {
    try {
      const savedLastReadSurah = await AsyncStorage.getItem('lastReadSurah');
      const savedProgressPercentage = await AsyncStorage.getItem('progressPercentage');
      if (savedLastReadSurah) setLastReadSurah(JSON.parse(savedLastReadSurah));
      if (savedProgressPercentage) setProgressPercentage(JSON.parse(savedProgressPercentage));
    } catch (e) {
      console.error("Failed to load data", e);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadLastReadData();
    }, [])
  );

  return (
     <ImageBackground
      source={{ uri: currentTheme.backgroundImage }}
      style={styles.backgroundImage}
    >
    <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.iconContainer}>
          <Image
            source={{ uri: currentTheme.mainImage }}
            style={styles.icon}
          />
        </View>

        {/* Start Reading Button */}
          <Animatable.View animation="pulse" duration={3000}>
            <TouchableOpacity
              style={[
                styles.startButton,
                { backgroundColor: currentTheme.buttonBGColor },
                { shadowColor: currentTheme.shadowColor}
                ]}
              onPress={() => navigation.navigate('Quran')}
            >
              <Text style={[
                styles.startButtonText,
                themeStyles.startButtonText,
              ]}>Read the Holy Quran</Text>
            </TouchableOpacity>
          </Animatable.View>

        {/* Resume Button */}
          <Animatable.View animation="pulse" duration={3000}>
            <TouchableOpacity style={[
              styles.resumeButton,
             { backgroundColor: currentTheme.buttonBGColor },
             { shadowColor: currentTheme.shadowColor}
              ]} onPress={() => navigation.navigate('Progress')}>
              <Text style={[
                styles.resumeButtonText,
                themeStyles.resumeButtonText,
                                ]}>Track Progress</Text>
            </TouchableOpacity>
          </Animatable.View>
        

        {/* Last Read Location Card */}
        {lastReadSurah && (
          <View style={styles.card}>
            <Text style={styles.lastReadText}>Last Read ✦ {lastReadSurah}</Text>
          </View>
        )}

        {/* Total Progress Card */}
        {lastReadSurah && (
          <View style={[styles.card, styles.totalProgressCard]}>
            <Text style={styles.lastReadText}>Total Progress ✦ {progressPercentage}%</Text>
          </View>
        )}

        {/* Small Buttons */}
        <View style={styles.smallButtonsContainer}>
            <Animatable.View animation="bounceIn" duration={3000}>
              <TouchableOpacity style={[
                styles.smallButton,
                themeStyles.smallButton,
                 { color: currentTheme.backgroundColor }
              ]} 
              onPress={() => navigation.navigate('Bookmarks')}>
                <FontAwesome name="bookmark" size={24} color="white" />
              </TouchableOpacity>
            </Animatable.View>
      
            <Animatable.View animation="bounceIn" duration={3000}>
              <TouchableOpacity style={[
                styles.smallButton,
                themeStyles.smallButton,
                 { color: currentTheme.backgroundColor }
              ]}  onPress={() => navigation.navigate('Favorites')}>
                <FontAwesome name="star" size={24} color="white" />
              </TouchableOpacity>
            </Animatable.View>
         
            <Animatable.View animation="bounceIn" duration={3000}>
              <TouchableOpacity style={[
                styles.smallButton,
                themeStyles.smallButton,
                 { color: currentTheme.backgroundColor }
              ]}  onPress={() => navigation.navigate('Archives')}>
                <FontAwesome5 name="archive" size={24} color="white" />
              </TouchableOpacity>
            </Animatable.View>
          
            <Animatable.View animation="bounceIn" duration={3000}>
              <TouchableOpacity style={[
                styles.smallButton,
                themeStyles.smallButton,
                 { Color: currentTheme.backgroundColor }
              ]}  onPress={() => navigation.navigate('Settings')}>
                <FontAwesome name="cog" size={24} color="white" />
              </TouchableOpacity>
            </Animatable.View>
      
        </View>

        {/* Social Media Icons */}
        <View style={styles.socialIconsContainer}>
          <Animatable.View animation="bounceIn" duration={3000}>
              <TouchableOpacity style={styles.socialIcon}>
                <FontAwesome name="share-alt" size={24} color={currentTheme.socialIconColor} />
              </TouchableOpacity>
           </Animatable.View>
  
            <Animatable.View animation="bounceIn" duration={3000}>
              <TouchableOpacity style={styles.socialIcon}>
                <MaterialIcons name="web" size={24} color={currentTheme.socialIconColor} />
              </TouchableOpacity>
            </Animatable.View>
          
            <Animatable.View animation="bounceIn" duration={3000}>
              <TouchableOpacity style={styles.socialIcon}>
                <FontAwesome name="instagram" size={24} color={currentTheme.socialIconColor} />
              </TouchableOpacity>
            </Animatable.View>
         
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  iconContainer: {
    alignItems: 'center', // Center the icon horizontally
    marginBottom: 40, // Reduce space between the icon and the button
    marginTop: 50, // Reduce space above the icon
  },
  icon: {
    width: 260, // Set the width of the icon
    height: 260, // Set the height of the icon
    resizeMode: 'contain', // Ensure the image maintains its aspect ratio
  },
  startButton: {
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 30,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width: '80%',
    alignSelf: 'center',
  },
  resumeButton: {
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 40, 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    width: '80%',
    alignSelf: 'center',
  },
  startButtonText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SF-Pro', 
  },
  resumeButtonText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'SF-Pro',
  },
  card: {
    backgroundColor: '#F0E68C', // Yellow background
    padding: 7.5, // Half the original padding
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center', // Center the content horizontally
    justifyContent: 'center', // Center the content vertically
    width: '60%', // Set the width to 60%
    alignSelf: 'center', // Center the card horizontally
  },
  totalProgressCard: {
    marginBottom: 40, // Increase space between the total progress card and the icons
  },
  lastReadText: {
    fontSize: 14, // Smaller font
    fontStyle: 'italic', // Italic text
    color: '#000000', // Black text
    fontFamily: 'SF-Pro', // Replace with your custom font
    textAlign: 'center', // Center the text
  },
  centeredCard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
  smallButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the buttons horizontally
    marginBottom: 20, // Increase space between the second card and the icons
  },
  smallButton: {
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 18, // Increase horizontal margin for better spacing
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the icons horizontally
    marginTop: 10,
    paddingHorizontal: 0, // Add padding to distribute icons evenly
  },
  socialIcon: {
    padding: 10,
    marginHorizontal: 17, // Increase horizontal margin for better spacing
  },
  tooltipText: {
    color: '#FFFFFF', // White text
    fontSize: 14,
  },
});

export default HomeScreen;