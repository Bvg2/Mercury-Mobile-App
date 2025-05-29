// See README.md for information about this file and how to make updates

import * as React from 'react';
import { StyleSheet, View , Text, SafeAreaView, Image, Pressable, TextInput, Button, ScrollView } from 'react-native';

// Special imports for this file, see README for links with more information about them
import { SelectList } from 'react-native-dropdown-select-list'; 
import RadioGroup from 'react-native-radio-buttons-group';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

// Dictionary for selecting a lens name from drop down menu, organized by focal length
// NOTE: SOME OF THESE LENSES AND HOW THEY ARE REFERRED TO IS DIFFERENT FROM THE DOF CALCULATOR. DO NOT COPY AND PASTE BETWEEN THE TWO FILES
const lensName = [
    {key:'1', value:'Super-Angulon 47mm f/5.6'},
    {key:'2', value:'Pinhole 50mm (0.3mm)'},
    {key:'3', value:'Bronica 50mm f/2.8 MC (ETRS)'},
    {key:'4', value:'Mamiya Sekor 55mm f/4.5 (TLR)'},
    {key:'5', value:'Apo-Digitar 60mm f/4'},
    {key:'6', value:'Pinhole 65mm (0.35mm)'},
    {key:'7', value:'Mamiya Sekor 65mm f/3.5 (TLR)'},
    {key:'8', value:'Grandagon 65mm f/4.5'},
    {key:'9', value:'Angulon 65mm f/6.8'},
    {key:'10', value:'Super-Angulon 65mm f/8'},
    {key:'11', value:'Fujinon SW 65mm f/8'},
    {key:'12', value:'Graflex Optar W.A. 65mm f/6.8'},
    {key:'13', value:'Super Topcor 65mm f/7'},
    {key:'14', value:'HR Digiron-W 70mm f/5.6'},
    {key:'15', value:'Grandagon 75mm f/6.8'},
    {key:'16', value:'Super-Angulon 75mm f/8'},
    {key:'17', value:'Fujinon SW 75mm F/8'},
    {key:'18', value:'Horseman Professional 75mm f/5.6'},
    {key:'19', value:'Mamiya Sekor 80mm f/2.8 (TLR)'},
    {key:'20', value:'Heligon 80mm f/2.8'},
    {key:'21', value:'Apo-Digitar 80mm f/4'},
    {key:'22', value:'Apo-Digitar 90mm f/4.5'},
    {key:'23', value:'Angulon 90mm f/6.8'},
    {key:'24', value:'Tessar 100mm f/3.5'},
    {key:'25', value:'Nikkor-W 100mm f/5.6'},
    {key:'26', value:'Apo-Digitar 100mm f/5.6'},
    {key:'27', value:'Sironar-N 100mm f/5.6'},
    {key:'28', value:'Symmar-S 100mm f/5.6'},
    {key:'29', value:'Apo-Symmar 100mm f/5.6'},
    {key:'30', value:'Trioptar 103mm f/4.5'},
    {key:'31', value:'Mamiya Sekor 105mm f/3.5 (TLR)'},
    {key:'32', value:'Apo-Symmar 120mm f/5.6'},
    {key:'33', value:'Wista ID 130mm f/5.6'},
    {key:'34', value:'Mamiya Sekor 135mm f/4.5 (TLR)'},
];

// Array of the lenses with their respective focal lengths (mm)
const focalLength = [
    {lens:'Super-Angulon 47mm f/5.6', focal: 24},
    {lens:'Pinhole 50mm (0.3mm)', focal: 25},
    {lens:'Bronica 50mm f/2.8 MC (ETRS)', focal: 25},
    {lens:'Mamiya Sekor 55mm f/4.5 (TLR)', focal: 28},
    {lens:'Apo-Digitar 60mm f/4', focal: 30},
    {lens:'Pinhole 65mm (0.35mm)', focal: 35},
    {lens:'Mamiya Sekor 65mm f/3.5 (TLR)', focal: 35},
    {lens:'Grandagon 65mm f/4.5', focal: 35},
    {lens:'Angulon 65mm f/6.8', focal: 35},
    {lens:'Super-Angulon 65mm f/8', focal: 35},
    {lens:'Fujinon SW 65mm f/8', focal: 35},
    {lens:'Graflex Optar W.A. 65mm f/6.8', focal: 35},
    {lens:'Super Topcor 65mm f/7', focal: 35},
    {lens:'HR Digiron-W 70mm f/5.6', focal: 40},
    {lens:'Grandagon 75mm f/6.8', focal: 45},
    {lens:'Super-Angulon 75mm f/8', focal: 45},
    {lens:'Fujinon SW 75mm F/8', focal: 45},
    {lens:'Horseman Professional 75mm f/5.6', focal: 45},
    {lens:'Mamiya Sekor 80mm f/2.8 (TLR)', focal: 50},
    {lens:'Heligon 80mm f/2.8', focal: 50},
    {lens:'Apo-Digitar 80mm f/4', focal: 50},
    {lens:'Apo-Digitar 90mm f/4.5', focalz: 55},
    {lens:'Angulon 90mm f/6.8', focal: 55},
    {lens:'Tessar 100mm f/3.5', focal: 60},
    {lens:'Nikkor-W 100mm f/5.6', focal: 60},
    {lens:'Apo-Digitar 100mm f/5.6', focal: 60},
    {lens:'Sironar-N 100mm f/5.6', focal: 60},
    {lens:'Symmar-S 100mm f/5.6', focal: 60},
    {lens:'Apo-Symmar 100mm f/5.6', focal: 60},
    {lens:'Trioptar 103mm f/4.5', focal: 60},
    {lens:'Mamiya Sekor 105mm f/3.5 (TLR)', focal: 60},
    {lens:'Apo-Symmar 120mm f/5.6', focal: 70},
    {lens:'Wista ID 130mm f/5.6', focal: 75},
    {lens:'Mamiya Sekor 135mm f/4.5 (TLR)', focal: 80},
]

// Array of F-stop display values along with their "behind the scenes" value to use for comparing to the calculated f-stop value in order to return a more standard one
const fStopComparisons = [
    {display: '2.8', calculated: 2.8},
    {display: '2.8 + 1/2', calculated: 3.4},
    {display: '4', calculated: 4},
    {display: '4 + 1/2', calculated: 4.8},
    {display: '5.6', calculated: 5.6},
    {display: '5.6 + 1/2', calculated: 6.8},
    {display: '8', calculated: 8},
    {display: '8 + 1/2', calculated: 9.5},
    {display: '11', calculated: 11},
    {display: '11 + 1/2', calculated: 13.5},
    {display: '16', calculated: 16},
    {display: '16 + 1/2', calculated: 19},
    {display: '22', calculated: 22},
    {display: '22 + 1/2', calculated: 27},
    {display: '32', calculated: 32},
    {display: '32 + 1/2', calculated: 38.5},
    {display: '45', calculated: 45},
];

const BackArrow = () => {
  return (
      <Image
        style={{ width: 18, height: 18, alignSelf: 'left'}}
        source={require('../assets/images/backarrow.png')}
      />

  )
}

var closeFocus = 0;     // will be used for the results of the calculations
var displayUnits = "";  // will be used to display the units of the results so they don't accidentally get changed without recalculating the results
var fStop = "";         // will be used to display the aperature for the calculated range

const CloseFocusScreen = () => {
	const navigation = useNavigation();
    // Reference to use to automatically scroll down to see results
    const endRef = React.useRef();

    // State variables for saving information and updating the screen
    const [selectedLens, setSelectedLens] = React.useState('');     // Name of the selected lens
    const [farDist, setFarDist] = React.useState('0');              // Numeric far subject distance
    const [units, setUnits] = React.useState('feet');               // id of selected radio button for units, used for claculations and updating display
    const [showResults, setShowResults] = React.useState(false);    // Controls whether or not to display results
    const [calculate, setCalculate] = React.useState(0);            // Incremented to "force" the page to update/recalculate results whenever changes are made

    // Creates the radio buttons where users select their desired units for entering subject distances
    const unitsRadioButtons = React.useMemo(() => ([
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
    ]), []);


    // Function to calculate the close focus distance given the lens (determines focal length) and far subject distance
    const calculateCloseFocus = () => {
        // Set state variables to show/update results when calculated
        setShowResults(true);
        setCalculate(calculate + 1);


        // Assign variables for calculations

        let fc = 0;      // Create focal length variable
        // Use the selected lens to assign the correct focal distance
        for (let i = 0; i < focalLength.length; i ++){
            if(focalLength[i].lens.localeCompare(selectedLens) == 0){
                fc = parseInt(focalLength[i].focal);
            }
        }

        let b = 62.5    // Stereo base variable; constant value in mm given in spreadsheet 
        let d = 3       // Deviation variable; constant value in mm given in spreadsheet
        let coc = 0.05  // Max acceptable diameter for the circle of confusion; constant value in mm given in spreadsheet

        let sof = parseFloat(farDist);    // far object distance variable

        // convert sof into mm for calculations
        if (units.localeCompare("feet") == 0 ){
            sof = sof * 304.8;
        }
        else if (units.localeCompare("yards") == 0){
            sof = sof * 914.4;
        }
        else {
            sof = sof * 1000;
        }

        let sif = ((1 / fc) - (1 / sof)) ** (-1)    // far image distance; intermediate value used to calculate the close focus distance

        let sin = (fc * sif * sof * (d + (2 * b))) / ((2 * b * sif * sof) - (2 * b * fc * sif) - (d * fc * sof));   // near image distance; intermediate value used to calculate close focus distance

        let son = (fc * sif * sof * (d + (2 * b))) / ((fc * d * sof) + (d * sof * sif) + (2 * b * fc * sif));       // near object distance in mm

        // calculating the fstop for the aperature range
        let xn = ((sin - sif) * sin) / (sin + sif);         // intermediate value, can be ignored
        let entrancePupilDiameter = (sin * coc) / xn;       // in theory, this should be 2.08 mm or thereabouts

        fStop = (fc / entrancePupilDiameter).toFixed(1);    //round the f-stop to 1 decimal place

        // console.log('fstop: ' + fStop); // for debugging

        // sometimes the calculated f-stop will be weird-- to fix this, find the nearest common f-stop to display for the results
        // loop through the above f-stops and find the smallest difference in the calculated values, then save the display-value to f-stop

        let minDifference = 100000;    // temp variable for storing the absolute value of the difference between the calculated f-stop and the listed ones in the array
        let savedFStop = '';        // temp variable for storing the display f-stop with the current minimum difference

        for (let i = 0; i < fStopComparisons.length; i ++){
            let currDifference = Math.abs(fStop - fStopComparisons[i].calculated);
            if (currDifference < minDifference){
                // console.log('min diff: ' + minDifference);
                // console.log('curr diff: ' + currDifference);

                // if there is a new closest f-stop, update the values to save that data
                minDifference = currDifference;
                savedFStop = fStopComparisons[i].display;
            }
        }

        // assign the savedFStop back to the global fStop variable to be displayed in the results
        fStop = savedFStop;

        // convert results back to selected distance for results
        if (units.localeCompare("feet") == 0 ){
            closeFocus = son / 304.8;
        }
        else {
            closeFocus = son / 1000;
        }

        closeFocus = closeFocus.toFixed(1);
        displayUnits = units;

        // for debugging
        // console.log('fc: ' + fc);
        // console.log('sof: ' + sof);
        // console.log('sif: ' + sif);
        // console.log('sin: ' + sin);
        // console.log('son: ' + son);
        // console.log('xn: ' + xn);
        // console.log('entrance pupil diameter: ' + entrancePupilDiameter);
    }


    return (
        <SafeAreaView style={closeFocusStyle.container}>
            <Pressable style={closeFocusStyle.backArrow} onPress={() => navigation.navigate("Home")}>
				<BackArrow/>
            </Pressable>
            {/*Use KeyboardAware because there are some text inputs where the keyboard would otherwise cover the input */}
            <KeyboardAwareScrollView ref={endRef} onContentSizeChange={() => endRef.current.scrollToEnd({ animated: true })}>   

                {/*Page title*/}
                <Text style={closeFocusStyle.textTitle} accessible={true} accessibilityLabel="Depth range (close up)" accessibilityRole="text">Depth Range (Close Up)</Text>

                {/*Page intro/instructions*/}
                <Text style={closeFocusStyle.text} accessible={true} accessibilityLabel="Use this tool when you can restrict the visible distance range in your image. Enter the farthest visible object, and this will calculate the closest possible subject that will produce a 'legal' (comfortably viewable) stereo photo. The f-stop displayed will keep this entire range in sharp focus, but that's optional." accessibilityRole="text">
                    Use this tool when you can restrict the visible distance range in your image. Enter the farthest visible object, and this will calculate the closest possible subject that will produce a "legal" (comfortably viewable) stereo photo. The f-stop displayed will keep this entire range in sharp focus, but that's optional.
                </Text>


                {/*Dropdown menu to select the lens (will determine the focal length for calculations*/}
                <Text style={closeFocusStyle.text} accessible={true} accessibilityLabel="Select lens" accessibilityRole="text">Select lens:</Text>
                <SelectList 
                    setSelected={(val) => setSelectedLens(val)}
                    data= {lensName}
                    save="value"
                    boxStyles={{marginBottom:12}}
                    dropdownTextStyles={{color:'white'}}
                    inputStyles={{color:'white'}}
                    accessible={true}
                    accessibilityLabel="A searchable dropdown menu to select a lens to calculate the close focus distance for"
                />

                {/*Text input where users can enter their far subject distance value.*/}
                <Text style={closeFocusStyle.text} accessible={true} accessibilityLabel="Far subject distance" accessibilityRole="text">Far subject distance:</Text>  
                <View style={closeFocusStyle.contentBlock}>
                    <TextInput
                        style={closeFocusStyle.input}
                        onChangeText={setFarDist}
                        value={farDist}
                        placeholder='0'
                        inputMode='decimal'
                        keyboardType='decimal-pad'
                        enterKeyHint='done'
                        returnKeyType='done'
                        accessible={true}
                        accessibilityLabel="Text entry box to enter the far subject distance using the selected units"
                    />
                    {/*Group of radio buttons to select the units that the user will use for their subject distance input */}
                    <RadioGroup 
                        radioButtons={unitsRadioButtons} 
                        onPress={setUnits}
                        selectedId={units}
                        containerStyle={closeFocusStyle.radioButton}
                        layout="row"
                        accessible={true}
                        accessibilityRole="radiogroup"
                    />
                </View>

                {/*Button to click to calculate/show results*/}
                <View style={closeFocusStyle.button} accessible={true} accessibilityLabel="Click to show the calculated close focus results, will not change to a different screen" accessibilityRole="button">
                    <Button 
                        title= "Calculate Close Focus"
                        onPress={() => calculateCloseFocus()}
                        color="#000000"
                    />
                </View>

                {/*Results*/}
                {showResults ? (<Text style={closeFocusStyle.textResult} accessible={true} accessibilityLabel="Close focus distance results" accessibilityRole="text">Close focus distance: {closeFocus} {displayUnits}</Text>) : null}
                {showResults ? (<Text style={closeFocusStyle.textResult} accessible={true} accessibilityLabel="Aperature for the entire range" accessibilityRole="text">Aperature for the entire range: f/{fStop}</Text>) : null}
        
            </KeyboardAwareScrollView>
        </SafeAreaView>    
    )
}

// Stylesheet for the close focus calculator screen
const closeFocusStyle = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'black',
      justifyContent: 'top',
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
    backArrow: {
		color: 'white',
		marginTop: 55,
		margin: 10,
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


export default CloseFocusScreen;