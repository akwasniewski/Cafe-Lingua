import React from 'react';
import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import {
	setDoc,
	doc,
	collection,
	updateDoc,
	increment,
} from 'firebase/firestore';
import { db } from '../Database/firebase';
import { userEmailGlobal } from '../App';
import { languageGlobal } from '../App';
const AddCards = ({ route, navigation }) => {
	const { deckName } = route.params;
	const [front, setFront] = React.useState('');
	const [back, setBack] = React.useState('');
	const NextCard = async (navigation) => {
		try {
			setDoc(
				doc(
					db,
					'users/' +
						userEmailGlobal +
						'/languages/' +
						languageGlobal +
						'/decks/' +
						deckName +
						'/cards',
					front
				),
				{
					front: front,
					back: back,
					weight: 0,
					timesUsed: 0,
				}
			);
		} catch (error) {
			alert(error.message);
		}
		await updateDoc(
			doc(
				db,
				'users/' +
					userEmailGlobal +
					'/languages/' +
					languageGlobal +
					'/decks/' +
					deckName
			),
			{ cardCount: increment(1) }
		);
		setFront('');
		setBack('');
	};
	return (
		<KeyboardAvoidingView style={styles.container}>
			<View style={styles.inputContainer}>
				<TextInput
					placeholder='Original'
					value={front}
					onChangeText={(newFront) => {
						setFront(newFront);
					}}
					style={styles.input}
				/>
				<TextInput
					placeholder='Translated'
					value={back}
					onChangeText={(newBack) => {
						setBack(newBack);
					}}
					style={styles.input}
				/>
				<TouchableOpacity
					onPress={() => NextCard(navigation)}
					style={styles.next}>
					<Text style={styles.buttonText}>Next Card</Text>
				</TouchableOpacity>
			</View>
		</KeyboardAvoidingView>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	inputContainer: {
		width: '80%',
	},
	SaveContainer: {
		justifyContent: 'flex-end',
		flexDirection: 'row',
	},
	input: {
		backgroundColor: '#fff',
		padding: 10,
		marginVertical: 3,
		borderRadius: 5,
	},
	next: {
		backgroundColor: '#FF8DA1',
		borderRadius: 5,
		padding: 5,
		marginVertical: 3,
	},
	save: {
		backgroundColor: '#67B7D1',
		borderRadius: 5,
		padding: 10,
		margin: 30,
		marginVertical: 40,
	},
	buttonText: {
		color: '#fff',
		fontSize: 25,
		textAlign: 'center',
	},
});
export default AddCards;
