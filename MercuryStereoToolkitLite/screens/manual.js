import React, { useEffect, useRef, useState, useMemo } from "react";
import { StyleSheet, Text, View, Button, SafeAreaView, Image, Pressable, Linking, Alert} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';


const BackArrow = () => {
  return (
      <Image
        style={{ width: 18, height: 18, alignSelf: 'left'}}
        source={require('../assets/images/backarrow.png')}
      />

  )
}


const ManualScreen = () => {
	const navigation = useNavigation();

	return(
	<SafeAreaView style={manualStyle.container}>

        <Pressable style={manualStyle.backArrow} onPress={() => navigation.navigate("Home")}>
			<BackArrow/>
        </Pressable>



        <Text style={manualStyle.textTitle}>Mercury Stereo Manual</Text>

        {/*<WebView source={{ uri: 'https://www.mercurystereo.com/mobile/mobileguide.html' }} style={{flex: 1}} />*/}


    </SafeAreaView>

    );


}


const manualStyle = StyleSheet.create({
    // background of the page
    container: {
      flex: 1,
      backgroundColor: 'black',
      justifyContent: 'tops',
    },
    // Main title
    textTitle: {
      color: 'white',
      marginTop: 0,
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
      marginTop: 8,
      fontSize: 15,
      textAlign: 'center',
      alignSelf: 'center',
    },
    // Body text v2
    text2: {
        color: 'white',
        marginTop: 20,
        fontSize: 20,
        textAlign: 'center',
        alignSelf: 'center',
      },
    // View around the buttons -- buttons themselves don't have a lot of styling options, so I mostly styled the views as needed
    button: {
      backgroundColor: 'white',
      padding: 5,
      margin: 20,
      borderRadius: 10,
      height: 50,
      width: '50%',
      alignSelf: 'center',
      display: 'flex',
      justifyContent: 'center',
    },
    buttonText: {
      alignSelf: 'center',
      fontSize: 18,
    },
    backArrow: {
		color: 'white',
		marginTop: 55,
		margin: 10,
	},
  });


export default ManualScreen;