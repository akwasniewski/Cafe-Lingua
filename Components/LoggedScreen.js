import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../Database/firebase';
import { signOut } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserInfo } from 'firebase/auth';
const LoggedScreen = (props) => {
	const DeleteUser = async () => {
		console.log('logging out');
		props.setUser('');
		try {
			await AsyncStorage.removeItem('userEmail');
			await AsyncStorage.removeItem('userPassword');
		} catch (error) {
			alert(error.message);
		}
	};
	const HandleLogOut = () => {
		signOut(auth)
			.then(() => {
				DeleteUser();
			})
			.catch((error) => alert(error.message));
	};
	return (
		<View style={styles.container}>
			<Text>Logged in as: {props.user}</Text>
			<TouchableOpacity onPress={() => HandleLogOut()} style={styles.login}>
				<Text style={styles.buttonText}>Log Out</Text>
			</TouchableOpacity>
		</View>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	login: {
		backgroundColor: '#FF8DA1',
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
export default LoggedScreen;
