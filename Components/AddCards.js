import React, { useEffect } from 'react';
import {
	KeyboardAvoidingView,
	StyleSheet,
	Text,
	View,
	Alert,
	Image,
	Keyboard,
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
import flags from '../assets/flags/getFlags';
import { db } from '../Database/firebase';
import { userEmailGlobal } from '../App';
import { languageGlobal } from '../App';
import Icon from 'react-native-vector-icons/Feather';
import { set } from 'react-native-reanimated';
var fronts = [];
const AddCards = (props) => {
	const route = props.route;
	const navigation = props.navigation;
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
	const Swap = () => {
		let temp = front;
		setFront(back);
		setBack(temp);
	};
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
			<TouchableOpacity onPress={Swap}>
				<View style={styles.arrows}>
					<Icon name='arrow-up' size={30} color='#3d475e' />
					<Icon
						style={styles.rightArrow}
						name='arrow-down'
						size={30}
						color='#FF8DA1'
					/>
				</View>
			</TouchableOpacity>

			<KeyboardAvoidingView style={styles.inputsContainer}>
				<View style={styles.translationContainer}>
					<TextInput
						placeholder='Translation'
						value={front}
						onChangeText={(newFront) => {
							setFront(newFront);
						}}
						style={styles.input}
						multiline={true}
						onKeyPress={(e) => {
							if (e.nativeEvent.key === 'Enter') {
								e.preventDefault();
								Keyboard.dismiss();
							}
						}}
					/>
				</View>
				<View style={styles.wordContainer}>
					<Image style={styles.flag} source={flags[props.flagId].src} />
					<TextInput
						placeholder='Word'
						value={back}
						onChangeText={(newBack) => {
							setBack(newBack);
						}}
						style={styles.input}
						multiline={true}
						onKeyPress={(e) => {
							if (e.nativeEvent.key === 'Enter') {
								e.preventDefault();
								Keyboard.dismiss();
							}
						}}
					/>
				</View>
				<TouchableOpacity
					onPress={() => NextCard(navigation)}
					style={styles.next}>
					<Text style={styles.buttonText}>Add Card</Text>
				</TouchableOpacity>
			</KeyboardAvoidingView>
		</KeyboardAvoidingView>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	inputsContainer: {
		width: '80%',
	},
	SaveContainer: {
		justifyContent: 'flex-end',
		flexDirection: 'row',
	},
	arrows: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		width: '90%',
	},
	rightArrow: {
		marginLeft: -18,
		marginTop: 2,
	},
	wordContainer: {
		backgroundColor: '#fff',
		padding: 10,
		marginVertical: 3,
		borderRadius: 5,
		height: '40%',
		textAlign: 'center',
		justifyContent: 'center',
		fontSize: 20,
	},
	flag: {
		height: 30,
		width: 45,
		position: 'absolute',
		top: 10,
		left: 10,
	},
	translationContainer: {
		backgroundColor: '#fff',
		padding: 10,
		marginVertical: 3,
		borderRadius: 5,
		height: '40%',
		justifyContent: 'center',
	},
	input: {
		textAlign: 'center',
		fontSize: 20,
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
