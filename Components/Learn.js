import React from 'react';
import { View, Text, StyleSheet, FlatList, Alert, Modal } from 'react-native';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	increment,
} from 'firebase/firestore';
import { db } from '../Database/firebase';
import { userEmailGlobal } from '../App';
import { updateDoc } from 'firebase/firestore';
import LearnCard from './LearnCard';
import { TouchableOpacity } from 'react-native-gesture-handler';
const getRandomInt = (max) => {
	return Math.floor(Math.random() * max);
};
const Learn = ({ route, navigation }) => {
	const { deckName } = route.params;
	const [cards, setCards] = React.useState();
	const [curCard, setCurCard] = React.useState();
	React.useEffect(async () => {
		//getting cards from the server
		const snap = await getDocs(
			collection(
				db,
				'users/' + userEmailGlobal + '/decks/' + deckName + '/cards'
			)
		);
		const cards = [];
		snap.forEach((doc) => {
			const data = doc.data();
			cards.push(data);
		});
		cards.forEach((card) => {
			card.oldWeight = card.weight;
		});
		if (cards) {
			setCards(cards);
		}
	}, []);
	React.useEffect(() => {
		RandomCard();
	}, [cards]);
	const RandomCard = () => {
		console.log('randomcard');
		var randomCard;
		var restrictedWeights = [];
		var success = false;
		var isCurCard = false;
		while (success == false) {
			//choosing random card
			if (!cards) {
				break;
			}
			const key = getRandomInt(40);
			var cardWeight = 0;
			if (key == 0) cardWeight = 3;
			else if (0 < key && key < 4) cardWeight = 2;
			else if (3 < key && key < 13) cardWeight = 1;
			if (!restrictedWeights.includes(cardWeight)) {
				const chooseFrom = [];
				cards.forEach((card) => {
					if (card.weight == cardWeight && card != curCard)
						chooseFrom.push(card);
				});
				if (chooseFrom.length != 0) {
					randomCard =
						chooseFrom[Math.floor(Math.random() * chooseFrom.length)];
					success = true;
				} else restrictedWeights.push(cardWeight);
			}
		}
		if (randomCard) {
			setCurCard(randomCard);
			console;
		}
	};
	const SaveMastery = async (masteryChange) => {
		console.log('xdd');
		if (masteryChange != 0) {
			console.log('kurwa');
			await updateDoc(
				doc(db, 'users/' + userEmailGlobal + '/decks/' + deckName),
				{ mastery: increment(masteryChange) }
			);
		}
	};
	const Save = async () => {
		if (!cards) {
			console.log('nocards');
		} else {
			var cardsProcessed = 0;
			var masteryChange = 0;
			cards.forEach(async (card) => {
				if (card.weight != card.oldWeight) {
					await updateDoc(
						doc(
							db,
							'users/' +
								userEmailGlobal +
								'/decks/' +
								deckName +
								'/cards/' +
								card.front
						),
						{ weight: card.weight }
					);
					if (card.oldWeight != 0)
						masteryChange += card.weight - card.oldWeight;
					else masteryChange += card.weight - 1;
				}
				cardsProcessed += 1;
				if (cardsProcessed == cards.length) {
					SaveMastery(masteryChange);
				}
				console.log(cardsProcessed);
			});
		}
	};
	const ExitButton = () => {
		return (
			<View style={styles.buttonContainer}>
				<TouchableOpacity
					onPress={() => {
						Save();
						console.log('saved');
						navigation.goBack();
					}}
					style={styles.button}>
					<Text style={styles.exit}>Save</Text>
				</TouchableOpacity>
			</View>
		);
	};
	const Output = () => {
		if (curCard) {
			return (
				<Modal presentationStyle='overFullScreen'>
					<LearnCard
						curCard={curCard}
						cards={cards}
						setCards={(newCards) => setCards(newCards)}
						RandomCard={() => RandomCard()}
					/>
					<ExitButton />
				</Modal>
			);
		} else {
			return <Text>loading</Text>;
		}
	};
	return <Output />;
};
const styles = StyleSheet.create({
	buttonContainer: {
		alignItems: 'center',
		width: '100%',
		flex: 1,
		paddingBottom: 20,
	},
	button: {
		width: '100%',
		justifyContent: 'center',
		backgroundColor: '#3d475e',
		borderRadius: 10,
	},
	exit: {
		color: 'white',
		padding: 5,
		fontSize: 30,
		textAlign: 'center',
	},
});
export default Learn;
