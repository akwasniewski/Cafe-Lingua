import React, { useEffect } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import DeckOverview from '../Components/DeckOverview';
const Stack = createNativeStackNavigator();
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Scrollable from '../Components/Scrollable';
import Learn from '../Components/Learn';
import AddCards from '../Components/AddCards';
const Home = ({ route, props }) => {
	const language = route.params.language;
	console.log('koccc' + language);
	return (
		<Stack.Navigator
			initialRouteName='Language'
			screenOptions={{
				headerStyle: {
					backgroundColor: '#3d475e',
				},
				headerTintColor: '#fff',
			}}>
			<Stack.Group>
				<Stack.Screen
					name='Language'
					component={Scrollable}
					initialParams={{ language: language }}
				/>
				<Stack.Screen
					name='DeckOverview'
					component={DeckOverview}
					language={language}
				/>
				<Stack.Screen
					name='AddCards'
					component={AddCards}
					language={language}
				/>
			</Stack.Group>
			<Stack.Group>
				<Stack.Screen name='Learn' component={Learn} language={language} />
			</Stack.Group>
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
