import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../Database/firebase';
import { userEmailGlobal } from '../App';
import { languageGlobal } from '../App';
import {
	RefreshControl,
	View,
	StyleSheet,
	Text,
	FlatList,
	TouchableOpacity,
	Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Stats from './Stats';
const wait = (timeout) => {
	return new Promise((resolve) => setTimeout(resolve, timeout));
};

const Item = ({ deckName, cardCount, mastery, navigation }) => (
	<TouchableOpacity
		onPress={() => {
			navigation.navigate('DeckOverview', {
				deckName: deckName,
				cardCount: cardCount,
				mastery: mastery,
			});
		}}>
		<View style={styles.item}>
			<View style={styles.info}>
				<Text style={styles.title}>{deckName}</Text>
				<Text>Cards: {cardCount}</Text>
			</View>
			<View style={styles.controls}>
				<TouchableOpacity
					style={styles.learnButton}
					onPress={() => {
						if (cardCount > 1) {
							navigation.navigate('Learn', {
								deckName: deckName,
							});
						} else {
							Alert.alert(
								'Not enough cards',
								'Your deck has to have at least 2 cards to use learn functionality',
								[
									{
										text: 'Ok',
										style: 'cancel',
									},
								]
							);
						}
					}}>
					<Text style={styles.learn}>Learn</Text>
					<Icon name='play' size={30} color='white' />
				</TouchableOpacity>
			</View>
		</View>
	</TouchableOpacity>
);

const Scrollable = ({ navigation, route }, props) => {
	const [decks, setDecks] = React.useState();
	const [refreshing, setRefreshing] = React.useState(false);
	const [cardCount, setCardCount] = React.useState(0);
	const [mastery, setMastery] = React.useState(0);
	const [bannerMode, setBannerMode] = React.useState(0);
	const [flagId, setFlagId] = React.useState(0);

	React.useLayoutEffect(() => {
		navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity onPress={() => navigation.navigate('Settings')}>
					<Icon name='settings' size={30} color='white' />
				</TouchableOpacity>
			),
		});
	}, [navigation]);
	const Refresh = () => {
		setRefreshing(true);
	};

	useEffect(async () => {
		const language = await getDoc(
			doc(db, 'users/' + userEmailGlobal + '/languages/', languageGlobal)
		);
		setBannerMode(language.data().bannerMode);
		setFlagId(language.data().flagId);

		const snap = await getDocs(
			collection(
				db,
				'users/' + userEmailGlobal + '/languages/' + languageGlobal + '/decks'
			)
		);
		const decks = [];
		snap.forEach((doc) => {
			const data = doc.data();
			decks.push(data);
		});
		if (decks) {
			var cardCounter = 0;
			var totalMastery = 0;
			setDecks(decks);
			decks.forEach((deck) => {
				cardCounter += deck.cardCount;
				totalMastery += deck.mastery;
			});
			setCardCount(cardCounter);
			if (cardCounter != 0)
				setMastery(Math.round(100 * (totalMastery / (cardCounter * 2))));
		}
		console.log(decks);
		wait(1000).then(() => setRefreshing(false));
	}, [refreshing]);
	const renderItem = ({ item }) => (
		<Item
			deckName={item.deckName}
			cardCount={item.cardCount}
			mastery={item.mastery}
			navigation={navigation}
		/>
	);
	const CallStats = () => {
		return (
			<Stats
				flagId={flagId}
				bannerMode={bannerMode}
				cardCount={cardCount}
				mastery={mastery}
				language={props.language}
				navigation={navigation}
			/>
		);
	};
	return (
		<View style={styles.container}>
			<FlatList
				ListHeaderComponent={CallStats}
				data={decks}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={Refresh} />
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	item: {
		backgroundColor: '#d3d3d3',
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 10,
	},
	info: {
		width: '50%',
	},
	learnButton: {
		flexDirection: 'row',
		padding: 10,
		backgroundColor: '#FF8DA1',
		marginTop: 15,
		alignItems: 'center',
		borderRadius: 10,
	},
	learn: {
		color: 'white',
		fontSize: 25,
		textAlign: 'center',
	},
	title: {
		fontSize: 25,
	},
	controls: {
		padding: 10,
		alignItems: 'center',
		width: '50%',
	},
});

export default Scrollable;
