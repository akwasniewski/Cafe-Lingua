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
import { StatusBar } from 'expo-status-bar';
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
	useEffect(() => {
		GetUser(); //checks whether user is stored on app launch
	}, [AppState]);
	useEffect(() => {
		userEmailGlobal = userEmail;
	}, [userEmail]);
	useEffect(() => {
		languageGlobal = language;
	}, [language]);
	useEffect(() => {
		const user = auth.currentUser;
		console.log('firebaseuser' + user);
	}, [userEmail]);
	console.log('user email: ' + userEmail);
	const LogIn = ({ navigation }) => {
		const CheckLanguage = () => {
			getDoc(doc(db, 'users', userEmail)).then((user) => {
				if (user.exists()) {
					if (user.data().lastLanguage != '') {
						setLanguage(user.data().lastLanguage);
						return true;
					} else return false;
				} else return false;
			});
		};
		useEffect(async () => {
			if (userEmail != '') {
				console.log('useremail' + userEmail);

				if (CheckLanguage()) navigation.navigate('AddLanguage');
				else navigation.navigate('LoggedIn', { language: language });
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
		}, [userEmail]);

		return (
			<HomeScreen
				setLanguage={(newLanguage) => setLanguage(newLanguage)}
				setUserEmail={(newEmail) => setUserEmail(newEmail)}
			/>
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
