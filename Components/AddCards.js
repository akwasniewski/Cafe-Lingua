import React, { useEffect } from 'react';
import {
	KeyboardAvoidingView,
	StyleSheet,
	Text,
	View,
	Alert,
} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import {
	setDoc,
	doc,
	collection,
	updateDoc,
	increment,
	getDocs,
} from 'firebase/firestore';
import { db } from '../Database/firebase';
import { userEmailGlobal } from '../App';
import { languageGlobal } from '../App';
var fronts = [];
const AddCards = ({ route, navigation }) => {
	const { deckName } = route.params;
	const [front, setFront] = React.useState('');
	const [back, setBack] = React.useState('');
	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: 'Add to ' + deckName,
		});
	}, [navigation]);
	useEffect(async () => {
		console.log('useffected');
		const snap = await getDocs(
			collection(
				db,
				'users/' +
					userEmailGlobal +
					'/languages/' +
					languageGlobal +
					'/decks/' +
					deckName +
					'/cards/'
			)
		);
		snap.forEach((card) => {
			const data = card.data();
			fronts.push(data.front);
		});
	}, []);
	const NextCard = async (navigation) => {
		var dbFront = front;
		try {
			let duplicateCount = 1;
			while (fronts.includes(dbFront)) {
				dbFront = front.concat(duplicateCount);
				duplicateCount++;
			}
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
					dbFront
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
		fronts.push(dbFront);
		setFront('');
		setBack('');
		console.log(fronts);
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
