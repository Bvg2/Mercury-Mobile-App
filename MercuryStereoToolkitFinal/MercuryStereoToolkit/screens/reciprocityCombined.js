// See README.md for information about this file and how to make updates

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Platform, StyleSheet, View , Text, Pressable, Image, TextInput, Button, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


// Special imports for this file, see README for links with more information about them
import { SelectList } from 'react-native-dropdown-select-list'; 
//import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
//import { Audio } from 'expo-av';

import SegmentedControlTab from "react-native-segmented-control-tab";
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';


// Array/dictionary of key value pairs of different film stock for use in the dropdown menu
const filmStock = [
    {key: '1', value: 'Color negative'}, 
    {key: '2', value: 'Fuji Provia F (RDP III)'}, 
    {key: '3', value: 'Fuji Velvia, 64T'}, 
    {key: '4', value: 'Fuji Acros (I, II)'}, 
    {key: '5', value: 'Kodak Ektachrome E100'}, 
    {key: '6', value: 'Kodak Tri-X, Plus-X'},
    {key: '7', value: 'Kodak TMAX'},
    {key: '8', value: 'Ilford HP5+, XP2, Pan F'},
    {key: '9', value: 'Ilford FP4+, Delta 100'},
    {key: '10', value: 'Ilford Delta 400'}
];

// Array/dictionary of key value pairs for different pinhole sizes, used in dropdown menu
const pinholeSize = [
  {key: '1', value: '0.3mm diameter / 50mm FL'},
  {key: '2', value: '0.35mm diameter / 70mm FL'}
];

const BackArrow = () => {
  return (
      <Image
        style={{ width: 18, height: 18, alignSelf: 'left'}}
        source={require('../assets/images/backarrow.png')}
      />

  )
}

const calculateTime = (time) => {
	let totalTime = time/60;
	let mins = Math.floor(totalTime);
	let seconds = totalTime % 1;
	seconds = seconds.toFixed(2)
	if(seconds >= 0.60){
		mins+=1;
		seconds-=.60;
		seconds = seconds.toFixed(2)
	}
	if (seconds === 0){
		return mins;
	}
	else{
		seconds = seconds.toString();
		seconds = seconds.substring(2);
		let final = `${mins}:${seconds}`;


		return final
	}


}

// Global variable which stores the calculated reciprocity time, based on the selected film stock
var reciprocityTime = 0;
// Separate global variable which is used to pass the calculated reicprocity time to the timer... honestly I don't remember by just using reciprocityTime wasn't working, but it wasn't for some reason so idk
//var timerTime = 0;

// Screen component
const CombinedReciprocityScreen = ({route}) => {
	const navigation = useNavigation();
  // Reference to use to automatically scroll down to see results
    const endRef = useRef();

  // State variables for saving data and updating the screen
    const [selectedIndex, setSelectedIndex] = useState(route.params.tab);     // Stores which segmented-control tab is selected to display pinhole or reciprocity. Default value is passed in from navigation from the home screen to load the correct tab
    const [selectedPinholeSize, setSelectedPinholeSize] = useState(''); // Selected pinhole size
    const [selectedFilm, setSelectedFilm] = useState(''); // Selected film stock
    const [time, onChangeTime] = useState('');            // The time entered by users in the textbox
    const [result, showResult] = useState(false);         // Boolean value for whether or not to display results
    const [updateResult, setUpdateResult] = useState(0);  // Value to increment to ensure that the screen is displayed with the most up-to-date data
    //const [key, setKey] = React.useState(0);                    // Variable which allows the countdown timer to be restarted at any point
    //const [playTimer, setPlayTimer] = React.useState(false);    // Boolean value which controls whether the countdown timer is playing or not
    const [timerEnd, setTimerEnd] = useState(false);      // Boolean variable to track whether the countdown timer has completed counting down (determines when sound plays and screen color turns red)
    //const [sound, setSound] = React.useState();                 // Variable which the sound effect is assigned to
    

    // Custom function to update which tab is being displayed and clear the results whenever the tab is switched
    const handleSingleIndexSelect = (index) => {
        setSelectedIndex(index);
        showResult(false);
      };
  

    // Given the film stock and an input time, calculates the reciprocity time
    const calculatePinhole = (pinhole, film, seconds) => {

      // Sets state variables to show/update results, stop the timer from playing, and change background color back to default
      showResult(true);
      setUpdateResult(updateResult + 1);
      //setPlayTimer(false);
      //setTimerEnd(false);

      // take user input (string number) and make it a number to be used for calculations
      seconds = parseFloat(seconds);

      // additional calculation that needs to be done if on the Pinhole tab, otherwise just use the entered time
      if (selectedIndex == 0){
        if (pinhole.localeCompare('0.3mm diameter / 50mm FL') == 0){
            seconds = (seconds * 28224)/484;
            //seconds = (seconds * 28224)/2025;
        }
        else if (pinhole.localeCompare('0.35mm diameter / 70mm FL') == 0){
            seconds = (seconds * 40000)/484;
            //seconds = (seconds * 40000)/2025;
        }
        //NEED TO COME UP WITH SOMETHING HERE IF THEY DON'T SELECT A PINHOLE FOR SOME REASON ... ACTUALLY PROBABLY NEED TO HANDLE THESE CASES ALL THROUGHOUT THE APP WHOOPS
      }
      
      // based on the selected film stock and time length, apply the correct formula to calculate the reciprocity time
      if (film.localeCompare('Color negative') == 0){
        reciprocityTime = seconds ** 1.35;
      }
      else if (film.localeCompare('Fuji Provia F (RDP III)') == 0){
        reciprocityTime = seconds;
      }
      else if (film.localeCompare('Fuji Velvia, 64T') == 0){
        reciprocityTime = -0.9718 + ((1.088 * seconds) ** 1.1);
      }
      else if (film.localeCompare('Fuji Acros (I, II)') == 0){
        if (seconds > 120){
          reciprocityTime = seconds * 2;
        }
        else{
          reciprocityTime = seconds;
        }
      }
      else if (film.localeCompare('Kodak Ektachrome E100') == 0){
        if (seconds > 10){
          reciprocityTime = ((seconds + 1) ** (1/0.96)) - 1;
        }
        else{
          reciprocityTime = seconds;
        }
      }
      else if (film.localeCompare('Kodak Tri-X, Plus-X') == 0){
        reciprocityTime = seconds ** 1.54;
      }
      else if (film.localeCompare('Kodak TMAX') == 0){
        reciprocityTime = seconds ** 1.15;
      }
      else if (film.localeCompare('Ilford HP5+, XP2, Pan F') == 0){
        reciprocityTime = seconds ** 1.31;
      }
      else if (film.localeCompare('Ilford FP4+, Delta 100') == 0){
        reciprocityTime = seconds ** 1.26;
      }
      else {
        reciprocityTime  = seconds ** 1.41;
      }

      if (reciprocityTime < seconds){
        reciprocityTime = seconds;
      }

      // Round the reciprocity time to one decimal point
      reciprocityTime = reciprocityTime.toFixed(1);
      // Assign the reciprocity time to the timerTime variable for use by the countdown timer
      //timerTime = parseFloat(reciprocityTime);
    }

    /*
    // Function to load and play the sound effect from the audio directory under assets
    async function playSound() {
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync( require('../assets/audio/beep1a.mp3')
      );
      setSound(sound);
  
      console.log('Playing Sound');
      await sound.playAsync();
    }
  
    // Effect to unload the sound after use
    React.useEffect(() => {
      return sound
        ? () => {
            console.log('Unloading Sound');
            sound.unloadAsync();
          }
        : undefined;
    }, [sound]);

    // Function to play the sound and set the state variable to control the UI when the timer ends
    const handleBackground = () => {
      playSound();
      setTimerEnd(true);
    }
    */


    return (
      <SafeAreaView style={[(timerEnd == false) ? reciprocityStyle.containerRegular : reciprocityStyle.containerTimerEnd]}>
        {Platform.OS === 'ios' ? <Pressable style={reciprocityStyle.backArrow} onPress={() => navigation.navigate("Home")}>
			<BackArrow/>
        </Pressable> : null}
        <ScrollView ref={endRef} onContentSizeChange={() => endRef.current.scrollToEnd({ animated: true })} contentContainerStyle={{paddingBottom: 60}}>
            
            {/*Title*/}
            {selectedIndex == 0 ? (<Text style={reciprocityStyle.textTitle} accessible={true} accessibilityLabel="Pinhole" accessibilityRole="text">Pinhole</Text>) : null}
            {selectedIndex == 1 ? (<Text style={reciprocityStyle.textTitle} accessible={true} accessibilityLabel="Reciprocity Only" accessibilityRole="text">Reciprocity Only</Text>) : null}

            {/*Segmented control tab for selecting what fields will be shown based on what the desired calculation is*/}
            <SegmentedControlTab
                values={['Pinhole', 'Reciprocity Only']}
                selectedIndex={selectedIndex}
                onTabPress={handleSingleIndexSelect}
                tabsContainerStyle={{
                margin: 10,
                width: 300,
                height: 40,
                alignSelf: 'center',
                }}
                tabStyle={{
                backgroundColor: 'gray',
                borderColor: 'black',
                }}
                tabTextStyle={{
                color: 'white'
                }}
                activeTabStyle={{
                backgroundColor: 'white',
                borderColor: 'white'
                
                }}
                activeTabTextStyle={{
                color: 'black'
                }}
                accessible={true}
                accessibilityLabels={['pinhole', 'reciprocity only']}
           />

          {/*Instructions*/}
            {selectedIndex == 0 ? (<Text style={reciprocityStyle.text} accessible={true} accessibilityLabel="Meter for f/22.  Select your pinhole size, film stock, and the exposure time your meter calculates, and we will calculate your actual exposure time (taking into account your pinhole and film reciprocity)." accessibilityRole="text">
                Meter for f/22. Select your pinhole size, film stock, and the exposure time your meter calculates, and we will calculate your actual exposure time (taking into account your pinhole and film reciprocity).
            </Text>) : null}
            {selectedIndex == 1 ? (<Text style={reciprocityStyle.text} accessible={true} accessibilityLabel="When shooting long exposures (over 1 second), use this calculator to convert your metered exposure to the actual exposure time required by your film stock." accessibilityRole="text">
                When shooting long exposures (over 1 second), use this calculator to convert your metered exposure to the actual exposure time required by your film stock.
            </Text>) : null}

          {/*Dropdown menu for selecting pinhole size to use in calculation*/}
            {selectedIndex == 0 ? (<Text style={reciprocityStyle.text} accessible={true} accessibilityLabel="Select pinhole size" accessibilityRole="text">Select pinhole size:</Text>) : null}
            {selectedIndex == 0 ? (<SelectList
              setSelected={(val) => setSelectedPinholeSize(val)} // updates state variable
              data={pinholeSize}
              save="value"
              boxStyles={{marginBottom:12}}
              dropdownTextStyles={{color:'white'}}
              inputStyles={{color:'white'}}
              onSelect = {() => setTimerEnd(false)}
              accessible={true}
              accessibilityHint="A searchable drop down menu to select a pinhole size option"
            />) : null}

          {/*Dropdown menu for selecting film stock to use in calculation*/}
            <Text style={reciprocityStyle.text} accessible={true} accessibilityLabel="Select film stock" accessibilityRole="text">Select film stock:</Text>
            <SelectList
              setSelected={(val) => setSelectedFilm(val)} // updates state variable
              data={filmStock}
              save="value"
              boxStyles={{marginBottom:12}}
              dropdownTextStyles={{color:'white'}}
              inputStyles={{color:'white'}}
              onSelect = {() => setTimerEnd(false)}
              accessible={true}
              accessibilityHint="A searchable drop down menu to select a film stock option"
            />

          {/*Numeric text input for users to input a time to calculate reciprocity for */}
          <View style={reciprocityStyle.contentBlock}>
            <Text style={reciprocityStyle.text} accessible={true} accessibilityLabel="Enter time in seconds" accessibilityRole="text">Enter time:</Text>
            <TextInput
              style={reciprocityStyle.input}
              onChangeText={onChangeTime}
              value={time}
              placeholder='0'
              defaultValue='0'
              placeholderTextColor='#FFFFFF'
              inputMode='decimal'
              keyboardType='decimal-pad'
              enterKeyHint='done'
              returnKeyType='done'
              onSubmitEditing={() => calculatePinhole(selectedPinholeSize, selectedFilm, time)}
              accessible={true}
              accessibilityLabel="Text entry box to enter a time in seconds"
            /> 
            <Text style={reciprocityStyle.text}> seconds</Text>
          </View>
          <View style={reciprocityStyle.button} accessible={true} accessibilityLabel="Click to show the calculated exposure time results, will not change to a different screen" accessibilityRole="button">
	            <Button
	                title= "CALCULATE EXPOSURE TIME"
	                onPress={() =>  calculatePinhole(selectedPinholeSize, selectedFilm, time)}
	                color="#000000"
	            />
	      </View>


            
          {/*Results text*/}
            {result ? (<Text style={reciprocityStyle.timerText} accessible={true} accessibilityLabel="Calculated reciprocity time" accessibilityRole="text">Reciprocity time: {calculateTime(reciprocityTime)} minutes</Text>) : null}

      {/*
          {/*Countdown timer
            <View style = {reciprocityStyle.timer} accessible={true} accessibilityLabel="Countdown timer. Will sound when it reaches 0 if ringer is on">
              { result && (<CountdownCircleTimer
                key = {key}
                isPlaying = {playTimer}
                duration = {timerTime}
                colors = {['#FFFFFF']}
                trailColor = '#bd1004'
                onComplete = {() => {handleBackground()}} // when the timer ends, play the sound and turn the screen red to indicate
              >
              </CountdownCircleTimer>)}
            </View>
    
            <View style = {reciprocityStyle.timer}>

            {/*Button to start/re-start the timer
              { result && (<View style={reciprocityStyle.button} accessible={true} accessibilityLabel="Start timer" accessibilityHint="Click here to start the countdown timer" accessibilityRole="button">
                { result && (<Button
                title="Start timer"
                onPress = {() => {
                  setKey(prevKey => prevKey + 1);
                  setPlayTimer(true); 
                  setTimerEnd(false);
                }}
                color="#000000"
                />)}
            </View>)}
        

            {/*Notes for the bottom of the page to clarify some of the features to users
            {result && (<Text style={reciprocityStyle.noteText} accessible={true} accessibilityLabel="The timer bar will automatically reset when the timer is started." accessibilityRole="text">The timer bar will automatically reset when the timer is started.</Text>)}  
            {result && (<Text style={reciprocityStyle.noteText} accessible={true} accessibilityLabel="Turn ringer/media volume on for sound when timer ends" accessibilityRole="text">Turn ringer/media volume on for sound when timer ends.</Text>)}
            </View> 
      */}
          </ScrollView>           
      </SafeAreaView>
    )
}

// Stylesheet for the reciprocity calculator screen
const reciprocityStyle = StyleSheet.create({
    containerRegular: {
      flex: 1,
      backgroundColor: 'black',
      justifyContent: 'top',
      marginTop:60,
    },
    containerTimerEnd: {
      flex: 1,
      backgroundColor: '#bd1004',
      justifyContent: 'top',
    },
    backArrow: {
		color: 'white',
		marginTop: 60,
		margin: 10,
	},
    contentBlock: {
      flex: .2,
      flexDirection: 'row',
      marginTop: 20,
    },
    // Title text of page
    textTitle: {
      color: 'white',
      marginTop: 0,
      margin: 5,
      fontSize: 35,
      textAlign: 'center',
      fontWeight: 'bold',

      },
    text: {
      color: 'white',
      margin: 8,
      marginTop: 13,
      fontSize: 20,
      textAlign: 'left',
      alignSelf: 'flex-start',
    },
    timerText: {
      color: 'white',
      margin: 20,
      marginTop: 40,
      fontSize: 20,
      fontWeight: 'bold',
      alignSelf: 'center',
    },
    insideTimerText: {
      color: 'white',
      margin: 20,
      fontSize: 20,
      alignSelf: 'center',
    },
    noteText: {
      color: 'white',
      margin: 10,
      marginTop: 10,
      fontSize: 12,
      alignSelf: 'center',
      textAlign:'center',
    },
    timer: {
      alignSelf: 'center',
      justifyContent: 'center',
    },
    button: {
      backgroundColor: 'white',
      padding: 5,
      margin: 20,
      borderRadius: 10,
    },
    input: {
      height: 40,
      width: 100,
      margin: 5,
      borderWidth: 1,
      padding: 10,
      borderColor: 'white',
      color: 'white',
      borderRadius: 10,
      alignSelf: 'flex-start',
    },
  });

  export default CombinedReciprocityScreen;