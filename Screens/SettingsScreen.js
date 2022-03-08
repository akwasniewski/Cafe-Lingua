import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
const Stack = createNativeStackNavigator();
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SettingsMain from '../Components/SettingsMain';
import LoginScreen from '../Components/LoginScreen';
import LoggedScreen from '../Components/LoggedScreen';
const SettingsScreen = (props) => {
	const Login = () => {
		if (!props.user.email) {
			return (
				<LoginScreen
					user={props.user}
					setUser={(newUser) => props.setUser(newUser)}
				/>
			);
		} else {
			return (
				<LoggedScreen
					user={props.user}
					setUser={(newUser) => props.setUser(newUser)}
				/>
			);
		}
	};
	return (
		<Stack.Navigator
			initialRouteName='SettingsMain'
			screenOptions={{
				headerStyle: {
					backgroundColor: '#3d475e',
				},
				headerTintColor: '#fff',
			}}>
			<Stack.Screen name='SettingsMain' component={Login} />
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
