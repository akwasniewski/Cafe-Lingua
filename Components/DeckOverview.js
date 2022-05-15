import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../Database/firebase';
import { userEmailGlobal } from '../App';
import DeckStats from './DeckStats';
const Card = ({ front, back }) => {
	return (
		<View style={styles.card}>
			<View style={styles.front}>
				<Text style={styles.frontText}>{front}</Text>
			</View>
			<View style={styles.back}>
				<View>
					<Text style={styles.backText}>{back}</Text>
				</View>
			</View>
		</View>
	);
};
const DeckOverview = ({ route, navigation }) => {
	const { deckName, cardCount } = route.params;
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
	const renderItem = ({ item }) => <Card front={item.front} back={item.back} />;
	return (
		<View style={styles.container}>
			<FlatList
				ListHeaderComponent={
					<DeckStats deckName={deckName} cardCount={cardCount} />
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
	},
	front: {
		width: '50%',
		backgroundColor: '#d3d3d3',
		alignItems: 'center',
		padding: 10,
		borderBottomColor: '#FF8DA1',
		borderBottomWidth: 2,
	},
	frontText: {
		fontSize: 15,
	},
	back: {
		width: '50%',
		alignItems: 'center',
		padding: 10,
		backgroundColor: '#67B7D1',
		borderBottomColor: '#FF8DA1',
		borderBottomWidth: 2,
	},
	backText: {
		color: 'white',
		fontSize: 15,
	},
});
