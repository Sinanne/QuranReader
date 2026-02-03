// src/screens/About.js
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';

const About = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* Image at the top */}
      <Image
        source={{ uri: 'https://freeislamiccalligraphy.com/wp-content/uploads/2013/06/Allah-Square-Kufic.jpg' }}
        style={styles.topImage}
        resizeMode="contain"
      />
      
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('LangNotifSettings')}
      >
        <Ionicons name="notifications" size={24} color="#800020" style={styles.icon} />
        <Text style={styles.menuItemText}>Languages and Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('DisplaySettings')}
      >
        <MaterialIcons name="settings-display" size={24} color="#800020" style={styles.icon} />
        <Text style={styles.menuItemText}>Display Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('AudioSettings')}
      >
        <FontAwesome name="music" size={24} color="#800020" style={styles.icon} />
        <Text style={styles.menuItemText}>Audio Settings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('BookmarksAndFavorites')}
      >
        <FontAwesome name="bookmark" size={24} color="#800020" style={styles.icon} />
        <Text style={styles.menuItemText}>Bookmarks and Favorites</Text>
      </TouchableOpacity>
     
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('UnlockPremium')}
      >
        <FontAwesome name="unlock-alt" size={24} color="#800020" style={styles.icon} />
        <Text style={styles.menuItemText}>Unlock Premium Features</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('FundAppAndCharity')}
      >
        <FontAwesome name="support" size={24} color="#800020" style={styles.icon} />
        <Text style={styles.menuItemText}>Fund the App and Charity Actions</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('GiftApp')}
      >
        <FontAwesome name="gift" size={24} color="#800020" style={styles.icon} />
        <Text style={styles.menuItemText}>Gift the App to a Loved One</Text>
      </TouchableOpacity>
       <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('More')}
      >
        <Ionicons name="ellipsis-horizontal" size={24} color="#800020" style={styles.icon} />
        <Text style={styles.menuItemText}>More</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topImage: {
    width: '100%',
    height: 150,
    marginTop: 10, // Add space above the image
    marginBottom: 10, // Add more space below the image
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 18,
    color: '#000000', // Black color
  },
});

export default About;