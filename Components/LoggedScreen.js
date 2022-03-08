import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../Database/firebase';
import { signOut } from 'firebase/auth';
const LoggedScreen = (props) => {
	const HandleLogOut = () => {
		signOut(auth)
			.then(() => {
				console.log('logging out');
				props.setUser({});
			})
			.catch((error) => alert(error.message));
	};
	return (
		<View style={styles.container}>
			<Text>Logged in as: {props.user.email}</Text>
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
