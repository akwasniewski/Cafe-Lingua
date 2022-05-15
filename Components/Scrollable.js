import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../Database/firebase';
import { userEmailGlobal } from '../App';
import {
	RefreshControl,
	View,
	StyleSheet,
	Text,
	FlatList,
	TouchableOpacity,
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
						navigation.navigate('Learn', {
							deckName: deckName,
						});
					}}>
					<Text style={styles.learn}>Learn</Text>
					<Icon name='play' size={30} color='white' />
				</TouchableOpacity>
			</View>
		</View>
	</TouchableOpacity>
);

const Scrollable = ({ navigation }) => {
	const [decks, setDecks] = React.useState();
	const [refreshing, setRefreshing] = React.useState(false);
	const [cardCount, setCardCount] = React.useState(0);
	const Refresh = () => {
		setRefreshing(true);
	};

	useEffect(async () => {
		const snap = await getDocs(
			collection(db, 'users/' + userEmailGlobal + '/decks')
		);
		const decks = [];
		snap.forEach((doc) => {
			const data = doc.data();
			decks.push(data);
		});
		if (decks) {
			var cardCounter = 0;
			setDecks(decks);
			decks.forEach((card) => {
				cardCounter += card.cardCount;
			});
			setCardCount(cardCounter);
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
		return <Stats cardCount={cardCount} />;
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
