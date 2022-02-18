import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from 'firebase/auth';
const auth = getAuth();
const LoginScreen = () => {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const HandleSignUp = () => {
		console.log(email, password);
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredentials) => {
				const user = userCredentials.user;
				console.log(user.email);
			})
			.catch((error) => alert(error.message));
	};
	const HandleLogIn = () => {
		console.log(email, password);
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredentials) => {
				const user = userCredentials.user;
				console.log(user.email);
			})
			.catch((error) => alert(error.message));
	};
	return (
		<KeyboardAvoidingView style={styles.container}>
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
				<TouchableOpacity onPress={HandleLogIn} style={styles.login}>
					<Text style={styles.buttonText}>Log In</Text>
				</TouchableOpacity>
			</View>
			<TouchableOpacity onPress={HandleSignUp} style={styles.signup}>
				<Text style={styles.buttonText}>Sign Up Instead</Text>
			</TouchableOpacity>
		</KeyboardAvoidingView>
	);
};

export default LoginScreen;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	inputContainer: {
		width: '80%',
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
