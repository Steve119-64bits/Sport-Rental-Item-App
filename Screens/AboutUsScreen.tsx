import React from 'react';
import { Platform } from 'react-native';
import {Text, View, Image, Linking, StyleSheet} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const App = () => {
    let pic = {
        uri: 'https://reactnative.dev/img/tiny_logo.png',
    };


const openMapURL = (latitude: any, longitude: any) => {
  console.log('Open Map');
  Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
}

const openFacebookURL = () => {
    const fbURL : string = 'https://www.facebook.com/';
    Linking.openURL(fbURL);
}

const openInstagramURL = () => {
    const igURL : string = 'https://www.instagram.com/';
    Linking.openURL(igURL);
}

const openYoutubeURL = () => {
  const ytURL : string = 'https://www.youtube.com/@stevee7743';
  Linking.openURL(ytURL);
}

  return (
    <View style={styles.container}>
      <Image style={{height:750, width:740, position:'absolute' , top: -30, opacity: 0.2}} source={require('../assets/companyLogo.png')}/>
      <Text style={styles.companyName}>PickMe</Text>
      <Text style={styles.intro}><Text style={{fontWeight:'bold', fontSize:16}}>PickMe</Text> is your ultimate companion for all things pickleball. Whether you're a seasoned player or just discovering the sport, PickMe makes it easy to rent equipment, book courts, and connect with players—all in one simple app.

            Born from a passion for the game and a desire to make pickleball more accessible, PickMe brings convenience to your fingertips. No gear? No problem. Need a court? We’ve got you covered. 
            
            {'\n'}{'\n'}{'\n'}With just a few taps, you can find nearby rental spots, schedule your next match, and even join local pickleball communities.

            At PickMe, we believe in promoting an active lifestyle, building connections through sport, and making pickleball a game everyone can play—anytime, anywhere.

            Play smarter. Rent easier. PickMe.

      </Text>
      <Text>  
        <Text style={{marginTop: 20, fontSize: 14, textAlign: 'center'}}></Text>
            Contact us on: <Text style={{fontWeight: 'bold'}}>support@pickme.com</Text>
            <Ionicons name="mail-outline" style={styles.email}/>
            {'\n'}
            {'\n'}
        </Text>
        <Text>Follow us on:</Text>
      <View>
        <TouchableWithoutFeedback style={styles.touchableLogos}>
          <Ionicons style={styles.facebook} name="logo-facebook" onPress = {openFacebookURL}/>
          <Ionicons style={styles.instagram} name="logo-instagram" onPress={openInstagramURL}/>
          <Ionicons style={styles.youtube} name="logo-youtube" onPress={openYoutubeURL}/>
        </TouchableWithoutFeedback>
      </View>
      <View style={{ marginTop: 50, justifyContent: 'center' }}>
        <TouchableWithoutFeedback onPress={() => { openMapURL(3.0402, 101.7944) }}>
          <View style={styles.mapButton}>
            <Ionicons name='navigate-circle' size={35} color="black" />
            <Text style={{ fontSize: 25, color: 'black', fontWeight: 'bold' }}>Map</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        fontFamily: Platform.select({
            ios: 'System',
            android: 'Roboto',
          }),
          fontSize: 16,
    },
    companyName: {
        fontSize:30, 
        fontWeight:'bold', 
        color:'black'
    },
    intro:{
        fontSize:15, 
        color:'black',
        lineHeight:20, 
        padding:30, 
        textAlign:'justify'
    },
    email:{
        fontSize: 20, 
        color:'black', 
    },
    touchableLogos:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        marginLeft: 60,
        width: '60%',
    },
    facebook:{
      fontSize: 30,
      color: '#3b5998',
    },
    instagram:{
      fontSize: 30,
      color: '#E1306C',
    },
    youtube:{
      fontSize: 30,
      color: '#FF0000',
    },
    mapButton: {
      height: 45,
      width: 220,
      borderRadius: 40,
      backgroundColor: '#80FFFC',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
});

export default App;