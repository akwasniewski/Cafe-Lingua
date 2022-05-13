import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import DeckOverview from '../Components/DeckOverview';
const Stack = createNativeStackNavigator();
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Scrollable from '../Components/Scrollable';
import Learn from '../Components/Learn';
const Home = () => {
	return (
		<Stack.Navigator
			initialRouteName='Language'
			screenOptions={{
				headerStyle: {
					backgroundColor: '#3d475e',
				},
				headerTintColor: '#fff',
			}}>
			<Stack.Screen name='Language' component={Scrollable} />
			<Stack.Screen name='DeckOverview' component={DeckOverview} />
			<Stack.Screen name='Learn' component={Learn} />
		</Stack.Navigator>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	scroll: {
		height: '70%',
	},
});
export default Home;
