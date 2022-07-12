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
import AddDeck from './Screens/AddDeck.js';
import SettingsScreen from './Screens/SettingsScreen';
const Tab = createMaterialBottomTabNavigator();
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import LoginScreen from './Components/LoginScreen';
import { useNavigation } from '@react-navigation/native';
import { auth } from './Database/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { db } from './Database/firebase';
import { getDoc, doc } from 'firebase/firestore';
import { stringify } from '@firebase/util';
import AddLanguage from './Components/AddLanguage';
var userEmailGlobal;
var languageGlobal;
export default function App({ navigation }) {
	const [userEmail, setUserEmail] = React.useState('');
	const [userPassword, setUserPassword] = React.useState('');
	const [language, setLanguage] = React.useState('');
	const GetUser = async () => {
		try {
			const savedUserEmail = await AsyncStorage.getItem('userEmail');
			if (savedUserEmail) {
				setUserEmail(savedUserEmail);
				//TODO: login to firebase
			}
		} catch (error) {
			alert(error.message);
		}
		try {
			const savedUserPassword = await AsyncStorage.getItem('userPassword');
			if (savedUserPassword) {
				setUserPassword(savedUserPassword);
				//TODO: login to firebase
			}
		} catch (error) {
			alert(error.message);
		}
		if (userEmail != '') {
			signInWithEmailAndPassword(auth, userEmail, userPassword)
				.then(console.log('logged in to firebase'))
				.catch((error) => alert(error.messsage));
		}
	};
	const FetchLanguage = async () => {
		const user = await getDoc(doc(db, 'users', userEmail));
		// pretier-ignore
		{
			if (user.exists()) {
				if (user.data().lastLanguage != '') {
					setLanguage(user.data().lastLanguage);
					languageGlobal = user.data().lastLanguage;
				}
			}
		}
	};
	useEffect(() => {
		GetUser(); //checks whether user is stored on app launch
	}, [AppState]);
	useEffect(() => {
		userEmailGlobal = userEmail;
	}, [userEmail]);
	useEffect(() => {
		const user = auth.currentUser;
		console.log('firebaseuser' + user);
	}, [userEmail]);
	console.log('user email: ' + userEmail);
	const SettingsScreenCall = () => {
		return (
			<SettingsScreen
				user={userEmail}
				setUserEmail={(newUser) => setUserEmail(newUser)}
			/>
		);
	};
	const LogIn = ({ navigation }) => {
		useEffect(async () => {
			if (userEmail != '') {
				await FetchLanguage();
				if (language != '')
					navigation.navigate('LoggedIn', { language: language });
				else navigation.navigate('AddLanguage');
			}
		}, [userEmail]);
		return (
			<LoginScreen
				user={userEmail}
				setUserEmail={(newUser) => setUserEmail(newUser)}
			/>
		);
	};
	const LoggedIn = ({ navigation }) => {
		useEffect(() => {
			if (userEmail == '') navigation.navigate('Login');
			console.log('lol');
			FetchLanguage();
		}, [userEmail]);

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
					initialParams={{ language: language }}
					options={{
						tabBarLabel: 'Home',
						tabBarIcon: ({ color }) => (
							<Icon name='flag' color={color} size={26} />
						),
					}}
				/>
				<Tab.Screen
					name='AddDeck'
					component={AddDeck}
					options={{
						tabBarLabel: 'Add Deck',
						tabBarIcon: ({ color }) => (
							<Icon name='plus-circle' color={color} size={26} />
						),
						userEmail: { userEmail },
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
					screenOptions={{ headerShown: false, gestureEnabled: false }}
					initialRouteName='Login'>
					<Stack.Screen name='Login' component={LogIn} />
					<Stack.Screen name='LoggedIn' component={LoggedIn} />
					<Stack.Screen name='AddLanguage' component={AddLanguage} />
				</Stack.Navigator>
			</NavigationContainer>
		</>
	);
}
export { userEmailGlobal, languageGlobal };
