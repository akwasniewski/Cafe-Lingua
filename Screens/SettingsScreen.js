import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
const Stack = createNativeStackNavigator();
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsMain from '../Components/SettingsMain';
import LoginScreen from '../Components/LoginScreen';
import LoggedScreen from '../Components/LoggedScreen';
const SettingsScreen = (props) => {
	const Logged = () => {
		return (
			<LoggedScreen
				setLanguage={(newLanguage) => props.setLanguage(newLanguage)}
				setUserEmail={(newEmail) => props.setUserEmail(newEmail)}
			/>
		);
	};
	return (
		<Stack.Navigator
			initialRouteName='SettingsMain'
			screenOptions={{
				headerShown: false,
			}}>
			<Stack.Screen name='SettingsMain' component={Logged} />
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
export default SettingsScreen;
