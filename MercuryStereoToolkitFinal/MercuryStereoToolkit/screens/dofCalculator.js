// See README.md for information about this file and how to make updates


// NECESSARY UPDATES: INCLUDE OPTION FOR USERS TO SELECT WHETHER THEY WANT TO SEE RESULTS IN METERS OR FEET, AND CALCULATE THAT CONVERSION
// ALSO HAVE CALRIFY ABOUT USING THE BASE DURING HYPERFOCAL CALCULATION FOR LENSES WITHOUT SPACERS

import React, { useEffect, useRef, useState, useMemo } from "react";
import { Platform, StyleSheet, View , Text, Image, Pressable, Button, ScrollView } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";


// Special imports for this file, see README for links with more information about them
import { SelectList } from 'react-native-dropdown-select-list'; 
import SegmentedControlTab from "react-native-segmented-control-tab";
import RadioGroup from 'react-native-radio-buttons-group';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

//All lens data, sorted by focal length
const lensData = [
    {id:'1', name:'Super-Angulon 47mm f/5.6', base:['none', 'none', 'none', 'none'], spacer:['none', 'S1', 'S2', 'S3'], bolts:['Light Blue (10)', 'Light Blue (10)', 'Light Blue (10)', 'Light Blue (10)'], subj_dist:['INF', 25, 12, 6.5], f_22:['7 - INF', '5.75 - INF', '4.5 - INF', '3.5 - 46'], f_16:['10 - INF', '6.5 - INF', '5.5 - INF', '4 - 12'], f_8:['20 -  INF', '12 - INF', '7.5 - 30', '5 - 9']},
    {id:'2', name:'Super-Angulon 47mm f/5.6 XL', base:['none', 'none', 'none'], spacer:['S1', 'S2', 'S3'], bolts:['Blue (10)', 'Blue (10)', 'Blue (10)'], subj_dist:[40, 17, 10], f_22:['6 - INF', '5 - INF', '4.25 - INF'], f_16:['8 - INF', '6.5 - INF', '5 - 500'], f_8:['13 -  INF', '9.5 - 105', '7 - 20']},
    {id:'3', name:'Bronica 50mm 2.8 MC', base:['BASE 14', 'BASE 14', 'BASE 14', 'BASE 14'], spacer:['1', '2', '3', '4'], bolts:['Gray (35)', 'Gray (35)', 'Gray (35)', 'Gray (35)'], subj_dist:[150, 45, 10, 6], f_22:['7.75 - INF', '7 - INF', '4.5 - INF', '3.5 - 22'], f_16:['10.5 - INF', '9 - INF', '5.5 - 75', '4 - 12'], f_8:['20 -  INF', '15 - INF', '7 - 18', '5 - 8']},
    {id:'4', name:'Mamiya Sekor 55mm f/4.5 (TLR)', base:['BASE 17', 'BASE 17', 'BASE 17', 'BASE 17', 'BASE 17', 'BASE 17', 'BASE 17'], spacer:['2', '3', '4', '5', '6', '7', '8'], bolts:['Black (40W)', 'Black (40W)', 'Black (40W)', 'Black (40W)', 'Black (40W)', 'Black (40W)', 'Black (40)'], subj_dist:['INF', 25, 12, 8.5, 6, 4.75, 3.5], f_22:['10 - INF', '7 - INF', '5.4 - INF', '4.5 - 58', '3.75 - 15', '3.25 - 9', '2.6 - 5.3'], f_16:['13 - INF', '9 - INF', '6.5 - 84', '5.3 - 21.5', '4.2 - 10.4', '3.6 - 7', '2.8 - 4.6'], f_8:['26 - INF', '13 - 250', '8.4 - 21', '6.5 - 12', '5 - 7.6', '4 - 5.7', '3.1 - 4']},
    {id:'5', name:'Apo-Digitar 60mm f/4', base:['BASE 4.6', 'BASE 5', 'BASE 5.5'], spacer:['none', 'none', 'none'], bolts:['Black (18W)', 'Black (18W)', 'Black (18W)'], subj_dist:[9, 7.5, 5], f_22:['5 - 37', '4.5 - 20', '3.5 - 8.5'], f_16:['5.5 - 19', '5.25 - 13.5', '3.75 - 7'], f_8:['7 - 12', '6.25 - 9.5', '4.25 - 5.5']},
    {id:'6', name:'Mamiya Sekor 65mm f/3.5 (TLR)', base:['BASE 12', 'BASE 12', 'BASE 12', 'BASE 12', 'BASE 12', 'BASE 12', 'BASE 12', 'BASE 12'], spacer:['1', '2', '3', '4', '5', '6', '7', '8'], bolts:['Gray (35W)', 'Gray (35W)', 'Gray (35W) or Gray (35)', 'Gray (35W) or Gray (35)', 'Gray (35)', 'Gray (35)', 'Gray (35)', 'Gray (35)'], subj_dist:[50, 14, 10, 7, 6, 5, 4.5, 3.75], f_22:['10.5 - INF', '7 - INF', '5.5 - 35', '4.7 - 14', '4 - 10.5', '3.7 - 7.7', '3.4 - 6.5', '3.1 - 5.5'], f_16:['14 - INF', '8 - 50', '6.5 - 20', '5 - 10.5', '4.5 - 8.5', '4 - 6.5', '3.7 - 5.8', '3.3 - 5'], f_8:['22 - INF', '10 - 22', '8 - 13', '6 - 8.5', '5 - 7', '4.5 - 5.5', '4 - 5', '3.6 - 4.4']},    
    {id:'7', name:'Grandagon 65mm f/4.5', base:['BASE 8', 'BASE 8', 'BASE 8', 'BASE 8', 'BASE 8', 'BASE 8', 'BASE 8', 'BASE 8', 'BASE 8'], spacer:['2', '3', '4', '5', '6', '7', '8', '9', '10'], bolts:['Brown (30)', 'Brown (30) or Gray (35W)', 'Brown (30) or Gray (35W)', 'Brown (30) or Gray (35W)', 'Brown (30) or Gray (35W)', 'Brown (30) or Gray (35W)', 'Gray (35W)', 'Gray (35W)', 'Gray (35W)'], subj_dist:['INF', 75, 25, 12, 9, 6, 4.75, 4.5, 3.75], f_22:['13.25 - INF', '11.5 - INF', '8.75 - INF', '6.5 - 89.5', '5.5 - 25.5', '4.25 - 10.5', '3.5 - 7.25', '3.5 - 6.5', '3 - 5'], f_16:['18.5 - INF', '15.5 - INF', '11 - INF', '7.5 - 31', '6.25 - 16.5', '4.5 - 8.5', '3.75 - 6.25', '3.75 - 5.75', '3.25 - 4.5'], f_8:['35.75 - INF', '25.5 - INF', '15.25 - 70.5', '9.25 - 17.25', '7.25 - 11.75', '5.25 - 7', '4.25 - 5.5', '4 - 5', '3.5 - 4.25']},
    {id:'8', name:'Angulon 65mm f/6.8', base:['none', 'none', 'none', 'none', 'none', 'none', 'none', 'none', 'none'], spacer:['5', '6', '7', '8', '9', '10', '11', '12', '13'], bolts:['Light Green (25W)', 'Light Green (25W)', 'Light Green (25W)', 'Light Green (25W)', 'Light Green (25W)', 'Light Green (25)', 'Light Green (25)', 'Light Green (25)', 'Light Green (25)'], subj_dist:['INF', 100, 25, 12, 9, 7, 5, 4.25, 3.5], f_22:['13.25 - INF', '12 - INF', '9 - INF', '6.5 - 89.5', '5.5 - 25.5', '4.5 - 14', '3.75 - 7.75', '3.25 - 6', '2.75 - 4.5'], f_16:['18.5 - INF', '16.25 - INF', '11 - INF', '7.5 - 31', '6.25 - 16.5', '5.25 - 10.75', '4 - 6.75', '3.5 - 5.5', '3 - 4.25'], f_8:['35.75 - INF', '27.75 - INF', '15.25 - 70.25', '9.25 - 17.25', '7.5 - 11.75', '6 - 8.5', '4.5 - 5.75', '3.75 - 4.75', '3.25 - 3.75']},
    {id:'9', name:'Super-Angulon 65mm f/8', base:['BASE 9', 'BASE 9', 'BASE 9', 'BASE 9', 'BASE 9', 'BASE 9', 'BASE 9', 'BASE 9'], spacer:['1', '2', '3', '4', '5', '6', '7', '8'], bolts:['Brown (30)', 'Brown (30)', 'Brown (30)', 'Brown (30)', 'Brown (30)', 'Brown (30) or Gray(35W)', 'Gray (35W)', 'Gray (35W)'], subj_dist:['INF', 40, 15, 10, 8, 6.5, 5, 4], f_22:['13.25 - INF', '10.25 - INF', '7.25 - INF', '5.75 - 35.5', '5 - 18.75', '4.5 - 12', '3.75 - 7.75', '3.25 - 5.5'], f_16:['18.5 - INF', '13 - INF', '8.5 - 64.75', '6.75 - 20.25', '5.75 - 13.5', '5 - 9.75', '4 - 6.75', '3.25 - 5'], f_8:['36 - INF', '19.75 - INF', '10.75 - 24.5', '8 - 13.5', '6.75 - 10', '5.5 - 7.75', '4.5 - 5.75', '3.75 - 4.5']},
    {id:'10', name:'Fujinon 65mm f/8', base:['BASE 10', 'BASE 10', 'BASE 10', 'BASE 10', 'BASE 10', 'BASE 10', 'BASE 10', 'BASE 10'], spacer:['1', '2', '3', '4', '5', '6', '7', '8'], bolts:['Brown (30)', 'Brown (30)', 'Brown (30)', 'Brown (30)', 'Brown (30)', 'Brown (30) or Gray(35W)', 'Gray (35W)', 'Gray (35W)'], subj_dist:['INF', 20, 9, 7.5, 6, 5, 4.5, 3.75], f_22:['13.25 - INF', '8.25 - INF', '5.5 - 25.5', '5 - 16', '4.25 - 10.5', '3.75 - 7.75', '3.5 - 6.5', '3 - 5'], f_16:['18.5 - INF', '9.75 - INF', '6.25 - 16.5', '5.5 - 12', '4.75 - 8.5', '4 - 6.75', '3.75 - 5.75', '3.25 - 4.5'], f_8:['35.75 - INF', '13.25 - 41', '7.25 - 11.75', '6.25 - 9.25', '5.25 - 7', '4.5 - 5.75', '4 - 5', '3.5 - 4.25']},
    {id:'11', name:'Super Topcor 65mm f/7', base:['BASE 9', 'BASE 9', 'BASE 9', 'BASE 9', 'BASE 9', 'BASE 9'], spacer:['1', '2', '3', '4', '5', '6'], bolts:['Brown (30)', 'Brown (30)', 'Brown (30)', 'Brown (30)', 'Brown (30)', 'Brown (30)'], subj_dist:[175, 30, 15, 9, 7.5, 5.5], f_22:['12.5 - INF', '9.5 - INF', '7.25 - INF', '5.5 - 25.5', '5 - 16', '4 - 9'], f_16:['17.5 - INF', '11.75 - INF', '8.5 - 64.5', '6.25 - 16.5', '5.5 - 12', '4.25 - 7.5'], f_8:['31.5 - INF', '17 - 132', '10.75 - 24.5', '7.25 - 11.5', '6.25 - 9.25', '5 - 6.25']},
    {id:'12', name:'Graflex Optar 65mm f/6.8', base:['BASE 8', 'BASE 9', 'BASE 10', 'BASE 11', 'BASE 12'], spacer:['none', 'none', 'none', 'none', 'none'], bolts:['Black (18W)', 'Black (18)', 'Black (18)', 'Light Green (25W)', 'Light Green (25W)'], subj_dist:['INF', 35, 15, 6, 4.5], f_22:['13.5 - INF', '9.75 - INF', '7.25 - INF', '4.25 - 10.5', '3.5 - 6.5'], f_16:['19.25 - INF', '12.5 - INF', '8.5 - 64.75', '4.75 - 8.5', '3.75 - 5.75'], f_8:['38.5 - INF', '18.5 - 362.5', '10.75 - 24.5', '5.25 - 7', '4 - 5',]},
    {id:'13', name:'Horseman 75mm f/5.6', base:['BASE 12', 'BASE 12', 'BASE 12', 'BASE 12', 'BASE 12', 'BASE 12', 'BASE 12', 'BASE 12'], spacer:['1', '2', '3', '4', '5', '6', '7', '8'], bolts:['Gray (35W)', 'Gray (35W)', 'Gray (35W)', 'Gray (35W)', 'Gray (35W)', 'Gray (35)', 'Gray (35)', 'Gray (35)'], subj_dist:[100, 40, 20, 12, 10, 8, 7.3, 5], f_22:['15.5 - INF', '12.5 - INF', '9.5 - INF', '7.25 - 34', '6.5 - 21.75', '5.75 - 14', '5.25 - 12', '4 - 6.75'], f_16:['20.5 - INF', '15.75 - INF', '11.25 - 87', '8.25 - 22.25', '7.25 - 16', '6.25 - 11.5', '5.75 - 10', '4.25 - 6'], f_8:['34 - INF', '22.5 - 178', '14.5 - 32.5', '9.75 - 15.5', '8.5 - 12.25', '7 - 9.5', '6.5 - 8.5', '4.5 - 5.5']},
    {id:'14', name:'Grandagon 75mm f/6.8', base:['BASE 16', 'BASE 16', 'BASE 16', 'BASE 16', 'BASE 16', 'BASE 16', 'BASE 16', 'BASE 16', 'BASE 16', 'BASE 16'], spacer:['2', '3', '4', '5', '6', '7', '8', '9', '10', '11'], bolts:['Black (40W)', 'Black (40W)', 'Black (40W)', 'Black (40W)', 'Black (40W) or Black (40)', 'Black (40W) or Black (40)', 'Black (40)', 'Black (40)', 'Black (40)', 'Black (40)'], subj_dist:[150, 30, 16, 12, 9, 7.25, 6, 5, 4.5, 4], f_22:['16.25 - INF', '11.5 - INF', '8.5 - 122', '7.25 - 34', '6 - 17.5', '5.25 - 11.75', '4.5 - 8.75', '4 - 6.75', '3.75 - 5.75', '3.25 - 5'], f_16:['22 - INF', '14 - INF', '10 - 41.5', '8.25 - 22.25', '6.75 - 13.75', '5.75 - 10', '5 - 7.75', '4.25 - 6.25', '4 - 5.5', '3.5 - 4.75'], f_8:['38.5 - INF', '19 - 71.5', '12.25 - 23', '9.75 - 15.5', '7.75 - 11', '6.5 - 8.5', '5.5 - 6.75', '4.5 - 5.5', '4.25 - 5', '3.75 - 4.25']},
    {id:'15', name:'Super-Angulon 75mm f/8', base:['BASE 21', 'BASE 21', 'BASE 21', 'BASE 21', 'BASE 21', 'BASE 21', 'BASE 21', 'BASE 21', 'BASE 21', 'BASE 21'], spacer:['2', '3', '4', '5', '6', '7', '8', '9', '10', '11'], bolts:['Black (40) or White (45W)', 'Black (40) or White (45W)', 'White (45W)', 'White (45W)', 'White (45W)', 'White (45W)', 'White (45W) or White (45)', 'White (45)', 'White (45)', 'White (45)'], subj_dist:[150, 40, 20, 14, 11, 8, 6.5, 5.5, 4.75, 4], f_22:['16.25 - INF', '12.5 - INF', '9.5 - INF', '8 - 58', '7 - 27', '5.5 - 14', '4.75 - 10', '4.25 - 7.75', '3.75 - 6.25', '3.25 - 5'], f_16:['22 - INF', '15.75 - INF', '11.25 - 87', '9.25 - 30.25', '7.75 - 19', '6.25 - 11.5', '5.25 - 8.5', '4.5 - 7', '4 - 5.75', '3.5 - 4.75'], f_8:['38.5 - INF', '22.5 - 178', '14.5 - 32.5', '11 - 19', '9 - 14', '7 - 9.5', '5.75 - 7.5', '5 - 6.25', '4.5 - 5.25', '3.75 - 4.25']},
    {id:'16', name:'Fujinon SW 75mm f/8', base:['BASE 21', 'BASE 21', 'BASE 21', 'BASE 21', 'BASE 21', 'BASE 21', 'BASE 21', 'BASE 21', 'BASE 21', 'BASE 21'], spacer:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], bolts:['Black (40)', 'Black (40)', 'Black (40) or White (45W)', 'Black (40) or White (45W)', 'White (45W)', 'White (45W)', 'White (45W)', 'White (45W) or White (45)', 'White (45)', 'White (45)'], subj_dist:['INF', 200, 50, 19, 11, 9, 7, 5.2, 4.75, 4.2], f_22:['16.25 - INF', '16.5 - INF', '13.5 - INF', '9.25 - INF', '7 - 27', '6 - 17.5', '5 - 11.25', '4 - 7.25', '3.75 - 6.25', '3.25 - 5'], f_16:['24.5 - INF', '22.75 - INF', '17 - INF', '11 - 71', '7.75 - 19', '6.75 - 13.75', '5.5 - 9.5', '4.5 - 6.5', '4 - 5.75', '3.5 - 4.75'], f_8:['46.5 - INF', '41 - INF', '25.5 - 1699', '14 - 30', '9 - 14', '7.75 - 11', '6.25 - 8', '4.75 - 5.75', '4.5 - 5.25', '3.75 - 4.25']},
    {id:'17', name:'Mamiya Sekor 80mm f/2.8 (TLR)', base:['BASE 12', 'BASE 12', 'BASE 12', 'BASE 12', 'BASE 12', 'BASE 12', 'BASE 12', 'BASE 12', 'BASE 12', 'BASE 12', 'BASE 12', 'BASE 12'], spacer:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], bolts:['Gray (35W)', 'Gray (35W)', 'Gray (35W) or Gray (35)', 'Gray (35W) or Gray (35)', 'Gray (35)', 'Gray (35)', 'Gray (35)', 'Gray (35)', 'Gray (35) or Black (40W)', 'Gray (35) or Black (40W)', 'Black (40W)', 'Black (40W)'], subj_dist:[200, 30, 20, 13, 12, 9, 7.5, 6, 5.5, 5, 4.5, 4], f_22:['19 - INF', '12 - INF', '10 - INF', '8 - 34', '7.6 - 28', '6.25 - 15.5', '5.5 - 11.5', '4.5 - 8.25', '4.4 - 7.4', '4 - 6.5', '3.75 - 5.6' ,'3.4 - 4.9'], f_16:['25.5 - INF', '15 - INF', '12 - 62', '9 - 23', '8.5 - 20', '7 - 12.8', '6 - 10', '5 - 7.5', '4.6 - 6.7',  '4.3 - 6', '4 - 5.25', '3.5 - 5'], f_8:['45 - INF', '20 - 61', '15 - 30', '10.5 - 16.5', '10 - 52', '7.75 - 10.5', '6.5 - 8.5', '5.5 - 6.5', '5 - 6',  '4.6 - 5.4', '4.2 - 4.8', '3.75 - 4.25']},
    {id:'18', name:'Heligon 80mm f/2.8', base:['BASE 19', 'BASE 19', 'BASE 19', 'BASE 19', 'BASE 19', 'BASE 19', 'BASE 19', 'BASE 19', 'BASE 19', 'BASE 19', 'BASE 19', 'BASE 19'], spacer:['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'], bolts:['Black (40)', 'Black (40) or Black (40W)', 'Black (40) or Black (40W)', 'Black (40) or Black (40W)', 'Black (40) or Black (40W)', 'White (45W)', 'White (45W)', 'White (45W)', 'White (45W)', 'White (45W) or White (45)', 'White (45)', 'White (45)'], subj_dist:[200, 30, 20, 12, 10, 8, 7, 6, 5.5, 5, 4.5, 4], f_22:['18.75 - INF', '12.25 - INF', '10.25 - 467', '7.75 - 28', '6.75 - 19', '5.75 - 12.75', '5.25 - 10.5', '4.75 - 8.25', '4.5 - 7.25', '4 - 6.5', '3.75 - 5.75' ,'3.5 - 5'], f_16:['25.5 - INF', '15 - INF', '12 - 62', '8.5 - 20', '7.5 - 15', '6.25 - 11', '5.75 - 9', '5 - 7.5', '4.75 - 6.75',  '4.25 - 6', '4 - 5.25', '3.5 - 4.5'], f_8:['45.25 - INF', '20 - 61.25', '15 - 30.25', '10 - 15', '8.5 - 12', '7 - 9.25', '6.25 - 8', '5.5 - 6.75', '5 - 6',  '4.75 - 5.5', '4.25 - 4.75', '3.75 - 4.25']},
    {id:'19', name:'Apo-Digitar 80mm f/4', base:['BASE 17', 'BASE 17', 'BASE 17', 'BASE 17', 'BASE 17', 'BASE 17', 'BASE 17', 'BASE 17'], spacer:['2', '3', '4', '5', '6', '7', '8', '9'], bolts:['Black (40W)', 'Black (40W)', 'Black (40W)', 'Black (40W)', 'Black (40W)', 'Black (40)', 'Black (40)', 'Black (40)'], subj_dist:[60, 25, 15, 12, 9, 8, 6, 5.5], f_22:['15.5 - INF', '11.5 - INF', '8.75 - 52.5', '7.75 - 28', '6.5 - 15.5', '5.75 - 12.75', '4.75 - 8.25', '4.5 - 7.25'], f_16:['19.75 - INF', '13.5 - 165', '10 - 30.25', '8.5 - 20', '7 - 12.75', '6.5 - 11', '5 - 7.5', '4.75 - 6.75'], f_8:['30 - INF', '17.5 - 43.5', '12 - 20', '10 - 15', '7.75 - 10.5', '7 - 9.25', '5.5 - 6.75', '5 - 6']},
    {id:'20', name:'Apo-Digitar 90mm f/4.5', base:['BASE 25', 'BASE 25', 'BASE 25', 'BASE 25', 'BASE 25', 'BASE 25', 'BASE 25', 'BASE 25', 'BASE 25', 'BASE 25', 'BASE 25', 'BASE 25', 'BASE 25', 'BASE 25'], spacer:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'], bolts:['White (45)', 'White (45)', 'White (45)', 'White (45) or Yellow (50W)', 'White (45) or Yellow (50W)', 'White (45) or Yellow (50W)', 'Yellow (50W)', 'Yellow (50W)', 'Yellow (50W)', 'Yellow (50)', 'Yellow (50)', 'Yellow (50)', 'Yellow (50)', 'Orange (55W)'], subj_dist:['INF', 150, 60, 22, 16, 12, 10, 8, 7, 6, 5.5, 5, 4.5, 3.75], f_22:['24.75 - INF', '22.25 - INF', '18.25 - INF',  '12 - 131', '10 - 40.25', '8.25 - 21.75', '7.25 - 16', '6.25 - 11.5', '5.5 - 9.5', '5 - 7.75', '4.5 - 6.75', '4.25 - 6' , '4 - 5.25', '3.25 - 4.25'], f_16:['34.5 - INF', '29.75 - INF', '23 - INF', '14 - 53.5', '11.25 - 27.75', '9.25 - 17.5', '8 - 13.5', '6.75 - 10', '6 - 8.5', '5.25 - 7', '4.75 - 6.5',  '4.5 - 5.75', '4 - 5', '3.5 - 4.25'], f_8:['64.5 - INF', '49.5 - INF', '33.25 - 314', '17 - 31.25', '13.25 - 20.25', '10.5 - 14.25', '8.75 - 11.5', '7.25 - 9', '6.5 - 7.75', '5.5 - 6.5', '5.25 - 6',  '4.75 - 5.25', '4.25 - 4.75', '3.5 - 4']},
    {id:'21', name:'Angulon 90mm f/6.8', base:['BASE 28', 'BASE 28', 'BASE 28', 'BASE 28', 'BASE 28', 'BASE 28', 'BASE 28', 'BASE 28', 'BASE 28', 'BASE 28', 'BASE 28', 'BASE 28', 'BASE 28'], spacer:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'], bolts:['Yellow (50W)', 'Yellow (50W)', 'Yellow (50W)', 'Yellow (50)', 'Yellow (50)', 'Yellow (50)', 'Yellow (50)', 'Yellow (50)', 'Yellow (50) or Orange (55W)', 'Orange (55W)', 'Orange (55W)', 'Orange (55W) or Orange (55)', 'Orange (55)'], subj_dist:[35, 15, 12, 10, 9, 8, 7, 6, 5.5, 5, 4.5, 4.25, 4], f_22:['15 - INF', '9.5 - 34.5', '8.25 - 21.75', '7.25 - 16', '6.75 - 13.5', '6.25 - 11.5', '5.5 - 9.5', '5 - 7.75', '4.5 - 6.75', '4.25 - 6', '4 - 5.25', '3.75 - 5', '3.5 - 4.75'], f_16:['18 - 586', '10.75 - 25', '9.25 - 17.5', '8 - 13.5', '7.25 - 11.75', '6.75 - 10', '6 - 8.5', '5.25 - 7', '5 - 6.5',  '4.5 - 5.75', '4 - 5', '3.75 - 4.75', '3.75 - 4.5'], f_8:['23.75 - 66', '12.5 - 18.75', '10.5 - 14.25', '8.75 - 11.5', '8 - 10.25', '7.25 - 9', '6.5 - 7.75', '5.5 - 6.5', '5.25 - 6',  '4.75 - 5.25', '4.25 - 4.75', '4 - 4.5', '3.75 - 4.25']},
    {id:'22', name:'Tessar 100mm f/3.5', base:['BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30'], spacer:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'], bolts:['Orange (55W)', 'Orange (55W)', 'Orange (55W)', 'Orange (55W)', 'Orange (55W)', 'Orange (55W)', 'Orange (55W)', 'Orange (55W) or Orange (55)', 'Orange (55W) or Orange (55)', 'Orange (55W) or Orange (55)', 'Orange (55)', 'Orange (55)', 'Orange (55)', 'Red (60W)'], subj_dist:['INF', 40, 25, 19, 16, 13, 11, 8.5, 8, 7, 6.5, 6, 5, 4.5], f_22:['30.5 - INF', '18 - INF', '14.25 - 107',  '12 - 45.25', '10.75 - 31.25', '9.25 - 21.5', '8.25 - 16.5', '6.75 - 11.5', '6.5 - 10.5', '5.75 - 8.75', '5.5 - 8', '5 - 7.25', '4.5 - 5.75', '4 - 5.25'], f_16:['42 - INF', '21.5 - 309', '16.25 - 54.5', '13.5 - 32.25', '12 - 24.5', '10.25 - 18', '9 - 14.5', '7.25 - 10.5', '6.75 - 9.5', '6.25 - 8.25', '5.75 - 7.5',  '5.25 - 6.75', '4.5 - 5.5', '4 - 5'], f_8:['77 - INF', '28 - 71', '19.75 - 34.25', '15.75 - 24', '13.75 - 19.25', '11.5 - 15', '10 - 12.5', '7.75 - 9.25', '7.5 - 8.75', '6.5 - 7.5', '6 - 7',  '5.75 - 6.5', '4.75 - 5.25', '4.25 - 4.75']},
    {id:'23', name:'Nikkor-W 100mm f/5.6', base:['BASE 39', 'BASE 39', 'BASE 39', 'BASE 39', 'BASE 39', 'BASE 39', 'BASE 39', 'BASE 39', 'BASE 39', 'BASE 39', 'BASE 39', 'BASE 39', 'BASE 39'], spacer:['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'], bolts:['Red (60)', 'Red (60)', 'Red (60)', 'Red (60)', 'Red (60) or Dark Blue(65W)', 'Red (60) or Dark Blue(65W)', 'Dark Blue (65W)', 'Dark Blue (65W)', 'Dark Blue (65W)', 'Dark Blue (65W)', 'Dark Blue (65W) or Dark Blue (65)', 'Dark Blue (65)', 'Dark Blue (65)'], subj_dist:['INF', 40, 25, 20, 16, 13, 10, 8.75, 7.75, 7, 6.25, 5.75, 4.5], f_22:['30.5 - INF', '18 - INF', '14.25 - 107',  '12.5 - 51.5', '10.75 - 31.25', '9.25 - 21.5', '7.75 - 14.25', '7 - 11.75', '6.25 - 20', '5.75 - 8.75', '5.5 - 8', '5 - 7' , '4 - 5.25'], f_16:['42 - INF', '21.5 - 309', '16.25 - 54.5', '14 - 35.25', '12 - 24.5', '10.25 - 18', '8.25 - 12.75', '6.75 - 9.25', '6.25 - 8.25', '5.5 - 7.25', '5.25 - 6.5',  '4.25 - 5'], f_8:['77 - INF', '28 - 71', '19.75 - 34.25', '16.5 - 25.5', '13.75 - 19.25', '11.5 - 15', '9.5 - 11.25', '8 - 9.5', '7.25 - 8.5', '6.5 - 7.5', '6 - 6.75',  '5.5 - 6', '4.5 - 4.75']},
    {id:'24', name:'Apo-Digitar 100mm f/5.6', base:['BASE 35', 'BASE 35', 'BASE 35', 'BASE 35', 'BASE 35', 'BASE 35', 'BASE 35', 'BASE 35', 'BASE 35', 'BASE 35', 'BASE 35', 'BASE 35', 'BASE 35', 'BASE 35'], spacer:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'], bolts:['Orange (55)', 'Orange (55)', 'Orange (55)', 'Orange (55)', 'Orange (55) or Red (60W)', 'Orange (55) or Red (60W)', 'Red (60W)', 'Red (60W)', 'Red (60W)', 'Red (60W) or Red (60)', 'Red (60)', ' Red (60)', 'Red (60) or Dark Blue (65W)', 'Dark Blue (65W)'], subj_dist:['INF', 50, 27, 22, 16, 13, 11, 9, 8, 7, 6.3, 6, 5, 4.5], f_22:['30.5 - INF', '19.75 - INF', '14.75 - 157',  '13.25 - 67.25', '10.75 - 31.25', '9.25 - 21.5', '8.25 - 16.5', '7 - 12.25', '6.5 - 10.5', '5.75 - 8.75', '5.25 - 7.75', '5 - 7.25', '4.5 - 5.75', '4 - 5.25'], f_16:['42 - INF', '24 - INF', '17 - 65', '15 - 42', '12 - 24.5', '10.25 - 18', '9 - 14.5', '7.5 - 11', '6.75 - 9.5', '6.25 - 8.25', '5.5 - 7.25', '5.25 - 6.75',  '4.5 - 5.5', '4.25 - 5'], f_8:['77 - INF', '32.5 - 110', '21 - 38.25', '17.75 - 29', '13.75 - 19.25', '11.5 - 15', '9.75 - 12.5', '8.25 - 10', '7.5 - 8.75', '6.5 - 7.5', '6 - 6.75',  '5.75 - 6.5', '4.75 - 5.25', '4.5 - 4.75']},
    {id:'25', name:'Sironar-N 100mm f/5.6', base:['BASE 39', 'BASE 39', 'BASE 39', 'BASE 39', 'BASE 39', 'BASE 39', 'BASE 39', 'BASE 39', 'BASE 39', 'BASE 39', 'BASE 39', 'BASE 39', 'BASE 39', 'BASE 39'], spacer:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'], bolts:['Red (60)', 'Red (60)', 'Red (60)', 'Red (60)', 'Red (60)', 'Red (60)', 'Red (60)', 'Red (60)', 'Red (60) or Dark Blue (65W)', 'Dark Blue (65W)', 'Dark Blue (65W)', 'Dark Blue (65W) or Dark Blue (65)', 'Dark Blue (65)', 'Dark Blue (65)'], subj_dist:[100, 35, 21, 17, 15, 12, 10, 8.5, 8, 7, 6.5, 6, 5, 4.5], f_22:['24.5 - INF', '17 - INF', '12.75 - 58.5',  '11.25 - 35.25', '10.25 - 27.5', '8.75 - 18.75', '7.75 - 14.25', '6.75 - 11.5', '6.5 - 10.5', '5.75 - 8.75', '5.5 - 8', '5 - 7.25', '4.5 - 5.75', '4 - 5.25'], f_16:['31.5 - INF', '20 - 146.5', '14.5 - 38.5', '12.5 - 26.75', '11.25 - 22', '9.5 - 16', '8.25 - 12.75', '7.25 - 10.5', '6.75 - 9.5', '6.25 - 8.25', '5.75 - 7.5',  '5.25 - 6.75', '4.5 - 5.5', '4.25 - 5'], f_8:['48 - INF', '25.5 - 56.5', '17 - 27.25', '14.5 - 20.75', '13 - 18', '10.5 - 13.75', '9 - 11.25', '7.75 - 9.25', '7.5 - 8.75', '6.5 - 7.5', '6 - 7',  '5.75 - 6.5', '4.75 - 5.25', '4.5 - 4.75']},
    {id:'26', name:'Symmar-S 100mm f/5.6', base:['BASE 34', 'BASE 34', 'BASE 34', 'BASE 34', 'BASE 34', 'BASE 34', 'BASE 34', 'BASE 34', 'BASE 34', 'BASE 34', 'BASE 34', 'BASE 34'], spacer:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], bolts:['Orange (55)', 'Orange (55)', 'Orange (55)', 'Orange (55)', 'Orange (55)', 'Orange (55)', 'Orange (55)', 'Red (60W)', 'Red (60W)', 'Red (60W)', 'Red (60W)', 'Red (60W)'], subj_dist:['INF', 200, 60, 40, 28, 20, 15, 10, 9.5, 8, 7, 6.5], f_22:['32.25 - INF', '27.75 - INF', '21 - INF',  '18 - INF', '15 - 198.5', '12.5 - 51.5', '10.5 - 27.5', '7.75 - 14.25', '7.5 - 13.5', '6.5 - 10.5', '5.75 - 8.75', '5.5 - 8'], f_16:['45.5 - INF', '37.25 - INF', '26 - INF', '21.5 - 309', '17.5 - 71.5', '14 - 35.25', '11.5 - 22', '8.25 - 12.75', '8 - 12', '6.75 - 9.5', '6.25 - 8.25',  '5.75 - 7.5'], f_8:['91 - INF', '63 - INF', '36.5 - 174', '28 - 71', '21.5 - 40.5', '16.5 - 25.5', '13 - 18', '9 - 11.25', '8.75 - 10.5', '7.5 - 8.75', '6.5 - 7.5',  '6 - 7']},
    {id:'27', name:'Trioptar 103mm f/4.5', base:['BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30', 'BASE 30'], spacer:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'], bolts:['Yellow (50)', 'Yellow (50) or Orange (55W)', 'Yellow (50) or Orange (55W)', 'Orange (55W)', 'Orange (55W)', 'Orange (55W)', 'Orange (55W)', 'Orange (55W)', 'Orange (55W) or Orange (55)', 'Orange (55W) or Orange (55)', 'Orange (55W) or Orange (55)', 'Orange (55)', 'Orange (55)', 'Red (60W)'], subj_dist:[60, 26, 20, 15, 13, 12, 10.5, 9.5, 8, 7.5, 6.75, 6, 5, 4.5], f_22:['22 - INF', '15 - 104.25', '12.75 - 47',  '10.5 - 26.25', '9.5 - 20.5', '9 - 18.25', '8 - 15', '7.5 - 13', '6.5 - 10.25', '6.25 - 9.5', '5.75 - 8.25', '5.25 - 7.25' , '4.5 - 5.75', '4 - 5'], f_16:['27 - INF', '17 - 55.5', '14.25 - 33.75', '11.5 - 21.5', '10.25 - 17.5', '9.75 - 15.75', '8.75 - 13.25', '8 - 11.75', '7 - 9.5', '6.5 - 8.75', '6 - 7.75',  '5.5 - 6.75', '4.5 - 5.5', '4.25 - 5'], f_8:['37 - 157', '20.5 - 35.5', '16.5 - 25.25', '13 - 17.75', '11.5 - 15', '10.75 - 13.5', '9.5 - 11.75', '8.75 - 10.5', '7.5 - 8.75', '7 - 8', '6.25 - 7.25',  '5.75 - 6.25', '4.75 - 5.25', '4.25 - 4.75']},
    {id:'28', name:'Mamiya Sekor 105mm f/3.5 (TLR)', base:['BASE 34', 'BASE 34', 'BASE 34', 'BASE 34', 'BASE 34', 'BASE 34', 'BASE 34', 'BASE 34', 'BASE 34', 'BASE 34', 'BASE 34', 'BASE 34', 'BASE 34', 'BASE 34'], spacer:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'], bolts:['Orange (55) or Red (60W)', 'Orange (55) or Red (60W)', 'Orange (55) or Red (60W)', 'Orange (55) or Red (60W)', 'Orange (55) or Red (60W)', 'Red (60W)', 'Red (60W)', 'Red (60W)', 'Red (60W)', 'Red (60W)', 'Red (60W)', 'Red (60)', 'Red (60)', 'Dark Blue (65W)'], subj_dist:[100, 35, 25, 20, 16, 12.5, 10.5, 9, 8.5, 7.3, 7, 6, 5.5, 4.5], f_22:['26 - INF', '18 - INF', '15 - 81',  '13 - 45', '11 - 28', '9.3 - 19', '8.2 - 14.5', '7.25 - 12', '7 - 11', '6.1 - 9', '5.9 - 8.6', '5.2 - 7' , '4.8 - 6.4', '4 - 5'], f_16:['34 - INF', '21 - 113', '17 - 49', '14.5 - 33', '12 - 23', '10 - 16.5', '8.75 - 13', '7.6 - 11', '7.3 - 10', '6.4 - 8.5', '6.2 - 8',  '5.4 - 6.75', '5 - 6', '4.2 - 4.9'], f_8:['50 - INF', '26 - 53', '20 - 33', '16.5 - 25', '14 - 19', '11 - 14', '9.5 - 11.7', '8.3 - 9.8', '7.8 - 9.25', '6.8 - 7.8', '6.6 - 7.5',  '5.7 - 6.3', '5.25 - 5.8', '4.3 - 4.7']},
    {id:'29', name:'Apo-Symmar 120mm f/5.6', base:['FE40 + B13', 'FE40 + B13', 'FE40 + B13', 'FE40 + B13', 'FE40 + B13', 'FE40 + B13', 'FE40 + B13', 'FE40 + B13', 'FE40 + B13', 'FE40 + B13', 'FE40 + B13', 'FE40 + B13', 'FE40 + B13', 'FE40 + B13'], spacer:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'], bolts:['Gray (35)', 'Gray (35)', 'Gray (35)', 'Gray (35)', 'Gray (35)', 'Gray (35)', 'Gray (35)', 'Gray (35)', 'Black (40W)', 'Black (40W)', 'Black (40W)', 'Black (40W)', 'Black (40W)', 'Black (40W)'], subj_dist:['INF', 75, 55, 35, 25, 22, 18, 15, 12, 11, 10, 9, 8, 7], f_22:['46.5 - INF', '28.75 - INF', '25.25 - INF',  '20 - 137.75', '16.25 - 53.25', '15 - 41.25', '13 - 29', '11.5 - 22', '9.5 - 16', '9 - 14.25', '8.25 - 12.5', '7.5 - 11' , '7 - 9.5', '6.25 - 8.25'], f_16:['65.5 - INF', '35 - INF', '30 - 328', '23 - 74', '18.25 - 40', '16.5 - 32.75', '14.25 - 24.5', '12.25 - 19.25', '10.25 - 14.5', '9.5 - 13', '8.75 - 11.75',  '8 - 10.5', '7.25 - 9', '6.5 - 7.75'], f_8:['131.5 - INF', '48 - 174', '38.75 - 94.25', '27.75 - 47.5', '21 - 31', '19 - 26.25', '16 - 20.75', '13.5 - 17', '11 - 13.25', '10.25 - 12', '9.5 - 10.75',  '8.5 - 9.75', '7.5 - 8.5', '6.75 - 7.25']},
    {id:'30', name:'Wista Twin 130mm f/5.6', base:['BASE 43', 'BASE 43', 'BASE 43', 'BASE 43', 'BASE 43', 'BASE 43', 'BASE 43', 'BASE 43', 'BASE 43', 'BASE 43', 'BASE 43', 'BASE 43', 'BASE 43', 'BASE 43', 'FE40 + B8', 'FE40 + B8', 'FE40 + B8', 'FE40 + B8', 'FE40 + B8', 'FE40 + B8', 'FE40 + B8', 'FE40 + B8', 'FE40 + B8', 'FE40 + B8', 'FE40 + B8', 'FE40 + B8', 'FE40 + B8', 'FE40 + B8'], spacer:['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'], bolts:['Dark Green (70)', 'Dark Green (70)', 'Dark Green (70)', 'Dark Green (70)', 'Dark Green (70)', 'Dark Green (70)', 'Dark Green (70)', 'Dark Green (70)', 'Dark Green (70)', 'Dark Green (70)', 'Dark Green (70)', 'Dark Green (70)', 'Dark Green (70)', 'Dark Green (70)', 'Brown (30)', 'Brown (30)', 'Brown (30) or Gray (35W)', 'Brown (30) or Gray (35W)', 'Brown (30) or Gray (35W)', 'Brown (30) or Gray (35W)', 'Brown (30) or Gray (35W)', 'Gray (35W)', 'Gray (35W)', 'Gray (35W)', 'Gray (35W)', 'Gray (35W)', 'Gray (35W)', 'Gray (35W)'], subj_dist:[200, 100, 75, 40, 35, 25, 20, 18, 14, 12, 11, 10, 9, 7, 7.5, 7, 6.5, 6.25, 6, 5.5, 5.5, 5, 5, 4.6, 4.5, 4.5, 4.25, 4], f_22:['43 - INF', '35.5 - INF', '31.75 - INF',  '23.25 - 146.5', '12.5 - 96', '17.25 - 45.5', '14.75 - 31.25', '13.5 - 26.5', '11.25 - 18.5', '10 - 15.25', '9.25 - 13.75', '8.5 - 12' , '7.75 - 10.75', '6.25 - 8', '6.75 - 8.5', '6.25 - 8', '5.75 - 7.25',  '5.75 - 7', '5.5 - 6.75', '5 - 6', '5 - 6', '4.5 - 5.5', '4.5 - 5.5', '4.25 - 5', '4.25 - 4.75', '4.25 - 4.75' , '4 - 4.5', '3.75 - 4.25'], f_16:['55.75 - INF', '43.5 - INF', '38 - 2372', '26.5 - 82.25', '24.25 - 63.5', '19 - 36.75', '16 - 26.75', '14.75 - 23.25', '12 - 17', '10.5 - 14', '9.75 - 12.75',  '9 - 11.5', '8 - 10', '6.5 - 7.75', '6.75 - 8.25', '6.5 - 7.75', '6 - 7', '5.75 - 6.75', '5.5 - 6.5', '5.25 - 6', '5.25 - 6', '4.75 - 5.25', '4.75 - 5.25', '4.25 - 4.75', '4.25 - 4.75',  '4.25 - 4.75', '4 - 4.5', '3.75 - 4.25'], f_8:['87 - INF', '60.75 - 283', '50.5 - 145.5', '31.75 - 53.75', '28.5 - 45', '21.5 - 29.75', '17.75 - 23', '16.25 - 20.25', '13 - 15.5', '11.25 - 13', '10.25 - 11.75',  '9.5 - 10.75', '8.5 - 9.5', '6.75 - 7.25', '7.25 - 8', '6.75 - 7.25', '6.25 - 6.75', '6 - 6.5', '5.75 - 6.25', '5.25 - 5.75', '5.25 - 5.75', '4.75 - 5.25', '4.75 - 5.25', '4.5 - 4.75', '4.4 - 4.6',  '4.4 - 4.6', '4.15 - 4.35', '3.9 - 4.1']},
    {id:'31', name:'Mamiya Sekor 135mm f/4.5 (TLR)', base:['BASE 34', 'BASE 34', 'BASE 34', 'BASE 34', 'BASE 34'], spacer:['7', '8', '12', '13', '14'], bolts:['Red (60W)', 'Red (60W)', 'Red (60)', 'Red (60)', 'Dark Blue (65W)'], subj_dist:['INF', 50, 20, 15, 12], f_22:['50 - INF', '27 - 320', '15 - 30',  '12 - 20', '10 - 15'], f_16:['71 - INF', '31 - 124', '16.3 - 26', '12.8 - 18', '10.5 - 14'], f_8:['125 - INF', '38 - 71', '18 - 22.7', '13.8 - 16.4', '11.25 - 13']},
  ];

// Dictionary of key/value pairs for selecting a lens name from dropdown menu, sorted in order of focal length
const lensName = [
    {key:'1', value:'Super-Angulon 47mm f/5.6'},
    {key:'2', value:'Super-Angulon 47mm f/5.6 XL'},
    {key:'3', value:'Bronica 50mm 2.8 MC'},
    {key:'4', value:'Mamiya Sekor 55mm f/4.5 (TLR)'},
    {key:'5', value:'Apo-Digitar 60mm f/4'},
    {key:'6', value:'Mamiya Sekor 65mm f/3.5 (TLR)'},
    {key:'7', value:'Grandagon 65mm f/4.5'},
    {key:'8', value:'Angulon 65mm f/6.8'},
    {key:'9', value:'Super-Angulon 65mm f/8'},
    {key:'10', value:'Fujinon 65mm f/8'},
    {key:'11', value:'Super Topcor 65mm f/7'},
    {key:'12', value:'Graflex Optar 65mm f/6.8'},
    {key:'13', value:'Horseman 75mm f/5.6'},
    {key:'14', value:'Grandagon 75mm f/6.8'},
    {key:'15', value:'Super-Angulon 75mm f/8'},
    {key:'16', value:'Fujinon SW 75mm F/8'},
    {key:'17', value:'Mamiya Sekor 80mm f/2.8 (TLR)'},
    {key:'18', value:'Heligon 80mm f/2.8'},
    {key:'19', value:'Apo-Digitar 80mm f/4'},
    {key:'20', value:'Apo-Digitar 90mm f/4.5'},
    {key:'21', value:'Angulon 90mm f/6.8'},
    {key:'22', value:'Tessar 100mm f/3.5'},
    {key:'23', value:'Nikkor-W 100mm f/5.6'},
    {key:'24', value:'Apo-Digitar 100mm f/5.6'},
    {key:'25', value:'Sironar-N 100mm f/5.6'},
    {key:'26', value:'Symmar-S 100mm f/5.6'},
    {key:'27', value:'Trioptar 103mm f/4.5'},
    {key:'28', value:'Mamiya Sekor 105mm f/3.5 (TLR)'},
    {key:'29', value:'Apo-Symmar 120mm f/5.6'},
    {key:'30', value:'Wista Twin 130mm f/5.6'},
    {key:'31', value:'Mamiya Sekor 135mm f/4.5 (TLR)'},
  ];


// Dictionary of key/value pairs for the f-stop dropdown menu
const fStops = [
    {key:'1', value:'F-22'},
    {key:'2', value:'F-16'}, 
    {key:'3', value:'F-8'},
];

const BackArrow = () => {
  return (
      <Image
        style={{ width: 18, height: 18, alignSelf: 'left'}}
        source={require('../assets/images/backarrow.png')}
      />

  )
}


// Arrays of data pulled from lensData based on the lens name that is selected -- used in further calculations for results.
var baseArray = [];
var spacerArray = [];

// Arrays of data pulled from lensData based on the lens name that is selected -- only used for displaying results.
var boltArray = [];
var subjDistArray = [];
var f22Array = [];
var f16Array = [];
var f8Array = [];

// Array/dictionary of key/value pair objects used for dropdown menus. They're initialized within the function so length is always reset to 0 when the page re-renders.
var baseOptions;
var spacerOptions;

// Used when calculating the DOF to know which results to display, getting the index from either the selected base or selected spacer, depending on the lens.
var overallIndex = 0;

// Default DOF results. The actual result will be selected using the overallIndex (line 103) and the arrays declared above (lines 88 - 96)
var boltResponse= "";
var subjectDistResponse="";
var f22Response="";
var f16Response="";
var f8Response="";

// Default hyperfocal results.
var hyperfocal = 0;
var hyperfocalSpacer = "";
var hyperfocalBase = "";

// Units to use when displaying the results, updates to match selection when results are calculated
var displayUnits = "";



// DOF screen of app -- the return of this component is what is exported
const DOFScreen = ({route}) => {

  const navigation = useNavigation();
  // Reference to use to automatically scroll down to see results
  const endRef = useRef();

  // State variables used for storing data 
    const [selectedIndex, setSelectedIndex] = useState(route.params.tab);     // Stores which segmented-control tab is selected to display DOF or hyperfocal. Default value is passed in from navigation from the home screen to load the correct tab
    const [selectedLens, setSelectedLens] = useState('Apo-Digitar 35mm f/5.6 XL');    // Store the selected lens for both hyperfocal and DOF
    const [selectedBase, setSelectedBase] = useState('RS0, B6.4');            // Store the selected base for DOF calculation
    const [selectedSpacer, setSelectedSpacer] = useState('none');             // Store the selected spacer for DOF calculation
    const [selectedFStop, setSelectedFStop] = useState('F-22');               // Store the selected f-stop value for hyperfocal calculation
    //const [showBase, setShowBase] = React.useState(true);                         // Want to include this to get rid of the option to select a base when there's only one option, but as soon as I try to use it the page infinitely re - renders :/
    //const [showSpacer, setShowSpacer] = React.useState(true);                     // Want to include this to get rid of the option to select a spacer when there's only one option, but as soon as I try to use it the page infinitely re - renders :/
    const [selectedUnits, setSelectedUnits] = useState('feet');                               // Stores the selected units to display the results as the user chooses
    const [recalculateOptions, setRecalculateOptions] = useState(0);          // Because state variables are asynchronous, sometimes it gets an update behind. This variable is incremented each time we want to "force" the screen to re-render with the most up-to-date information
    const [showDOFResult, setShowDOFResult] = useState(false);                // If DOF is being calculated, this is set to true to display the correct result fields
    const [showHyperfocalResult, setShowHyperfocalResult] = useState(false);  // If hyperfocal is being calculated, this is set to true to display the correct result fields

    // Custom function to update which tab is being displayed and clear the results whenever the tab is switched
    const handleSingleIndexSelect = (index) => {
      setSelectedIndex(index);
      setShowDOFResult(false);
      setShowHyperfocalResult(false);
    };

    // Custom function to allow users to change what units are used to display their results without completely calculating results
    const handleUnits = (units) => {
      setSelectedUnits(units);    // sets the state variable

      // use as temporary local variables to reset the units
      let workingVal1;
      let workingVal2;

      if(selectedIndex == 1){     // if on the DOF screen/calculating DOF results

        // separate the result strings to be able to access the values for conversion
        let f22ResultArray = f22Response.split(' - ');
        let f16ResultArray = f16Response.split(' - ');
        let f8ResultArray = f8Response.split(' - ');
        
        // if the results are in meters and the selected units is feet
        if (units.localeCompare('feet') == 0 && selectedUnits.localeCompare('meters') == 0){
          displayUnits = "feet";

          // If subject distance is not INF, convert to feet and round to one decimal place
          if (!isNaN(subjectDistResponse)){
            workingVal1 = parseFloat(subjectDistResponse) * 3.281;
            subjectDistResponse = workingVal1.toFixed(1);
          }

          /* For the f-stop DOF ranges, the closer value will always be a number and can be converted directly. 
             For the farther value, check if it is a number and if so then convert it. 
             Then recombine the values into the response string.
          */

          // convert the near and far f-22 values to feet and round to one decimal place, then recombine the segments into the response string
          workingVal1 = parseFloat(f22ResultArray[0]) * 3.281;
          workingVal1 = workingVal1.toFixed(1);

          if (!isNaN(f22ResultArray[1])){
            workingVal2 = parseFloat(f22ResultArray[1]) * 3.281;
            workingVal2 = workingVal2.toFixed(1);

            f22Response = workingVal1 + ' - ' + workingVal2;
          }
          else {
            f22Response = workingVal1 + ' - INF';
          }

          // convert the near and far f-16 values to feet and round to one decimal place, then recombine the segments into the response string
          workingVal1 = parseFloat(f16ResultArray[0]) * 3.281;
          workingVal1 = workingVal1.toFixed(1);

          if(!isNaN(f16ResultArray[1])){
            workingVal2 = parseFloat(f16ResultArray[1]) * 3.281;
            workingVal2 = workingVal2.toFixed(1);
  
            f16Response = workingVal1 + ' - ' + workingVal2;
          }
          else {
            f16Response = workingVal1 + ' - INF';
          }
          

          // convert the near and far f-8 values to feet and round to one decimal place, then recombine the segments into the response string
          workingVal1 = parseFloat(f8ResultArray[0]) * 3.281;
          workingVal1 = workingVal1.toFixed(1);
          if(!isNaN(f8ResultArray[1])){
            workingVal2 = parseFloat(f8ResultArray[1]) * 3.281;
            workingVal2 = workingVal2.toFixed(1);
  
            f8Response = workingVal1 + ' - ' + workingVal2;
          }
          else {
            f8Response = workingVal1 + ' - INF';
          }
        }
        // results are in feet and the new unit is meters
        else if (units.localeCompare('meters') == 0 && selectedUnits.localeCompare('feet') == 0){
          displayUnits = "meters";

          // if the subject distance is not INF, convert to meters and round to one decimal place
          if(!isNaN(subjectDistResponse)){
            workingVal1 = parseFloat(subjectDistResponse) / 3.281;
            subjectDistResponse = workingVal1.toFixed(1);  
          }
          
          /* For the f-stop DOF ranges, the closer value will always be a number and can be converted directly. 
             For the farther value, check if it is a number and if so then convert it. 
             Then recombine the values into the response string.
          */

          // convert the near and far f-22 values to meters and round to one decimal place, then recombine the segments into the response string
          workingVal1 = parseFloat(f22ResultArray[0]) / 3.281;
          workingVal1 = workingVal1.toFixed(1);

          if(!isNaN(f22ResultArray[1])){
            workingVal2 = parseFloat(f22ResultArray[1]) / 3.281;
            workingVal2 = workingVal2.toFixed(1);

            f22Response = workingVal1 + ' - ' + workingVal2;
          }
          else {
            f22Response = workingVal1 + ' - INF';
          }
          

          // convert the near and far f-16 values to meters and round to one decimal place, then recombine the segments into the response string
          workingVal1 = parseFloat(f16ResultArray[0]) / 3.281;
          workingVal1 = workingVal1.toFixed(1);

          if(!isNaN(f16ResultArray[1])){
            workingVal2 = parseFloat(f16ResultArray[1]) / 3.281;
            workingVal2 = workingVal2.toFixed(1);
  
            f16Response = workingVal1 + ' - ' + workingVal2;
          }
          else {
            f16Response = workingVal1 + ' - INF';
          }
          

          // convert the near and far f-8 values to meters and round to one decimal place, then recombine the segments into the response string
          workingVal1 = parseFloat(f8ResultArray[0]) / 3.281;
          workingVal1 = workingVal1.toFixed(1);

          if(!isNaN(f8ResultArray[1])){
            workingVal2 = parseFloat(f8ResultArray[1]) / 3.281;
            workingVal2 = workingVal2.toFixed(1);
  
            f8Response = workingVal1 + ' - ' + workingVal2;
          }
          else {
            f8Response = workingVal1 + ' - INF';
          }
          
        }
      }
      else {  // selectedIndex == 0
        let hyperfocalArray = hyperfocal.split(' - ');

        // if the results are in meters and the selected units is feet
        if (units.localeCompare('feet') == 0 && selectedUnits.localeCompare('meters') == 0){
          displayUnits = "feet";

           // convert the near hyperfocal distance to feet and round to one decimal place, then recombine string in hyperfocal response
           workingVal1 = parseFloat(hyperfocalArray[0]) * 3.281;
           workingVal1 = workingVal1.toFixed(1);

           hyperfocal = workingVal1 + ' - INF';
        }
        // results are in feet and the new unit is meters
        else if (units.localeCompare('meters') == 0 && selectedUnits.localeCompare('feet') == 0){
          displayUnits = "meters";

          // convert the near hyperfocal distance to meters and round to one decimal place, then recombine string in hyperfocal response
          workingVal1 = parseFloat(hyperfocalArray[0]) / 3.281;
          workingVal1 = workingVal1.toFixed(1);

          hyperfocal = workingVal1 + ' - INF';
        }

      }
    }

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
    ]), []);

    // Function(?) executed each time a new value is selected from the lens, base, spacer, (or f-stop? might be able to remove it from that one) dropdown menus to determine what values should be in the key/value pairs that are displayed in the other menus
    const handleSelections = (lensVal, baseVal) => {

        //loop through every lens in the lensData array
        for(let i = 0; i < lensData.length; i++){

          //if the name of the selected lens matches this row of lensData
          if(lensData[i].name.localeCompare(lensVal) == 0){
    
            //take the data from lensData for the selected lens and store it in the arrays
            baseArray = lensData[i].base;
            spacerArray = lensData[i].spacer;
    
            boltArray = lensData[i].bolts;
            subjDistArray = lensData[i].subj_dist;
            f22Array = lensData[i].f_22;
            f16Array = lensData[i].f_16;
            f8Array = lensData[i].f_8;
    
            // initialize the arrays that will be used to store the key/value pairs to be displayed in the base and spacer dropdown menus
            baseOptions = [];
            spacerOptions = [];
    
            // loop through all of the options for this lens
            for(let j = 0; j < baseArray.length; j++){    //using base array becuase it's the one I made first, but all of the arrays should be the same length so the choice is arbitrary
    
              // next key for base dropdown menu based on the current length of the array
              let baseKey = baseOptions.length + 1;
              baseKey = baseKey.toString();
    
              // next key for spacer dropdown menu based on the current length of the array
              let spacerKey = spacerOptions.length + 1;
              spacerKey = spacerKey.toString();

              // assume that the next value will be a valid addition to the key/value pairs
              let validBaseVal = true;
              let validSpacerVal = true;
    

              // look through current dropdown menu of base options. if the current value from baseArray is already included, set valid to false so it isn't included twice
              for (let k = 0; k < baseOptions.length; k++){
                if(baseOptions[k].value == baseArray[j]){
                  validBaseVal = false;
                  break;
                }
              }
    
              // for a spacer to be valid, it must be listed with the currently selected base. if not, set valid to false
              if(baseArray[j].localeCompare(baseVal) != 0){
                validSpacerVal = false;
              }
    
              // if the current base is valid, add the key/value pair to the array of options for the dropdown menu
              if(validBaseVal){
                baseOptions.push({key: baseKey, value: baseArray[j]});
              }
    
              // if the current spacer is valid, add the key/value pair to the array of options for the dropdown menu
              if(validSpacerVal){
                spacerOptions.push({key: spacerKey, value: spacerArray[j]});
              }
    
            }

          }
        }

    }    
    
    // Function called when the user presses the button to calculate the DOF given their lens, base, and spacer selections
    const calculateDOF = () =>{

      // Set the state variables so that the proper results will be displayed/updated
      setShowDOFResult(true);
      setShowHyperfocalResult(false);
      setRecalculateOptions(recalculateOptions + 1);
      setSelectedUnits("feet");
      displayUnits = "feet";


      // Local variables to use in the calculation because state variables are read-only so sometimes the code doesn't like you using them
      let spacerVal = selectedSpacer;
      let baseVal = selectedBase;
      let lensVal = selectedLens;
      
      // Have to find which index from lensData has been selected to know which results to display
      // If there are multiple bases for a lens, the index will be based on the base selected. Otherwise, the index will be based on the spacer that is selected


      // if spacer isn't 'none' (which is most of the time), then the overall index will be whatever index was selected from the spacer options
      if(spacerVal.localeCompare('none') != 0){
        for(let i = 0; i < spacerOptions.length; i++){
          if(spacerOptions[i].value.localeCompare(spacerVal) == 0){

            // special case for the Wista Twin 130mm f/5.6 lens
            if (lensVal.localeCompare("Wista Twin 130mm f/5.6") == 0 && baseVal.localeCompare("FE40 + B8") == 0){
              overallIndex = i + 14;
              break;
            }
        
            // in every other case it will just be the index
            overallIndex = i;
            break;
          }
        }
      }
      // if the spacer is 'none', then the overall index will be whatever index was selected from the base options
      else {
        for(let i = 0; i < baseOptions.length; i++){
          if(baseOptions[i].value.localeCompare(baseVal) == 0){
            overallIndex = i;
            break;
          }
        }
      }

      // save the DOF results using the overallIndex to select the value from the array
      boltResponse = boltArray[overallIndex];
      subjectDistResponse = subjDistArray[overallIndex];
      f22Response = f22Array[overallIndex];
      f16Response = f16Array[overallIndex];
      f8Response = f8Array[overallIndex];
  
    }
  
    // Function (?) called when the user presses the button to calculate the hyperfocal given their lens and f-stop selections
    const calculateHyperfocal = () =>{

      // Set the state variables so that the proper results will be displayed/updated
      setShowDOFResult(false);
      setShowHyperfocalResult(true);
      setRecalculateOptions(recalculateOptions + 1);
      setSelectedUnits("feet");
      displayUnits = "feet";
  
      // Local variables for calculating results so that sate variables aren't being messed with 
      let lensVal = selectedLens;
      let fStopVal = selectedFStop;
      let fStopArray = [];
      let spacerArray = []; // I know spacer array already exists, but it's undefined within this scope so I know this exists for a reason, even if I can't remember why it works like this anymore
      let baseArray = [];   // Same thing as spacer array? idk? Also this is used when displaying results because some of the lenses have no spacers with different bases

      // Go through all of the lensData to find the data for the selected lens
      for(let i = 0; i < lensData.length; i++){
        if(lensData[i].name.localeCompare(lensVal) == 0){
  
          // Save the spacer data for the selected lens
          // MAY WANT TO EDIT THIS TO INCLUDE THE BASE DATA AS WELL
          spacerArray = lensData[i].spacer;
          baseArray = lensData[i].base;
  
          // Save the correct array of DOF values for the selected f-stop
          if(fStopVal.localeCompare('F-22') == 0){
            fStopArray = lensData[i].f_22;
          }
          else if(fStopVal.localeCompare('F-16') == 0){
            fStopArray = lensData[i].f_16; 
          }
          else {
            fStopArray = lensData[i].f_8;
          }
        }
      }
  
      // Create a local variable to compare the f-stop values to in order to find the minimum near value
      let currMinVal = 10000000;
      // Reset result spacer to an empty string
      hyperfocalSpacer = '';
  
      // Go through array of DOFs for the selected f-stop to find the one with the smallest 'near' distance that has a 'far' distance of infinity (INF)
      for(let i = 0; i < fStopArray.length; i++){

        // Check if the current string includes 'INF'
        if(fStopArray[i].includes('INF')){
          //console.log(fStopArray[i]);
  
          let focalRangeArray = fStopArray[i].split(' - ');   // Split the string into an array to isolate the 'near' distance to compare
          let focalMin = parseFloat(focalRangeArray[0]);      // Parse the 'near' distance as a float so it can be numerically compared
  
          // If the focalMin value is less than the currently stored minimum value (currMinVal), update currMinVal and save the associated DOF, spacer, and base for the results
          if(focalMin < currMinVal){
            currMinVal = focalMin;
            hyperfocal = focalMin + ' - INF';
            hyperfocalSpacer = spacerArray[i];
            hyperfocalBase = baseArray[i];
          }
        }
      }
  
    }
    

    // The return statement contains the contents displayed on the screen that the user interacts with  
    return(
      <SafeAreaView style={dofStyle.container}>
        {Platform.OS === 'ios' ? <Pressable style={dofStyle.backArrow} onPress={() => navigation.navigate("Home")}>
			<BackArrow/>
        </Pressable> : null}
        <ScrollView ref={endRef} onContentSizeChange={() => endRef.current.scrollToEnd({ animated: true })} contentContainerStyle={{paddingBottom: 60}}>
          {/*Page titles -- the one displayed depends on the value of the state variable controlled by the segmented control tab*/}
          {selectedIndex == 1 ? (<Text style={dofStyle.textTitle} accessible={true} accessibilityLabel="Depth of field" accessibilityRole="text">Depth of Field</Text>) : null}
          {selectedIndex == 0 ? (<Text style={dofStyle.textTitle} accessible={true} accessibilityLabel="Hyperfocal" accessibilityRole="text">Hyperfocal</Text>) : null}

          {/*Subtitle text to be shown on both tabs*/}
          <Text style={dofStyle.textSubtitle} accessible={true} accessibilityLabel="For Mercury Stereo Cameras" accessibilityRole="text">For Mercury Stereo Cameras</Text>
    
          {/*Segmented control tab for selecting what fields will be shown based on what the desired calculation is*/}
          <SegmentedControlTab
            values={['Hyperfocal', 'Depth of Field']}
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
            accessibilityLabels={['depth of field', 'hyperfocal']}
          />
    
    {/*Dropdown menu for selecting which lens is being used*/}
          <Text style={dofStyle.text} accessible={true} accessibilityLabel="Select lens" accessibilityRole="text">Select lens:</Text>
          <SelectList 
            setSelected={(val) => setSelectedLens(val)} // update the state variable
            data= {lensName}
            save="value"
            onSelect={handleSelections(selectedLens, selectedBase)} // update the values that should be displayed in the base and spacer dropdown menus
            boxStyles={{marginBottom:12}}
            dropdownTextStyles={{color:'white'}}
            inputStyles={{color:'white'}}
            accessible={true}
            accessibilityHint="A searchable drop down menu to select a lens option"
          />
    
    {/*Dropdown menu for selecting which base is being used*/}
          {selectedIndex==1 ? (<Text style={dofStyle.text} accessible={true} accessibilityLabel="Select base spacer" accessibilityRole="text">Select base spacer:</Text>) : null}
          {selectedIndex==1 ? (<SelectList
            setSelected={(val) => setSelectedBase(val)} // update the state variable
            data= {baseOptions}
            save="value"
            onSelect={handleSelections(selectedLens, selectedBase)} // update the values that should be displayed in the base and spacer dropdown menus
            boxStyles={{marginBottom:12}}
            dropdownTextStyles={{color:'white'}}
            inputStyles={{color:'white'}}
            accessible={true}
            accessibilityHint="A searchable drop down menu to select a base spacer option"
          />) : null}
    
      {/*Dropdown menu for selecting which spacer is being used*/}
          {selectedIndex==1 ? (<Text style={dofStyle.text} accessible={true} accessibilityLabel="Select focal spacer" accessibilityRole="text">Select focal spacer:</Text>) : null}
          {selectedIndex==1 ? (<SelectList
            setSelected={(val) => setSelectedSpacer(val)} // update the state variable
            data= {spacerOptions}
            save="value"
            onSelect={handleSelections(selectedLens, selectedBase)} // update the values that should be displayed in the base and spacer dropdown menus
            boxStyles={{marginBottom:12}}
            dropdownTextStyles={{color:'white'}}
            inputStyles={{color:'white'}}
            accessible={true}
            accessibilityHint="A searchable drop down menu to select a focal spacer option"
          />) : null}
    
      {/*Dropdown menu for selesting f-stop for hyperfocal*/}
          {selectedIndex==0 ? (<Text style={dofStyle.text} accessible={true} accessibilityLabel="Select f-stop" accessibilityRole="text">Select f-stop:</Text>) : null}
          {selectedIndex==0 ? (<SelectList
            setSelected={(val) => setSelectedFStop(val)} // update state variable 
            data={fStops}
            save="value"
            boxStyles={{marginBottom:12}}
            dropdownTextStyles={{color:'white'}}
            inputStyles={{color:'white'}}
            accessible={true}
            accessibilityHint="A searchable drop down menu to select an F-stop option"
          />) : null}
    
    
      {/*Button displayed when on the DOF tab, when pressed it executes the calculateDOF() function and displays the results*/}
          {selectedIndex==1 ? (<View style={dofStyle.button} accessible={true} accessibilityLabel="Calculate depth of field" accessibilityHint="Press to show the results of the DOF calculation, will not switch to a different screen" accessibilityRole="button">
            {selectedIndex==1 ? (<Button
              title= "Calculate DOF"
              onPress={() => calculateDOF()}
              color="#000000"
            />) : null}
          </View>) : null}
    
     {/*Button displayed when on the hyperfocal tab, when pressed it executes the calculateHyperfocal() function and displays the results*/}
          {selectedIndex==0 ? (<View style={dofStyle.button} accessible={true} accessibilityLabel="Calculate hyperfocal" accessibilityHint="Press to show the results of the hyperfocal calculation, will not switch to a different screen" accessibilityRole="button">
            {selectedIndex==0 ? (<Button
              title= "Calculate Hyperfocal"
              onPress={() => calculateHyperfocal()}
              color="#000000"
            />) : null}
          </View>) : null}

      {/*Results for both DOF and Hyperfocal -- will be displayed when their respective tab has been selected and their respective showResults variable has been set to true.*/}

          {/*Group of radio buttons to select the units that results will be displayed in */}
          {(showDOFResult || showHyperfocalResult) ? (<Text style={dofStyle.text} accessible={true} accesssibilityLabel="Select units" accessibilityRole="text">Select units:</Text>) : null}
          {(showDOFResult || showHyperfocalResult) ? (<RadioGroup
              radioButtons={unitsRadioButtons} 
              onPress={handleUnits}
              //onPress={setSelectedUnits}
              selectedId={selectedUnits}
              containerStyle={dofStyle.radioButton}
              accessible={true}
              accessibilityRole="radiogroup"
              layout="row"
          />) : null}

          {/*DOF Results */}
          {(selectedIndex==1 && showDOFResult) ? (<Text style={dofStyle.textResult} accessible={true} accessibilityLabel="F-22 depth of field result" accessibilityRole="text">F-22 DOF:  {f22Response} {displayUnits}</Text>) : null}
          {(selectedIndex==1 && showDOFResult) ? (<Text style={dofStyle.textResult} accessible={true} accessibilityLabel="F-16 depth of field result" accessibilityRole="text">F-16 DOF:  {f16Response} {displayUnits}</Text>) : null}
          {(selectedIndex==1 && showDOFResult) ? (<Text style={dofStyle.textResult} accessible={true} accessibilityLabel="F-8 depth of field result" accessibilityRole="text">F-8 DOF:  {f8Response} {displayUnits}</Text>) : null}
    
          {(selectedIndex==1 && showDOFResult) ? (<Text style={dofStyle.textResult}>-------------------------------------</Text>) : null}

          {(selectedIndex==1 && showDOFResult) ? (<Text style={dofStyle.textResult} accessible={true} accesibilityLabel="Bolts result" accessibiltyRole="text">Bolts:  {boltResponse}</Text>) : null}
          {(selectedIndex==1 && showDOFResult) ? (<Text style={dofStyle.textResult} accessible={true} accessibilityLabel="Focal distance result" accessibilityRole="text">Focal Distance:  {subjectDistResponse} {displayUnits}</Text>) : null}

          {/*Hyperfocal Results */}
          {(selectedIndex==0 && showHyperfocalResult) ? (<Text style={dofStyle.textResult} accessible={true} accessibilityLabel="Hyperfocal distance result" accessibilityRole="text">Hyperfocal Distance:  {hyperfocal} {displayUnits}</Text>) : null}
          {(selectedIndex==0 && showHyperfocalResult) ? (<Text style={dofStyle.textResult} accessible={true} accessibilityLabel="Base spacer result" accessibilityRole="text">Base spacer:  {hyperfocalBase}</Text>) : null}
          {(selectedIndex==0 && showHyperfocalResult) ? (<Text style={dofStyle.textResult} accessible={true} accessibilityLabel="Focal spacer result" accessibilityRole="text">Focal spacer:  {hyperfocalSpacer}</Text>) : null}

        </ScrollView>
      </SafeAreaView>
    )
    

}


//Style sheet for the depth of field calculator page
const dofStyle = StyleSheet.create({
    // Page background
    container: {
      flex: 1,
      backgroundColor: 'black',
      justifyContent: 'tops',
      marginTop:60,
    },
    backArrow: {
		color: 'white',
		marginTop: 60,
		margin: 10,
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
    // Subtitle text on page
    textSubtitle: {
      color: 'white',
      margin: 8,
      fontSize: 20,
      textAlign: 'center',
      alignSelf: 'center',
    },
    // Body text on page
    text: {
      color: 'white',
      margin: 8,
      marginTop: 13,
      fontSize: 20,
      textAlign: 'left',
      alignSelf: 'flex-start',
    },
    // Results text
    textResult: {
      color: 'red',
      margin: 8,
      marginTop: 13,
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'left',
      alignSelf: 'flex-start',
    },
    // Used to style the views around the buttons because buttons have very limited styling that can be done directly on them
    button: {
      backgroundColor: 'white',
      padding: 5,
      margin: 20,
      borderRadius: 10,
    },
    radioButton: {
      alignSelf: 'flex-start',
      marginBottom: 12,
    },
});

export default DOFScreen;