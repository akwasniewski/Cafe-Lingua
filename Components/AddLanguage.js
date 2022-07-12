import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { setDoc, doc, collection, updateDoc } from 'firebase/firestore';
import { db } from '../Database/firebase';
import { userEmailGlobal } from '../App';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
const AddLanguage = ({ navigation }) => {
	const [languageName, setLanguageName] = React.useState('');
	const AddLanguageToDb = async (navigation) => {
		try {
			setDoc(doc(db, 'users/' + userEmailGlobal + '/languages', languageName), {
				userEmail: userEmailGlobal,
			});
		} catch (error) {
			alert(error.message);
		}
		try {
			setDoc(doc(db, 'users/' + userEmailGlobal), {
				lastLanguage: languageName,
			});
		} catch (error) {
			alert(error.message);
		}
		navigation.navigate('LoggedIn', {
			language: languageName,
		});
	};
	return (
		<KeyboardAvoidingView style={styles.container}>
			<View style={styles.inputContainer}>
				<TextInput
					placeholder='New Language Name'
					value={languageName}
					onChangeText={(newLanguageName) => {
						setLanguageName(newLanguageName);
					}}
					style={styles.input}
				/>
				<TouchableOpacity
					onPress={() => AddLanguageToDb(navigation)}
					style={styles.login}>
					<Text style={styles.buttonText}>Create Language</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
};

export default AddLanguage;
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
