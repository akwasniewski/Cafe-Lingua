import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../Database/firebase';
import { userEmailGlobal } from '../App';
import LearnCard from './LearnCard';
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
		if (cards) {
			setCards(cards);
			setSavedCards(cards);
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
	const SaveMastery = async () => {
		await cards.forEach(async (card) => {
			if (card.hasChanged === true) {
				await UpdateDoc(
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
			}
		});
	};
	React.useEffect(async () => {
		navigation.addListener(
			'beforeRemove',
			(e) => {
				e.preventDefault();
				SaveMastery().then(navigation.dispatch(e.data.action));
			},
			[]
		);
	}, [navigation]);
	const Output = () => {
		if (curCard) {
			return (
				<LearnCard
					curCard={curCard}
					cards={cards}
					setCards={(newCards) => setCards(newCards)}
					RandomCard={() => RandomCard()}
				/>
			);
		} else {
			return <Text>loading</Text>;
		}
	};
	return <Output />;
};

export default Learn;
