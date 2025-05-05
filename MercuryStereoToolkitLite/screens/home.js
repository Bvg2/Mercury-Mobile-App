// See README.md for information about this file and how to make updates

import * as React from 'react';
import { StyleSheet, Text, View, Button, SafeAreaView, Image, Pressable, ScrollView, Linking} from 'react-native';


//link to external Mercury Stereo User Guide
const userGuideURL = 'https://www.mercurystereo.com/mobile/mobileguide.html';

// component for opening external links
const OpenURLLink = ({url, children}) => {
  const handlePress = React.useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Pressable onPress={handlePress} style={homeStyle.buttonAbout}><Text style={homeStyle.buttonTextAbout}>{children}</Text></Pressable>;
};

// Home screen of app
const HomeScreen = ({navigation}) => {

  

    return(
      <SafeAreaView style={homeStyle.container}>
        <ScrollView>
          {/*Title of the app*/}
          <Text style={homeStyle.textTitle} accessible={true} accessibilityLabel="Mercury Stereo Toolkit" accessibilityRole="text">Mercury Stereo Toolkit</Text>
          
          {/*Button to navigate to the Hyperfocal tab on the DOF screen*/}
          <Pressable onPress={() => navigation.navigate("DOFScreen", {tab: 0})} style={homeStyle.button} accessible={true} accessibilityLabel="Hyperfocal" accessibilityHint="Navigates to the hyperfocal calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/mercuryLogoBlackOnWhite.png')}
            />
            <Text style={homeStyle.buttonText}>HYPERFOCAL</Text>
          </Pressable>
          
          {/*Button to navigate to the DOF tab on the DOF screen*/}
          <Pressable onPress={() => navigation.navigate("DOFScreen", {tab: 1})} style={homeStyle.button} accessible={true} accessibilityLabel="Depth of field" accessibilityHint="Navigates to the depth of field calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/mercuryLogoBlackOnWhite.png')}
            />
            <Text style={homeStyle.buttonText}>DEPTH OF FIELD</Text>
          </Pressable>

          {/*Button to navigate to the Close Focus Calculator screen*/}
          <Pressable onPress={() => navigation.navigate("CloseFocusScreen")} style={homeStyle.button} accessible={true} accessibilityLabel="Depth range (close up)" accessibilityHint="Navigates to the close focus calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/ruler.png')}
            />
            <Text style={homeStyle.buttonText}>DEPTH RANGE (CLOSE UP)</Text>
          </Pressable>

          {/*Button to navigate to the Base Distance Calculator screen*/}
          <Pressable onPress={() => navigation.navigate("BaseScreen")}style={homeStyle.button} accessible={true} accessibilityLabel="Base distance (hypo/hyper)" accessibilityHint="Navigates to the base distance calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/base.png')}
            />
            <Text style={homeStyle.buttonText}>BASE DISTANCE (HYPO/HYPER)</Text>
          </Pressable>

          {/*Button to navigate to the Pinhole tab on the Reciprocity Calculator screen*/}
          <Pressable onPress={() => navigation.navigate("CombinedReciprocityScreen", {tab: 0})} style={homeStyle.button} accessible={true} accessibilityLabel="Pinhole" accessibilityHint="Navigates to the pinhole calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/timer.png')}
            />
            <Text style={homeStyle.buttonText}>PINHOLE</Text>
          </Pressable>
    

          {/*Button to navigate to the Reciprocity Only tab on the Reciprocity Calculator screen*/}
          <Pressable onPress={() => navigation.navigate("CombinedReciprocityScreen", {tab: 1})} style={homeStyle.button} accessible={true} accessibilityLabel="Reciprocity (long exposures)" accessibilityHint="Navigates to the reciprocity only calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/timer.png')}
            />
            <Text style={homeStyle.buttonText}>RECIPROCITY (LONG EXPOSURES)</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate("FilterScreen")} style={homeStyle.button} accessible={true} accessibilityLabel="Filter Calculator" accessibilityHint="Navigates to the filter calculator screen" accessibilityRole="button">
			<Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/timer.png')}
            />
            <Text style={homeStyle.buttonText}>Filter Calculator</Text>
          </Pressable>

          {/* The following two buttons are used to navigate to the separate Reciprocity and Pinhole calculator files*/}
          {/*Button to navigate to the Pinhole Calculator screen*
          <Pressable onPress={() => navigation.navigate("PinholeScreen", {tab: 0})} style={homeStyle.button} accessible={true} accessibilityLabel="Pinhole" accessibilityHint="Navigates to the pinhole calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/timer.png')}
            />
            <Text style={homeStyle.buttonText}>PINHOLE</Text>
          </Pressable>
    

          {/*Button to navigate to the Reciprocity Calculator screen
          <Pressable onPress={() => navigation.navigate("ReciprocityScreen", {tab: 1})} style={homeStyle.button} accessible={true} accessibilityLabel="Reciprocity (long exposures)" accessibilityHint="Navigates to the reciprocity only calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/timer.png')}
            />
            <Text style={homeStyle.buttonText}>RECIPROCITY (LONG EXPOSURES)</Text>
          </Pressable>
          */}


          {/*Button to navigate to the Stereo System User Guide screen*/}
          <OpenURLLink url={userGuideURL}>MERCURY STEREO USER GUIDE (LINK)</OpenURLLink>


          {/*Button to navigate to the About screen*/}
          <Pressable onPress={() => navigation.navigate("AboutScreen")} style={homeStyle.buttonAbout} accessible={true} accessibilityLabel="About" accessibilityHint="Navigates to the about screen" accessibilityRole="button">
            <Text style={homeStyle.buttonTextAbout}>ABOUT</Text>
          </Pressable>

          {/*Add new buttons here as new screens are created!*/}


        </ScrollView>
      </SafeAreaView>
    )
  }
  
  
  // Stylesheet for the app home page
  const homeStyle = StyleSheet.create({
    // background of the page
    container: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: 'black',
      justifyContent: 'tops',
    },
    // Main title
    textTitle: {
      color: 'white',
      marginTop: 55,
      margin: 5,
      fontSize: 35,
      textAlign: 'center',
      fontWeight: 'bold',
      },
    // Subtitle 
    textSubtitle: {
      color: 'white',
      margin: 5,
      marginBottom: 15,
      fontSize: 22,
      textAlign: 'center',
    },
    // Body text
    text: {
      color: 'white',
      margin: 8,
      marginTop: 13,
      fontSize: 20,
      textAlign: 'left',
      alignSelf: 'flex-start',
    },
    // Styling the Pressable component, functions as a button but it has more styling options
    button: {
      backgroundColor: 'white',
      padding: 5,
      margin: 20,
      borderRadius: 10,
      height: 50,
      width: '90%',
      alignSelf: 'center',
      display: 'flex',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
    },
    buttonAbout: {
      height: 50,
      width: '90%',
      alignSelf: 'center',
      display: 'flex',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
    }, 
    buttonText: {
      alignSelf: 'center',
      fontSize: 18,
    },
    buttonTextAbout: {
      alignSelf: 'center',
      fontSize: 18,
      color: '#007AFF',
      textAlign: 'center',
    },

  });


export default HomeScreen;