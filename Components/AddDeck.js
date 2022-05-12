import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { setDoc, doc, collection } from 'firebase/firestore';
import { db } from '../Database/firebase';
import { userEmailGlobal } from '../App';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
const AddDeck = ({ navigation }) => {
	const [deckName, setDeckName] = React.useState('');
	const AddDeckToDb = async (navigation) => {
		try {
			setDoc(doc(db, 'users/' + userEmailGlobal + '/decks', deckName), {
				userEmail: userEmailGlobal,
				deckName: deckName,
				cardCount: 0,
			});
		} catch (error) {
			alert(error.message);
		}
		navigation.navigate('AddCards', { deckName: deckName });
	};
	return (
		<KeyboardAvoidingView style={styles.container}>
			<View style={styles.inputContainer}>
				<TextInput
					placeholder='New Deck Name'
					value={deckName}
					onChangeText={(newDeckName) => {
						setDeckName(newDeckName);
					}}
					style={styles.input}
				/>
				<TouchableOpacity
					onPress={() => AddDeckToDb(navigation)}
					style={styles.login}>
					<Text style={styles.buttonText}>Create Deck</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
};

export default AddDeck;
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
