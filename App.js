import React, { useEffect } from 'react';
import {
	NavigationContainer,
	StackActions,
	useLinkProps,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, AppState } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
const Stack = createNativeStackNavigator();
import HomeScreen from './Screens/HomeScreen';
import SettingsScreen from './Screens/SettingsScreen';
import Icon from 'react-native-vector-icons/Feather';
const Tab = createMaterialBottomTabNavigator();
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './Components/LoginScreen';
import { useNavigation } from '@react-navigation/native';
export default function App({ navigation }) {
	const GetUser = async () => {
		try {
			const savedUser = await AsyncStorage.getItem('user');
			if (savedUser) {
				const newUser = JSON.parse(savedUser);
				setUser(newUser);
			} else setUser('');
		} catch (error) {
			alert(error.message);
		}
	};
	const [user, setUser] = React.useState('');
	useEffect(() => {
		GetUser(); //checks whether user is stored on launch
	}, [AppState]);
	console.log('user ' + user.email);
	const SettingsScreenCall = () => {
		return (
			<SettingsScreen user={user} setUser={(newUser) => setUser(newUser)} />
		);
	};
	const LogIn = ({ navigation }) => {
		useEffect(() => {
			if (user != '') navigation.navigate('LoggedIn');
		}, [user]);

		return <LoginScreen user={user} setUser={(newUser) => setUser(newUser)} />;
	};
	const LoggedIn = ({ navigation }) => {
		useEffect(() => {
			if (user == '') navigation.navigate('Login');
		}, [user]);

		return (
			<Tab.Navigator
				barStyle={{
					backgroundColor: '#3d475e',
				}}
				activeColor='#FF8DA1'
				inactiveColor='white'>
				<Tab.Screen
					name='Home'
					component={HomeScreen}
					options={{
						tabBarLabel: 'Home',
						tabBarIcon: ({ color }) => (
							<Icon name='home' color={color} size={26} />
						),
					}}
				/>
				<Tab.Screen
					name='Settings'
					component={SettingsScreenCall}
					options={{
						tabBarLabel: 'Settings',
						tabBarIcon: ({ color }) => (
							<Icon name='settings' color={color} size={26} />
						),
					}}
				/>
			</Tab.Navigator>
		);
	};
	return (
		<>
			<NavigationContainer>
				<Stack.Navigator
					screenOptions={{ headerShown: false }}
					initialRouteName='Login'>
					<Stack.Screen name='Login' component={LogIn} />
					<Stack.Screen name='LoggedIn' component={LoggedIn} />
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
}
