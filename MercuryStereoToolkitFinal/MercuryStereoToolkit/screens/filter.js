import React, { useEffect, useRef, useState, useMemo } from "react";
import { StyleSheet, View , Text, Image, Pressable, Button, TextInput, ScrollView, Platform} from 'react-native';

// Special imports for this file, see README for links with more information about them
import { SelectList } from 'react-native-dropdown-select-list';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";




const filterList = [
    {key: '1', value: 'ND2', lightLoss: 0.5, desc: 'Enables wider apertures or longer shutter speeds in bright sunlight'},
    {key: '2', value: 'ND4', lightLoss: 1, desc: 'Enables wider apertures or longer shutter speeds in bright sunlight'},
    {key: '3', value: 'ND8', lightLoss: 2, desc: 'Enables wider apertures or longer shutter speeds in bright sunlight'},
    {key: '4', value: 'ND16', lightLoss: 4, desc: 'Enables wider apertures or longer shutter speeds in bright sunlight'},
    {key: '5', value: 'Polarizer', lightLoss: 3.5, desc: 'Removes reflections from non-metallic surfaces, can darken some skies'},
    {key: '6', value: 'IR 72', lightLoss: 4, desc: 'For IR-extended films, blocks visible light for IR photography'},
    {key: '7', value: 'Red 25', lightLoss: 3, desc: 'BW: Produces very dark skies and darkened foliage'},
    {key: '8', value: 'Yellow 8', lightLoss: 1, desc: 'BW: Slightly darkens skies and increases contrast'},
    {key: '9', value: 'Yellow 15', lightLoss: 1.3, desc: 'BW: Darkens sky and significantly increases contrast'},
    {key: '10', value: 'Green 11', lightLoss: 2, desc: 'BW: Lightens foliage, slightly darkens skies, makes for nice skin tones'},
    {key: '11', value: '85', lightLoss: 1.6, desc: 'To shoot Tungsten film in daylight'},
    {key: '12', value: '80A', lightLoss: 2, desc: 'To shoot Daylight film in Tungsten light'},
];


const BackArrow = () => {
  return (
      <Image
        style={{ width: 18, height: 18, alignSelf: 'left'}}
        source={require('../assets/images/backarrow.png')}
      />

  )
}


const FilterScreen = () => {
	const navigation = useNavigation();

	const endRef = useRef();
	const [filterHold, setFilterHold] = useState(null);
	const [showResults, setShowResults] = useState(false);
	const [iso, setIso] = useState(0);
	const [result, setResult] = useState(null);

	const calculateFilter = () =>{
		if(filterHold === null){
			//setFilterHold(1);
			return;
		}
		let lightLoss = filterList[filterHold-1].lightLoss;
		let integer = Math.floor(lightLoss);
		let decimal = lightLoss%1;
		let finalIso;
		if(decimal === 0){decimal = 1}
		if(integer === 0){
			finalIso = iso*decimal;
		}
		else{
			finalIso = (iso/(2*integer))*decimal;
		}
		setResult(finalIso);









	}

	return(
		<SafeAreaView style={filterStyle.container}>

		{Platform.OS === 'ios' ? <Pressable style={filterStyle.backArrow} onPress={() => navigation.navigate("Home")}>
			<BackArrow/>
        </Pressable> : null}

		<KeyboardAwareScrollView
            ref={endRef}

            enableOnAndroid={true}
            enableAutomaticScroll={(Platform.OS === 'ios')}
            extraScrollHeight={100} // (when scroll)to have extra height between keyboard and text input
            extraHeight={80} // make some height so the keyboard wont cover other component
            //contentContainerStyle={{flexGrow: 1}} // make the scrollView full screen
            contentContainerStyle={{paddingBottom: 60}}
        >
			<Text style={filterStyle.textTitle}>Filter Calculator</Text>
			<Text style={[filterStyle.text, {margin: 10}]}>Select Filter</Text>
			<SelectList
                setSelected={(val) => setFilterHold(val)}
                data= {filterList}
                save="desc"
                boxStyles={{marginBottom:12}}
                dropdownTextStyles={{color:'white'}}
                inputStyles={{color:'white'}}
                accessible={true}
                accessibilityLabel="A searchable dropdown menu to select a lens to calculate the iso change for filter"
            />
            <Text style={[filterStyle.text, {fontSize: 24}]}>Lens Description:</Text>
            {filterHold ? <Text style={[filterStyle.description, {marginBottom: 4}]}>Light Loss: {(filterList[filterHold-1].lightLoss)}</Text> : null}
            {filterHold ? <Text style={filterStyle.description}>{(filterList[filterHold-1].desc)}</Text> : null}



			<View style={filterStyle.contentBlock}>
                <Text style={filterStyle.text} accessible={true} accessibilityLabel="Enter ISO" accessibilityRole="text">Enter ISO:</Text>
                <TextInput
                  style={filterStyle.input}
                  onChangeText={setIso}
                  value={iso}
                  placeholder='0'
                  defaultValue='0'
                  placeholderTextColor='#F2F2F2'
                  inputMode='decimal'
                  keyboardType='decimal-pad'
                  enterKeyHint='done'
                  returnKeyType='done'
                  onSubmitEditing={() => calculateFilter}
                  accessible={true}
                  accessibilityLabel="Text entry box to enter a ISO"
                />
            </View>
            <View style={filterStyle.button} accessible={true} accessibilityLabel="Click to show the calculated base distance results, will not change to a different screen" accessibilityRole="button">
                <Button
                    title= "Calculate filter change"
                    onPress={() => calculateFilter()}
                    color="#000000"
                />
            </View>


            {result ? <Text style={[filterStyle.textResult, {fontSize: 30}]}>ISO after Filter: {result}</Text> : null}




            </KeyboardAwareScrollView>
		</SafeAreaView>


	)
}
const filterStyle = StyleSheet.create({

	container: {
		flex: 1,
		backgroundColor: 'black',
		justifyContent: 'tops',
		marginTop:60,

	},
	textTitle: {
		color: 'white',
		marginTop:0,
		margin: 5,
		fontSize: 35,
		textAlign: 'center',
		fontWeight: 'bold',
	},
	backArrow: {
		color: 'white',
		marginTop: 0,
		margin: 10,
	},
	input: {
      height: 40,
      width: 80,
      margin: 5,
      borderWidth: 1,
      padding: 10,
      borderColor: 'white',
      color: 'white',
      borderRadius: 10,
      alignSelf: 'flex-start',
    },
	contentBlock: {
      flex: .2,
      flexDirection: 'row',
      marginTop: 20,
    },
    text: {
      color: 'white',
      margin: 8,
      marginTop: 13,
      fontSize: 20,
      textAlign: 'left',
      alignSelf: 'flex-start',
    },
    textResult: {
      color: 'red',
      margin: 8,
      marginTop: 13,
      fontSize: 20,
      textAlign: 'center',
      alignSelf: 'center',
    },
    description: {
      color: 'white',
      margin: 8,
      marginTop: 8,
      marginLeft: 25,
      fontSize: 20,
      textAlign: 'left',
      alignSelf: 'flex-start',
    },
	button: {
      backgroundColor: 'white',
      padding: 5,
      margin: 20,
      borderRadius: 10,
    },


})



export default FilterScreen;