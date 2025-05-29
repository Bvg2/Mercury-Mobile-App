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
          <Pressable onPress={() => navigation.navigate("DOFScreen", {tab: 0})} style={({pressed}) => [{backgroundColor: pressed ? 'rgb(211, 211, 211)' : 'white',}, homeStyle.button,]} accessible={true} accessibilityLabel="Hyperfocal" accessibilityHint="Navigates to the hyperfocal calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/blackOnNothing.png')}
            />
            <Text style={homeStyle.buttonText}>HYPERFOCAL</Text>
          </Pressable>
          
          {/*Button to navigate to the DOF tab on the DOF screen*/}
          <Pressable onPress={() => navigation.navigate("DOFScreen", {tab: 1})} style={({pressed}) => [{backgroundColor: pressed ? 'rgb(211, 211, 211)' : 'white',}, homeStyle.button,]} accessible={true} accessibilityLabel="Depth of field" accessibilityHint="Navigates to the depth of field calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/blackOnNothing.png')}
            />
            <Text style={homeStyle.buttonText}>DEPTH OF FIELD</Text>
          </Pressable>

          {/*Button to navigate to the Close Focus Calculator screen*/}
          <Pressable onPress={() => navigation.navigate("CloseFocusScreen")} style={({pressed}) => [{backgroundColor: pressed ? 'rgb(211, 211, 211)' : 'white',}, homeStyle.button,]} accessible={true} accessibilityLabel="Depth range (close up)" accessibilityHint="Navigates to the close focus calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/ruler.png')}
            />
            <Text style={homeStyle.buttonText}>DEPTH RANGE (CLOSE UP)</Text>
          </Pressable>

          {/*Button to navigate to the Base Distance Calculator screen*/}
          <Pressable onPress={() => navigation.navigate("BaseScreen")} style={({pressed}) => [{backgroundColor: pressed ? 'rgb(211, 211, 211)' : 'white',}, homeStyle.button,]} accessible={true} accessibilityLabel="Base distance (hypo/hyper)" accessibilityHint="Navigates to the base distance calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/base.png')}
            />
            <Text style={homeStyle.buttonText}>BASE DISTANCE (HYPO/HYPER)</Text>
          </Pressable>

          {/*Button to navigate to the Pinhole tab on the Reciprocity Calculator screen*/}
          <Pressable onPress={() => navigation.navigate("CombinedReciprocityScreen", {tab: 0})} style={({pressed}) => [{backgroundColor: pressed ? 'rgb(211, 211, 211)' : 'white',}, homeStyle.button,]} accessible={true} accessibilityLabel="Pinhole" accessibilityHint="Navigates to the pinhole calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/timer.png')}
            />
            <Text style={homeStyle.buttonText}>PINHOLE</Text>
          </Pressable>
    

          {/*Button to navigate to the Reciprocity Only tab on the Reciprocity Calculator screen*/}
          <Pressable onPress={() => navigation.navigate("CombinedReciprocityScreen", {tab: 1})} style={({pressed}) => [{backgroundColor: pressed ? 'rgb(211, 211, 211)' : 'white',}, homeStyle.button,]} accessible={true} accessibilityLabel="Reciprocity (long exposures)" accessibilityHint="Navigates to the reciprocity only calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/timer.png')}
            />
            <Text style={homeStyle.buttonText}>RECIPROCITY (LONG EXPOSURES)</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate("FilterScreen")} style={({pressed}) => [{backgroundColor: pressed ? 'rgb(211, 211, 211)' : 'white',}, homeStyle.button,]} accessible={true} accessibilityLabel="Filter Calculator" accessibilityHint="Navigates to the filter calculator screen" accessibilityRole="button">
			<Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/filter.png')}
            />
            <Text style={homeStyle.buttonText}>FILTER CALCULATOR</Text>
          </Pressable>
		//change the MERCUTY LOGO to be a bit to the left iff there is a phone

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
          {/* user guide<OpenURLLink url={userGuideURL}>MERCURY STEREO USER GUIDE (LINK)</OpenURLLink>*/}
		  <View style={{flexDirection:'row', justifyContent: 'space-between'}}>
	          <View style={{marginTop: 10, width: 100, flexDirection:'column', marginLeft:15}}>
	            <Pressable onPress={() => navigation.navigate("AboutScreen")} style={({pressed}) => [{backgroundColor: pressed ? 'rgb(211, 211, 211)' : 'white',}, homeStyle.smallButton,]} accessible={true} accessibilityLabel="userGuide" accessibilityHint="Navigates to the userGuide screen" accessibilityRole="button">
					<Image
	                 style={{ width: 35, height: 35, alignSelf: 'center'}}
	                 source={require('../assets/images/info.png')}
	                />


	            </Pressable>
	            <Text style={[homeStyle.text, {marginTop: 5, textAlign:'center', alignSelf:'center'}]}>ABOUT</Text>
	          </View>


	          <View style={{marginTop: 10, width: 100, flexDirection:'column', marginRight:15}}>
	            <Pressable onPress={() => navigation.navigate("ManualScreen")} style={({pressed}) => [{backgroundColor: pressed ? 'rgb(211, 211, 211)' : 'white',}, homeStyle.smallButton,]} accessible={true} accessibilityLabel="userGuide" accessibilityHint="Navigates to the userGuide screen" accessibilityRole="button">
					<Image
	                 style={{ width: 50, height: 50, alignSelf: 'center'}}
	                 source={require('../assets/images/manual.png')}
	                />


	            </Pressable>
	            <Text style={[homeStyle.text, {marginTop: 5, textAlign:'center', alignSelf:'center'}]}>MANUAL</Text>
	          </View>
          </View>


          {/*Button to navigate to the About screen*/}


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
    smallButton: {
      padding: 5,
      marginTop: 20,
      marginLeft: 20,
      borderRadius: 40,
      height: 65,
      width: 65,
      alignSelf: 'left',
      display: 'flex',
      justifyContent: 'center',
      flex: 1,
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
	  backgroundColor: 'white',
      fontSize: 18,
      color: '#007AFF',
      textAlign: 'center',
    },

  });


export default HomeScreen;