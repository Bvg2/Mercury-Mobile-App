// See README.md for information about this file and how to make updates

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { StyleSheet, Modal, Text, View, Button, Image, Pressable, ScrollView, Linking} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { SafeAreaView } from "react-native-safe-area-context";


//link to external Mercury Stereo User Guide
const userGuideURL = 'https://www.mercurystereo.com/mobile/mobileguide.html';


const descriptions = [
	"Use this tool to Calculate the hyperfocal configuration for a given lens on a Mercury Stereo camera",
	"This tool calculates the Depth of field calculations for all Mercury lens and spacer combinations",
	"Use this tool when you can restrict the visible distance range in your image. Enter the farthest visible object, and this will calculate the closest subject that will produce a comfortably viewable stereo photo. The f-stop displayed will keep this entire range in sharp focus",
	"This tool calculates the ideal base distance (distance between the stereo lenses) depending on the distance to your subject(s). This is for medium format 6x6 photography. Use it for very close and very distant subjects.",
	"Meter for f/22. Select your pinhole size, film stock, and the exposure time your meter calculates, and we will calculate your actual exposure time (taking into account your pinhole and film reciprocity).",
	"When shooting long exposures(over 1 second), use this calculator to convert your metered exposure to the actual exposure time required by your film stock",
	"This tool displays Popular filters and, their effects, and calculated exposure compensation"];

// component for opening external links
const OpenURLLink = ({url, children}) => {
  const handlePress = useCallback(async () => {
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

    const [modalVisible, setModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("Title");
    const [modalData, setModalData] = useState(descriptions[3]);


    return(
      <SafeAreaView style={homeStyle.container}>
        <KeyboardAwareScrollView contentContainerStyle={{paddingBottom: 60}}>
          {/*Title of the app*/}
          <Text style={homeStyle.textTitle} accessible={true} accessibilityLabel="Mercury Stereo Toolkit" accessibilityRole="text">Mercury Stereo Toolkit</Text>
			<Text style={{color:"#e8e8e8", textAlign:'center'}}>Long Press Buttons To View Descriptions</Text>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={()=> {
                Alert.alert('closing this modal');
                setModalVisible(!modalVisible);
          }}>
            <View style={homeStyle.centeredView}>
                <View style={homeStyle.modalView}>
					<Pressable
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={{margin: 10, color: 'white', fontSize: 25, textAlign: 'right', alignItems:'right', justifyContent:'right'}}>x</Text>
                    </Pressable>
                    <Text style={[homeStyle.modalTextTitle, { marginTop:0, marginBottom:8}]}>{modalTitle}</Text>
                    <Text style={[homeStyle.text, {fontSize: 18, color:'#e8e8e8'}]}>{modalData}</Text>
				</View>
			</View>

		</Modal>

          {/*Button to navigate to the Hyperfocal tab on the DOF screen*/}
          <Pressable onPress={() => navigation.navigate("DOFScreen", {tab: 0})} onLongPress={() => {setModalVisible(!modalVisible); setModalTitle("HyperFocal"); setModalData(descriptions[0])}} style={({pressed}) => [{backgroundColor: pressed ? 'rgb(211, 211, 211)' : 'white',}, homeStyle.button,]} accessible={true} accessibilityLabel="Hyperfocal" accessibilityHint="Navigates to the hyperfocal calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/blackOnNothing.png')}
            />
            <Text style={homeStyle.buttonText}>HYPERFOCAL</Text>
          </Pressable>
          
          {/*Button to navigate to the DOF tab on the DOF screen*/}
          <Pressable onPress={() => navigation.navigate("DOFScreen", {tab: 1})} onLongPress={() => {setModalVisible(!modalVisible); setModalTitle("Depth of Field"); setModalData(descriptions[1])}} style={({pressed}) => [{backgroundColor: pressed ? 'rgb(211, 211, 211)' : 'white',}, homeStyle.button,]} accessible={true} accessibilityLabel="Depth of field" accessibilityHint="Navigates to the depth of field calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/blackOnNothing.png')}
            />
            <Text style={homeStyle.buttonText}>DEPTH OF FIELD</Text>
          </Pressable>

          {/*Button to navigate to the Close Focus Calculator screen*/}
          <Pressable onPress={() => navigation.navigate("CloseFocusScreen")} onLongPress={() => {setModalVisible(!modalVisible); setModalTitle("Depth Range"); setModalData(descriptions[2])}} style={({pressed}) => [{backgroundColor: pressed ? 'rgb(211, 211, 211)' : 'white'}, homeStyle.button]} accessible={true} accessibilityLabel="Depth range (close up)" accessibilityHint="Navigates to the close focus calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/ruler.png')}
            />
            <Text style={homeStyle.buttonText}>DEPTH RANGE (CLOSE UP)</Text>
          </Pressable>

          {/*Button to navigate to the Base Distance Calculator screen*/}
          <Pressable onPress={() => navigation.navigate("BaseScreen")} onLongPress={() => {setModalVisible(!modalVisible); setModalTitle("Base Distance"); setModalData(descriptions[3])}} style={({pressed}) => [{backgroundColor: pressed ? 'rgb(211, 211, 211)' : 'white',}, homeStyle.button,]} accessible={true} accessibilityLabel="Base distance (hypo/hyper)" accessibilityHint="Navigates to the base distance calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/base.png')}
            />
            <Text style={homeStyle.buttonText}>BASE DISTANCE (HYPO/HYPER)</Text>
          </Pressable>

          {/*Button to navigate to the Pinhole tab on the Reciprocity Calculator screen*/}
          <Pressable onPress={() => navigation.navigate("CombinedReciprocityScreen", {tab: 0})} onLongPress={() => {setModalVisible(!modalVisible); setModalTitle("Pinhole"); setModalData(descriptions[4])}} style={({pressed}) => [{backgroundColor: pressed ? 'rgb(211, 211, 211)' : 'white',}, homeStyle.button,]} accessible={true} accessibilityLabel="Pinhole" accessibilityHint="Navigates to the pinhole calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/timer.png')}
            />
            <Text style={homeStyle.buttonText}>PINHOLE</Text>
          </Pressable>
    

          {/*Button to navigate to the Reciprocity Only tab on the Reciprocity Calculator screen*/}
          <Pressable onPress={() => navigation.navigate("CombinedReciprocityScreen", {tab: 1})} onLongPress={() => {setModalVisible(!modalVisible); setModalTitle("Reciprocity"); setModalData(descriptions[5])}} style={({pressed}) => [{backgroundColor: pressed ? 'rgb(211, 211, 211)' : 'white',}, homeStyle.button,]} accessible={true} accessibilityLabel="Reciprocity (long exposures)" accessibilityHint="Navigates to the reciprocity only calculator screen" accessibilityRole="button">
            <Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/timer.png')}
            />
            <Text style={homeStyle.buttonText}>RECIPROCITY (LONG EXPOSURES)</Text>
          </Pressable>

          <Pressable onPress={() => navigation.navigate("FilterScreen")} onLongPress={() => {setModalVisible(!modalVisible); setModalTitle("Filter Calculator"); setModalData(descriptions[6])}} style={({pressed}) => [{backgroundColor: pressed ? 'rgb(211, 211, 211)' : 'white',}, homeStyle.button,]} accessible={true} accessibilityLabel="Filter Calculator" accessibilityHint="Navigates to the filter calculator screen" accessibilityRole="button">
			<Image
              style={{ width: 25, height: 25, alignSelf: 'center', marginRight: 8}}
              source={require('../assets/images/filter.png')}
            />
            <Text style={homeStyle.buttonText}>FILTER CALCULATOR</Text>
          </Pressable>
		  {/*change the MERCUTY LOGO to be a bit to the left iff there is a phone*/}

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
	            <Pressable onPress={() => Linking.openURL('https://www.mercurystereo.com/mobile/mobileguide.html')} style={({pressed}) => [{backgroundColor: pressed ? 'rgb(211, 211, 211)' : 'white',}, homeStyle.smallButton,]} accessible={true} accessibilityLabel="userGuide" accessibilityHint="Navigates to the userGuide screen" accessibilityRole="button">
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


        </KeyboardAwareScrollView>
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
    modalTextTitle: {
      color: 'white',
      marginTop: 10,
      margin: 5,
      fontSize: 25,
      textAlign: 'center',
      },

    // Subtitle 
    textSubtitle: {
      color: 'white',
      margin: 5,
      marginBottom: 15,
      fontSize: 22,
      textAlign: 'center',
    },
    modalView: {
	    margin: 20,
	    textAlign: 'center',
	    justifyContent: 'tops',
	    alignSelf: 'center',
	    backgroundColor: 'black',
	    borderRadius: 20,
	    borderColor: 'white',
	    borderWidth: 2,
	    padding: 25,
	    paddingVertical: 5,
	    width: '75%',
	    height: '65%',

	    shadowColor: '#ffff',
	    shadowOffset: {
	      width: 0,
	      height: 2,
	    },
	    shadowOpacity: 0.25,
	    shadowRadius: 4,
	    elevation: 5,
    },
    centeredView: {
		flex: 1,
		justifyContent: 'center',

	},

    // Body text
    text: {
      color: 'white',
      margin: 8,
      marginTop: 13,
      fontSize: 18,
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