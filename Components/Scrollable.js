import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../Database/firebase';
import { userEmailGlobal } from '../App';
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Stats from './Stats';
const Item = ({ deckName, cardCount, navigation }) => (
	<TouchableOpacity
		onPress={() => {
			navigation.navigate('DeckOverview', {
				deckName: deckName,
			});
		}}>
		<View style={styles.item}>
			<View style={styles.info}>
				<Text style={styles.title}>{deckName}</Text>
				<Text>Cards: {cardCount}</Text>
			</View>
			<View style={styles.controls}>
				<TouchableOpacity>
					<View style={styles.learnButton}>
						<Text style={styles.learn}>Learn</Text>
						<Icon name='play' size={30} color='white' />
					</View>
				</TouchableOpacity>
				<TouchableOpacity>
					<View style={styles.editButton}>
						<Icon name='edit' size={30} color='white' />
					</View>
				</TouchableOpacity>
			</View>
		</View>
	</TouchableOpacity>
);

const Scrollable = ({ navigation }) => {
	const [decks, setDecks] = React.useState();
	useEffect(async () => {
		const snap = await getDocs(
			collection(db, 'users/' + userEmailGlobal + '/decks')
		);
		const decks = [];
		snap.forEach((doc) => {
			const data = doc.data();
			decks.push(data);
		});
		if (decks) setDecks(decks);
		console.log(decks);
	}, []);
	const renderItem = ({ item }) => (
		<Item
			deckName={item.deckName}
			cardCount={item.cardCount}
			navigation={navigation}
		/>
	);
	return (
		<View style={styles.container}>
			<FlatList
				ListHeaderComponent={Stats}
				data={decks}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
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
		backgroundColor: '#FF8DA1',
		marginTop: 15,
		alignItems: 'center',
		borderRadius: 10,
		padding: 10,
	},
	editButton: {
		marginTop: 15,
		marginLeft: 10,
		alignItems: 'center',
		borderRadius: 10,
		padding: 10,
		backgroundColor: '#67B7D1',
	},
	learn: {
		color: 'white',
		fontSize: 25,
	},
	title: {
		fontSize: 25,
	},
	controls: {
		flexDirection: 'row',
		width: '50%',
	},
});

export default Scrollable;
