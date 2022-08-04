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
import { languageGlobal } from '../App';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';
import Loading from './Loading';
const getRandomInt = (max) => {
	return Math.floor(Math.random() * max);
};
var cardsGlobal = [];
const Learn = (props) => {
	const route = props.route;
	const navigation = props.navigation;
	const { deckName } = route.params;
	const { backKey } = route.params;
	const { mastery } = route.params;
	const { cardCount } = route.params;
	const [cards, setCards] = React.useState();
	const [curCard, setCurCard] = React.useState();
	const [masteryState, setMasteryState] = React.useState(mastery);
	const isFocused = useIsFocused();
	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: deckName,
			headerLeft: () => (
				<TouchableOpacity onPress={Save}>
					<Text style={styles.saveButton}>Save</Text>
				</TouchableOpacity>
			),
			gestureEnabled: false,
		});
	}, [navigation]);
	React.useEffect(async () => {
		//getting cards from the server
		const snap = await getDocs(
			collection(
				db,
				'users/' +
					userEmailGlobal +
					'/languages/' +
					languageGlobal +
					'/decks/' +
					deckName +
					'/cards'
			)
		);
		const newCards = [];
		snap.forEach((doc) => {
			const data = doc.data();
			data.id = doc.id;
			newCards.push(data);
		});
		newCards.forEach((card) => {
			card.oldWeight = card.weight;
		});
		if (newCards) {
			setCards(newCards);
		}
	}, []);
	React.useEffect(() => {
		RandomCard();
	}, [cards]);
	const RandomCard = () => {
		cardsGlobal = cards;
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
		}
	};
	const Save = async () => {
		if (!cardsGlobal) {
			console.log('nocards');
			navigation.goBack();
		}
		var deckMastery = 0;
		var cardsProcessed = 0;
		cardsGlobal.forEach(async (card) => {
			if (card.weight != card.oldWeight) {
				console.log('savedCardMastery');
				await updateDoc(
					doc(
						db,
						'users/' +
							userEmailGlobal +
							'/languages/' +
							languageGlobal +
							'/decks/' +
							deckName +
							'/cards/' +
							card.id
					),
					{ weight: card.weight }
				);
			}
			if (card.weight != 0) deckMastery += card.weight - 1;
			cardsProcessed += 1;
			// not elegant indeed but works
			// TODO: make it nice and async
			if (cardsProcessed == cardsGlobal.length) {
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
					{ mastery: deckMastery }
				);
				props.ChangeDeck(deckName, deckMastery);
				console.log('deckmast' + deckMastery);
				navigation.goBack();
			}
			console.log(cardsProcessed);
		});
	};
	const Output = () => {
		var curMastery = Math.round(100 * (masteryState / (cardCount * 2)));
		var borderColor = '#FF8DA1';
		if (curMastery > 80) borderColor = '#C6EBBE';
		else if (curMastery > 40) borderColor = '#FFFD98';
		if (curCard) {
			return (
				<View style={styles.container}>
					<View style={[styles.masteryIndicator, { borderColor: borderColor }]}>
						<Text style={styles.indicatorText}>{curMastery}%</Text>
					</View>
					<LearnCard
						curCard={curCard}
						cards={cards}
						setCards={(newCards) => setCards(newCards)}
						RandomCard={() => RandomCard()}
						setMasteryState={(newState) => setMasteryState(newState)}
						masteryState={masteryState}
					/>
				</View>
			);
		} else {
			return <Loading />;
		}
	};
	return <Output />;
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	masteryIndicator: {
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 60,
		borderWidth: 8,
		height: 80,
		width: 80,
		top: 10,
		right: 10,
		position: 'absolute',
		backgroundColor: '#67B7D1',
	},
	indicatorText: {
		textAlign: 'center',
		color: '#fff',
		fontSize: 20,
	},
	saveButton: {
		color: '#ffffff',
		fontSize: 20,
	},
});
export default Learn;
