// See README.md for information about this file and how to make updates

import React, { useEffect, useRef, useState, useMemo } from "react";
import { StyleSheet, View , Text, Image, Pressable, TextInput, Button, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

// Special imports for this file, see README for links with more information about them
import { SelectList } from 'react-native-dropdown-select-list'; 
import RadioGroup from 'react-native-radio-buttons-group';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

// Dictionary for selecting a lens name from drop down menu, organized by focal length
// NOTE: SOME OF THESE LENSES AND HOW THEY ARE REFERRED TO IS DIFFERENT FROM THE DOF CALCULATOR. DO NOT COPY AND PASTE BETWEEN THE TWO FILES


const newFocalLenth = [
    {key:'1', value:'35mm'},
    {key:'2', value:'47mm'},
    {key:'3', value:'50mm'},
    {key:'4', value:'55mm'},
    {key:'5', value:'60mm'},
    {key:'6', value:'65mm'},
    {key:'7', value:'75mm'},
    {key:'8', value:'80mm'},
    {key:'9', value:'90mm'},
    {key:'10', value:'100mm'},
    {key:'11', value:'105mm'},
    {key:'12', value:'120mm'},
    {key:'13', value:'135mm'},
    {key:'14', value:'150mm'},
    {key:'15', value:'165mm'},
    {key:'16', value:'180mm'},
    {key:'17', value:'200mm'},
    {key:'18', value:'250mm'},
    {key:'19', value:'300mm'},
];

const BackArrow = () => {
  return (
      <Image
        style={{ width: 18, height: 18, alignSelf: 'left'}}
        source={require('../assets/images/backarrow.png')}
      />

  )
}



// Default base distance value; used for results
var baseDist = 0;

// Units used to display results-- default is mm, but if the results are > 100mm, they will be converted to meters.
var displayUnits = "mm";

// Exported component
const BaseScreen = () => {
	const navigation = useNavigation();
    // Reference to use to automatically scroll down to see results
    const endRef = useRef();

    // State variables for saving information and updating the screen
    const [selectedLens, setSelectedLens] = useState('');     // Name of the selected lens
    const [units, setUnits] = useState('feet');               // id of selected radio button for units, used for claculations and updating display
    const [nearDist, setNearDist] = useState('0');            // Near subject distance, default is 0
    const [farDistIndex, setFarDistIndex] = useState('0');    // Radio button index for the far subject distance; 1 is INF, 2 allows the user to enter a number
    const [farDist, setFarDist] = useState('0');              // Numeric far subject distance, if the user selects to enter one
    const [showResults, setShowResults] = useState(false);    // Controls whether or not to display results
    const [calculate, setCalculate] = useState(0);            // Incremented to "force" the page to update/recalculate results whenever changes are made

    // Creates the radio buttons where users select a far subject distance (INF or a custom numeric value)
    const distRadioButtons = useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'INF',
            value: 'INF',
            color: '#ffffff',
            labelStyle: {textAlign:'left', color: '#ffffff'},
            containerStyle: {alignSelf: 'flex-start'},
            accessible: true,
            accessibilityLabel: 'INF',
            accessibilityRole: 'radio'
        },
        {
            id: '2',
            label: 'Custom Value:',
            value: '',
            color: '#ffffff',
            labelStyle: {textAlign:'left', color: '#ffffff'},
            containerStyle: {alignSelf: 'flex-start'},
            accessible: true,
            accessibilityLabel: 'Custom distance',
            accessibilityRole: 'radio'
        }
    ]), []);

    // Creates the radio buttons where users select their desired units for entering subject distances
    const unitsRadioButtons = useMemo(() => ([
        {
            id: 'feet', // acts as primary key, should be unique and non-empty string
            label: 'feet',
            value: 'feet',
            color: '#ffffff',
            labelStyle: {textAlign:'left', color: '#ffffff'},
            containerStyle: {alignSelf: 'flex-start'},
            accessible: true,
            accessibilityLabel: 'feet',
            accessibilityRole: 'radio',
        },
        {
            id: 'yards', // acts as primary key, should be unique and non-empty string
            label: 'yards',
            value: 'yards',
            color: '#ffffff',
            labelStyle: {textAlign:'left', color: '#ffffff'},
            containerStyle: {alignSelf: 'flex-start'},
            accessible: true,
            accessibilityLabel: 'yards',
            accessibilityRole: 'radio'
        },
        {
            id: 'inches', // acts as primary key, should be unique and non-empty string
            label: 'inches',
            value: 'inches',
            color: '#ffffff',
            labelStyle: {textAlign:'left', color: '#ffffff'},
            containerStyle: {alignSelf: 'flex-start'},
            accessible: true,
            accessibilityLabel: 'inches',
            accessibilityRole: 'radio'
        },
        {
            id: 'meters', // acts as primary key, should be unique and non-empty string
            label: 'meters',
            value: 'meters',
            color: '#ffffff',
            labelStyle: {textAlign:'left', color: '#ffffff'},
            containerStyle: {alignSelf: 'flex-start'},
            accessible: true,
            accessibilityLabel: 'meters',
            accessibilityRole: 'radio'
        },
        {
            id: 'millimeters', // acts as primary key, should be unique and non-empty string
            label: 'millimeters',
            value: 'millimeters',
            color: '#ffffff',
            labelStyle: {textAlign:'left', color: '#ffffff'},
            containerStyle: {alignSelf: 'flex-start'},
            accessible: true,
            accessibilityLabel: 'millimeters',
            accessibilityRole: 'radio'
        },
    ]), []);


    // Function to calculate the base distance given the lens (determines focal length), near subject distance, and far subject distance
    const calculateBaseDist = () => {

        // Set state variables to show/update results when calculated
        setShowResults(true);
        setCalculate(calculate + 1);

        // Assign variables for calculation
        let p = 3;

        let n = parseFloat(nearDist);   // Make variable numeric
        let lessThan12 = false;     // Assume it is farther than 12in by default

        let l = 0;  // Create variable for far subject distance
        // The far subject distance is either a number or INF -- assign it accordingly
        if(farDistIndex.localeCompare('1') == 0){
            l = 'INF';
        }
        else {
            l = parseFloat(farDist);
        }

        // Use the selected lens to assign the correct focal distance

        //return here 1
        const f = parseInt(selectedLens);
        //B: f is now just the parsed in of the mm focal length



        // Convert distances to millimeters to use in calculation
        /* I couldn't find anywhere that confirmed that this was the correct thing to do, but given that the focal length
           is alwasy in mm it makes sense to me? And when I didn't do it, I would end up getting results with negative numbers, so... */
        if(units.localeCompare('feet') == 0){
            n = n * 304.8;
            if(!isNaN(l)){
                l = l * 304.8;
            }
        }
        else if (units.localeCompare('meters') == 0){
            n = n * 1000;
            if(!isNaN(l)){
                l = l * 1000;
            }
        }
        else if (units.localeCompare('inches') == 0){
            n = n * 25.4;
            if(!isNaN(l)){
                l = l * 25.4;
            }
        }
        else if (units.localeCompare('yards') == 0){
            n = n * 914.4;
            if(!isNaN(l)){
                l = l * 914.4;
            }
        }

        // Check if n < 12 inches, will be a factor in the chosen formula
        if ( (n/25.4) < 12 ){
            lessThan12 = true;
        }


        // If n < 12in and l is a number --> use Wattie and Bercovitz, return the smaller number
        if ((!isNaN(l)) && lessThan12){
            let wattieB = n * 0.9;
            let berkovitzB = p * ((l * n)/(l - n)) * ((1 / f) - ((l + n) / (2 * l * n)));
            if(wattieB < berkovitzB){
                baseDist = wattieB;
            }
            else{
                baseDist = berkovitzB;
            }
        }
        // Else if n < 12in and l is not a number (INF) --> use Wattie
        else if ((isNaN(l)) && (n < 12)){
            baseDist = n * 0.9;
        }
        // Else if l is a number, but it is less than 2*n
        else if ((!isNaN(l)) && (l < 2*n)){
            l = 2 * n;
            baseDist = p * ((l * n)/(l - n)) * ((1 / f) - ((l + n) / (2 * l * n)));
        }
        // Else if l is INF
        else if (isNaN(l)){
            baseDist = p * ((n / f) - 0.5);
        }
        // Every other case
        else{
            baseDist =  p * ((l * n)/(l - n)) * ((1 / f) - ((l + n) / (2 * l * n)));
        }
       
        // Round the results to 2 decimal places
        baseDist = baseDist.toFixed(2);

        // Check if baseDist > 100 mm, and if so convert to m
        if (baseDist >= 1000){
            baseDist = (baseDist / 1000).toFixed(2);
            displayUnits = "meters";
        }
        else if (baseDist >= 100){
            baseDist = (baseDist / 10).toFixed(2);
            displayUnits = "cm";
        }
        else {
            displayUnits = "mm";
        }

    }

    return (
        <SafeAreaView style={baseStyle.container}>
			{Platform.OS === 'ios' ? <Pressable style={baseStyle.backArrow} onPress={() => navigation.navigate("Home")}>
				<BackArrow/>
            </Pressable> : null}

            {/*Use KeyboardAware because there are some text inputs where the keyboard would otherwise cover the input */}
            <KeyboardAwareScrollView 
                ref={endRef} 
                enableOnAndroid={true}
                enableAutomaticScroll={(Platform.OS === 'ios')}
                extraScrollHeight={100} // (when scroll)to have extra height between keyboard and text input 
                extraHeight={80} // make some height so the keyboard wont cover other component
                //contentContainerStyle={{flexGrow: 1}} // make the scrollView full screen 
                contentContainerStyle={{paddingBottom: 60}}
            >   

                {/*Page title and instructions */}
                <Text style={baseStyle.textTitle} accessible={true} accessibilityLabel="Base distance (hypo/hyper)" accessibilityRole="text">Base Distance (Hypo/Hyper)</Text>
                <Text style={baseStyle.text} accessible={true} accessibilityLabel="This tool calculates the ideal base distance (distance between the stereo lenses) depending on the distance to your subject(s).  This is for medium format 6x6 photography. Use it for very close and very distant subjects." accessibilityRole="text">
                    This tool calculates the ideal base distance (distance between the stereo lenses) depending on the distance to your subject(s). This is for medium format 6x6 photography. Use it for very close and very distant subjects.
                </Text>

                {/*Dropdown menu to select the lens (will determine the focal length for calculations*/}
                <Text style={baseStyle.text} accessible={true} accessibilityLabel="Select Focal Length" accessibilityRole="text">Select Focal Length:</Text>
                <SelectList 
                    setSelected={(val) => setSelectedLens(val)}
                    data= {newFocalLenth}
                    save="value"
                    boxStyles={{marginBottom:12}}
                    dropdownTextStyles={{color:'white'}}
                    inputStyles={{color:'white'}}
                    accessible={true}
                    accessibilityLabel="A searchable dropdown menu to select a lens to calculate the base distance for"
                />

                {/*Group of radio buttons to select the units that the user will use for their subject distance input */}
                <Text style={baseStyle.text} accessible={true} accesssibilityLabel="Select units" accessibilityRole="text">Select units:</Text>
                <RadioGroup 
                    radioButtons={unitsRadioButtons} 
                    onPress={setUnits}
                    selectedId={units}
                    containerStyle={baseStyle.radioButton}
                    accessible={true}
                    accessibilityRole="radiogroup"

                />

                {/*A numeric-only text input for users to enter a custom near subject distance value*/}
                <Text style={baseStyle.text} accessible={true} accessibilityLabel="Near subject distance" accessibilityRole="text">Near subject distance:</Text>
                <View style={baseStyle.contentBlock}>
                    <TextInput
                        style={baseStyle.input}
                        onChangeText={setNearDist}
                        value={nearDist}
                        placeholder='0'
                        inputMode='decimal'
                        keyboardType='decimal-pad'
                        enterKeyHint='done'
                        returnKeyType='done'
                        accessible={true}
                        accessibilityLabel="Text entry box to enter the near subject distance using the selected units"
                    />
                    <Text style={baseStyle.text}>{units}</Text>
                </View>
                

                {/*Radio buttons and a text input where users can select/enter their far subject distance value. If the INF radio button is selected, the text input is disabled.*/}
                <Text style={baseStyle.text} accessible={true} accessibilityLabel="Far subject distance" accessibilityRole="text">Far subject distance:</Text>  

                <RadioGroup 
                    radioButtons={distRadioButtons} 
                    onPress={setFarDistIndex}
                    selectedId={farDistIndex}
                    containerStyle={baseStyle.radioButton}
                    accessible={true}
                    accessibilityRole="radiogroup"

                />

                <View style={baseStyle.contentBlock}>
                    <TextInput
                        style={baseStyle.input}
                        onChangeText={setFarDist}
                        value={farDist}
                        placeholder='0'
                        inputMode='decimal'
                        keyboardType='decimal-pad'
                        enterKeyHint='done'
                        returnKeyType='done'
                        editable={farDistIndex.localeCompare('2') == 0}
                        accessible={true}
                        accessibilityLabel="Text entry box to enter the far subject distance using the selected units"
                    />
                     <Text style={baseStyle.text}>{units}</Text>
                </View>
            
                {/*Button to click to calculate/show results*/}
                <View style={baseStyle.button} accessible={true} accessibilityLabel="Click to show the calculated base distance results, will not change to a different screen" accessibilityRole="button">
                    <Button 
                        title= "Calculate Base Distance"
                        onPress={() => calculateBaseDist()}
                        color="#000000"
                    />
                </View>

                {/*Results -- currently they appear just off-screen when they are calculated, may want to update some spacing to make it more clear that a user must scroll to see them?*/}
                {showResults ? (<Text style={baseStyle.textResult} accessible={true} accessibilityLabel="stereo base results" accessibilityRole="text">Stereo base: {baseDist} {displayUnits}</Text>) : null}

            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

// Stylesheet for the base calculator screen
const baseStyle = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      justifyContent: 'top',
      marginTop:60,
    },
    contentBlock: {
      flex: .2,
      flexDirection: 'row',
      marginTop: 20,
    },
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
      marginTop: 12,
      marginBottom: 6,
      fontSize: 20,
      textAlign: 'left',
      alignSelf: 'flex-start',
    },
	backArrow: {
		color: 'white',
		marginTop: 0,
		margin: 10,
	},
    textResult: {
        color: 'red',
        margin: 8,
        marginTop: 13,
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
      },
    radioButton: {
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    noteText: {
      color: 'white',
      margin: 10,
      marginTop: 10,
      fontSize: 12,
      alignSelf: 'center',
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
      marginLeft: 20,
      marginBottom: 12,
      borderWidth: 1,
      padding: 10,
      borderColor: 'white',
      color: 'white',
      borderRadius: 10,
      alignSelf: 'flex-start',
    },
  });


export default BaseScreen;