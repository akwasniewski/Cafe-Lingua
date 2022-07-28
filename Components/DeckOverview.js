import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	ScrollView,
	RefreshControl,
	Alert,
	Modal,
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
const DeckOverview = (props) => {
	const navigation = props.navigation;
	const route = props.route;
	const { deckName } = route.params;
	const [mastery, setMastery] = React.useState(0);
	const [moreModal, setMoreModal] = React.useState(false);
	const [cardCount, setCardCount] = React.useState(1);
	const [cards, setCards] = React.useState();
	const [refreshing, setRefreshing] = React.useState(false);
	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerTitle: deckName,
		});
	}, [navigation]);
	const DeleteCard = async (front, weight, cardId) => {
		console.log('id' + cardId);
		var newCards = [];
		await cards.forEach((card) => {
			if (card.id != cardId) newCards.push(card);
		});
		setCards(newCards);
		await deleteDoc(
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
		var masteryChange = 0;
		if (weight != 0) masteryChange = weight - 1;
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
			{
				cardCount: increment(-1),
				mastery: masteryChange,
			}
		);
		setCardCount(cardCount - 1);
		setMastery(mastery - masteryChange);
	};

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
							DeleteCard(front, weight, cardId, weight);
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
		getDoc(
			doc(
				db,
				'users/' + userEmailGlobal + '/languages/' + languageGlobal + '/decks/',
				deckName
			)
		).then((deck) => {
			if (deck) {
				setCardCount(deck.data().cardCount);
				setMastery(deck.data().mastery);
			}
		});
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
	const ResetMastery = () => {
		var newCards = [];
		cards.forEach(async (card) => {
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
				{
					weight: 0,
				}
			);
			card.weight = 0;
			newCards.push(card);
		});
		setCards(newCards);
		setMastery(0);
		setMoreModal(false);
	};
	const DeleteDeck = async () => {
		props.DeckDeleted(deckName, cardCount, mastery);
		await cards.forEach(async (card) => {
			await deleteDoc(
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
				)
			);
		});
		await deleteDoc(
			doc(
				db,
				'users/' +
					userEmailGlobal +
					'/languages/' +
					languageGlobal +
					'/decks/' +
					deckName
			)
		);
		navigation.navigate('Language');
	};
	const AlertConfirm = (Action) => {
		Alert.alert('Are you sure?', 'This operation cannot be undone', [
			{
				text: 'Cancel',
				style: 'cancel',
			},
			{ text: "I'm sure", onPress: (val) => Action(val) },
		]);
	};
	const More = () => {
		return (
			<View>
				<View style={styles.modalUtil}>
					{/*currently it is juest invisible x for better spacing, fix it */}
					<TouchableOpacity onPress={() => setMoreModal(false)}>
						<Icon name='x-circle' size={30} color='#FF8DA1' />
					</TouchableOpacity>
					<Text>More Deck Options</Text>
					<Icon name='x-circle' size={30} color='white' />
				</View>
				<TouchableOpacity onPress={() => AlertConfirm(() => ResetMastery())}>
					<View style={styles.moreOption}>
						<Text style={styles.optionText}>Reset Mastery</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => AlertConfirm(() => DeleteDeck())}>
					<View style={styles.deleteOption}>
						<Text style={styles.optionText}>Delete Deck</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	};
	return (
		<View style={styles.container}>
			<Modal
				animationType='fade'
				transparent={true}
				visible={moreModal}
				onRequestClose={() => {
					setMoreModal(!moreModal);
				}}>
				<View style={styles.modalContainer}>
					<View style={styles.modalView}>
						<More />
					</View>
				</View>
			</Modal>
			<FlatList
				ListHeaderComponent={
					<DeckStats
						deckName={deckName}
						cardCount={cardCount}
						mastery={mastery}
						navigation={navigation}
						setMoreModal={() => setMoreModal(true)}
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
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalView: {
		width: '90%',
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		padding: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalUtil: {
		borderBottomWidth: 3,
		paddingBottom: 5,
		borderBottomColor: '#f2f2f2',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	moreOption: {
		backgroundColor: '#3d475e',
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
		flexDirection: 'row',
		justifyContent: 'center',
		borderRadius: 10,
	},
	deleteOption: {
		backgroundColor: '#ff5148',
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
		flexDirection: 'row',
		justifyContent: 'center',
		borderRadius: 10,
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
	optionText: {
		color: 'white',
		fontSize: 25,
	},
});
