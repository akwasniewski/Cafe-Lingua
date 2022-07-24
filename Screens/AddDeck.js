import { StackActions } from '@react-navigation/native';
import React from 'react';
import { View, Text } from 'react-native';
const Stack = createNativeStackNavigator();
import AddDeckMain from '../Components/AddDeck';
import AddCards from '../Components/AddCards';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const AddDeck = () => {
	return (
		<Stack.Navigator
			initialRouteName='AddDeck'
			screenOptions={{
				headerShown: false,
			}}>
			<Stack.Screen name='AddDeck' component={AddDeckMain} />
			<Stack.Screen name='AddCards' component={AddCards} />
		</Stack.Navigator>
	);
};

export default AddDeck;
