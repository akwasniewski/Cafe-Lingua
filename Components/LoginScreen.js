import React from 'react';
import {
	KeyboardAvoidingView,
	StyleSheet,
	Text,
	View,
	Image,
} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth';
import { db } from '../Database/firebase';
import { setDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../Database/firebase';
const LoginScreen = (props) => {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const SaveUser = async (user) => {
		console.log(user.email);
		props.setUserEmail(email.toLowerCase());
		try {
			await AsyncStorage.setItem('userEmail', email.toLowerCase());
			console.log(email);
			await AsyncStorage.setItem('userPassword', password);
		} catch (error) {
			alert(error.message);
		}
	};
	const HandleSignUp = async () => {
		console.log(email, password);
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredentials) => {
				const user = userCredentials.user;
				SaveUser(user);
			})
			.catch((error) => alert(error.message));
		try {
			setDoc(doc(db, 'users/' + email), {
				lastLanguage: '',
			});
		} catch (error) {
			alert(error.message);
		}
	};
	const HandleLogIn = () => {
		console.log(email, password);
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredentials) => {
				const user = userCredentials.user;
				SaveUser(user);
			})
			.catch((error) => alert(error.message));
	};
	return (
		<KeyboardAvoidingView
			behavior='padding'
			keyboardVerticalOffset={-100}
			style={styles.container}>
			<View>
				<Image
					style={styles.logo}
					source={require('../assets/cafelingua.png')}
				/>
			</View>
			<View style={styles.innerContainer}>
				<View style={styles.inputContainer}>
					<TextInput
						placeholder='Email'
						value={email}
						onChangeText={(newEmail) => {
							setEmail(newEmail);
						}}
						style={styles.input}
					/>
					<TextInput
						placeholder='Password'
						value={password}
						onChangeText={(newPassword) => {
							setPassword(newPassword);
						}}
						style={styles.input}
						secureTextEntry
					/>
					<TouchableOpacity onPress={() => HandleLogIn()} style={styles.login}>
						<Text style={styles.buttonText}>Log In</Text>
					</TouchableOpacity>
				</View>
				<TouchableOpacity onPress={() => HandleSignUp()} style={styles.signup}>
					<Text style={styles.buttonText}>Sign Up Instead</Text>
				</TouchableOpacity>
				<View>
					<Image style={styles.moka} source={require('../assets/moka.png')} />
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};

export default LoginScreen;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#b0e3f3',
		paddingTop: 60,
	},
	innerContainer: {
		paddingTop: 50,
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
	},
	inputContainer: {
		width: '80%',
	},
	moka: {
		height: 150,
		width: 150,
	},
	logo: {
		height: 100,
		width: 195,
		marginTop: 20,
		marginLeft: 20,
		position: 'absolute',
	},
	input: {
		backgroundColor: '#fff',
		padding: 10,
		marginVertical: 3,
		borderRadius: 5,
	},
	login: {
		backgroundColor: '#FF8DA1',
		borderRadius: 5,
		padding: 5,
		marginVertical: 3,
	},
	signup: {
		backgroundColor: '#67B7D1',
		borderRadius: 5,
		padding: 5,
		marginVertical: 3,
	},
	buttonText: {
		color: '#fff',
		fontSize: 20,
		textAlign: 'center',
	},
});
