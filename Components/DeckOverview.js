import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../Database/firebase';
import { userEmailGlobal } from '../App';
import DeckStats from './DeckStats';
const Card = ({ front, back, weight }) => {
	var borderColor;
	switch (weight) {
		case 0:
			borderColor = '#3d475e';
			break;
		case 1:
			borderColor = '#FF8DA1';
			break;
		case 2:
			borderColor = '#FFFD98';
			break;
		case 3:
			borderColor = '#C6EBBE';
			break;
	}
	return (
		<View style={styles.card}>
			<View style={[styles.front, { borderColor: borderColor }]}>
				<Text style={styles.frontText}>{front}</Text>
			</View>
			<View style={[styles.back, { borderColor: borderColor }]}>
				<View>
					<Text style={styles.backText}>{back}</Text>
				</View>
			</View>
		</View>
	);
};
const DeckOverview = ({ route, navigation }) => {
	const { deckName, cardCount, mastery } = route.params;
	const [cards, setCards] = React.useState();
	React.useEffect(async () => {
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
		if (cards) setCards(cards);
		console.log(cards);
	}, []);
	const renderItem = ({ item }) => (
		<Card front={item.front} back={item.back} weight={item.weight} />
	);
	return (
		<View style={styles.container}>
			<FlatList
				ListHeaderComponent={
					<DeckStats
						deckName={deckName}
						cardCount={cardCount}
						mastery={mastery}
					/>
				}
				data={cards}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
			/>
		</View>
	);
};

export default DeckOverview;
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	card: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingTop: 20,
		paddingHorizontal: 20,
	},
	front: {
		width: '50%',
		backgroundColor: '#d3d3d3',
		alignItems: 'center',
		padding: 10,
		borderBottomLeftRadius: 10,
		borderTopLeftRadius: 10,
		borderBottomWidth: 10,
	},
	frontText: {
		fontSize: 15,
	},
	back: {
		width: '50%',
		alignItems: 'center',
		padding: 10,
		backgroundColor: '#67B7D1',
		borderBottomRightRadius: 10,
		borderTopRightRadius: 10,
		borderBottomWidth: 10,
	},
	backText: {
		color: 'white',
		fontSize: 15,
	},
});
