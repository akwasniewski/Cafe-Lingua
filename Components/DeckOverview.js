import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	ScrollView,
	RefreshControl,
} from 'react-native';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../Database/firebase';
import { userEmailGlobal } from '../App';
import DeckStats from './DeckStats';
import Icon from 'react-native-vector-icons/Feather';
import { Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { deleteDoc, updateDoc, increment } from 'firebase/firestore';
import { languageGlobal } from '../App';
const windowWidth = Dimensions.get('window').width;
const wait = (timeout) => {
	return new Promise((resolve) => setTimeout(resolve, timeout));
};
const DeleteCard = (deckName, front, weight, cardId) => {
	console.log('id' + cardId);
	deleteDoc(
		doc(
			db,
			'users/' +
				userEmailGlobal +
				'/languages/' +
				languageGlobal +
				'/decks/' +
				deckName +
				'/cards/' +
				cardId
		)
	);

	updateDoc(
		doc(
			db,
			'users/' +
				userEmailGlobal +
				'/languages/' +
				languageGlobal +
				'/decks/' +
				deckName
		),
		{
			cardCount: increment(-1),
		}
	);
};
const DeckOverview = ({ route, navigation }) => {
	const { deckName, cardCount, mastery } = route.params;
	const [cards, setCards] = React.useState();
	const [refreshing, setRefreshing] = React.useState(false);
	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: deckName,
		});
	}, [navigation]);
	const Card = ({ front, back, weight, cardId }) => {
		var borderColor;
		const [visible, setVisible] = React.useState(true);
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
			<View
				style={[
					styles.cardContainer,
					{ visibility: visible ? 'visible' : 'hidden' },
				]}>
				<ScrollView
					contentContainerStyle={styles.card}
					horizontal
					pagingEnabled
					showsHorizontalScrollIndicator={false}
					decelerationRate='fast'>
					<View style={styles.cardContainer}>
						<View style={[styles.front, { borderColor: borderColor }]}>
							<Text style={styles.frontText}>{front}</Text>
						</View>
						<View style={[styles.back, { borderColor: borderColor }]}>
							<View>
								<Text style={styles.backText}>{back}</Text>
							</View>
						</View>
					</View>
					<TouchableOpacity
						onPress={() => {
							Refresh();
							DeleteCard(deckName, front, weight, cardId);
						}}
						style={styles.delete}>
						<Icon name='trash-2' color='#ffffff' size={26} />
					</TouchableOpacity>
				</ScrollView>
			</View>
		);
	};
	const Refresh = () => {
		setRefreshing(true);
		Fetch();
		wait(2000).then(() => setRefreshing(false));
	};
	const Fetch = async () => {
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
		const cards = [];
		snap.forEach((doc) => {
			const data = doc.data();
			data.id = doc.id;
			cards.push(data);
		});
		if (cards) setCards(cards);
	};
	React.useEffect(() => {
		Fetch();
	}, []);
	const renderItem = ({ item }) => (
		<Card
			front={item.front}
			back={item.back}
			weight={item.weight}
			cardId={item.id}
		/>
	);
	return (
		<View style={styles.container}>
			<FlatList
				ListHeaderComponent={
					<DeckStats
						deckName={deckName}
						cardCount={cardCount}
						mastery={mastery}
						navigation={navigation}
					/>
				}
				data={cards}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={Refresh} />
				}
			/>
		</View>
	);
};

export default DeckOverview;
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	cardContainer: {
		flex: 1,
		alignItems: 'center',
		flexDirection: 'row',
		paddingHorizontal: 10,
	},
	cardScroll: {
		flexGrow: 1,
	},
	card: {
		marginTop: 20,
		flexGrow: 1,
	},
	delete: {
		backgroundColor: '#ff5148',
		marginHorizontal: 3,
		justifyContent: 'center',
		padding: 4,
		borderRadius: 10,
		height: '100%',
	},
	front: {
		width: windowWidth / 2 - 20,
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
		width: windowWidth / 2 - 20,
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
