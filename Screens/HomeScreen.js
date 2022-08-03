import React, { useEffect } from 'react';
import {
	SectionList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Image,
} from 'react-native';
import DeckOverview from '../Components/DeckOverview';
const Stack = createNativeStackNavigator();
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Scrollable from '../Components/Scrollable';
import Learn from '../Components/Learn';
import AddCards from '../Components/AddCards';
import AddDeck from '../Components/AddDeck';
import SettingsScreen from './SettingsScreen';
import Icon from 'react-native-vector-icons/Feather';
import AddLanguage from '../Components/AddLanguage';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	updateDoc,
} from 'firebase/firestore';
import { db } from '../Database/firebase';
import { userEmailGlobal } from '../App';
import { languageGlobal } from '../App';
const wait = (timeout) => {
	return new Promise((resolve) => setTimeout(resolve, timeout));
};
const Home = (props) => {
	const [decks, setDecks] = React.useState();
	const [cardCount, setCardCount] = React.useState(0);
	const [mastery, setMastery] = React.useState(0);
	const [bannerMode, setBannerMode] = React.useState(0);
	const [flagId, setFlagId] = React.useState(0);
	const [langs, setLangs] = React.useState();
	const [refreshing, setRefreshing] = React.useState(false);

	useEffect(() => {
		FetchData();
	}, [languageGlobal]);
	const FetchData = async () => {
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
			data.id = doc.id;
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
		const languages = [];
		const snapLang = await getDocs(
			collection(db, 'users/' + userEmailGlobal + '/languages/')
		);
		snapLang.forEach((doc) => {
			const data = doc.data();
			data.name = doc.id;
			languages.push(data);
		});
		if (languages) setLangs(languages);
	};
	const DeckDeleted = (deckName, deckCardCount, deckMastery) => {
		var newDecks = [];
		decks.forEach((deck) => {
			if (deck.id != deckName) newDecks.push(deck);
		});
		setDecks(newDecks);
	};
	const Scroll = ({ navigation }) => {
		return (
			<Scrollable
				setLanguage={(newLanguage) => props.setLanguage(newLanguage)}
				navigation={navigation}
				refreshing={refreshing}
				FetchData={() => FetchData()}
				decks={decks}
				cardCount={cardCount}
				mastery={mastery}
				bannerMode={bannerMode}
				flagId={flagId}
				langs={langs}
			/>
		);
	};
	const CallSettings = () => {
		return (
			<SettingsScreen
				setLanguage={(newLanguage) => props.setLanguage(newLanguage)}
				setUserEmail={(newEmail) => props.setUserEmail(newEmail)}
			/>
		);
	};
	const CallAddCards = ({ navigation, route }) => {
		return <AddCards flagId={flagId} navigation={navigation} route={route} />;
	};
	const CallDeckOverview = ({ navigation, route }) => {
		return (
			<DeckOverview
				route={route}
				navigation={navigation}
				DeckDeleted={(deckName) => DeckDeleted(deckName)}
			/>
		);
	};
	const AddLanguageMain = ({ navigation }) => {
		const AddNewLanguage = (newLanguage) => {
			navigation.navigate('Language');
			props.setLanguage(newLanguage);
		};
		return (
			<AddLanguage setLanguage={(newLanguage) => AddNewLanguage(newLanguage)} />
		);
	};
	return (
		<Stack.Navigator
			initialRouteName='Language'
			screenOptions={{
				headerStyle: {
					backgroundColor: '#3d475e',
				},
				headerTintColor: '#fff',
			}}>
			<Stack.Group>
				<Stack.Screen
					name='Language'
					component={Scroll}
					options={{
						headerTitle: languageGlobal,
						headerLeft: () => (
							<Image
								style={styles.logo}
								source={require('../assets/moka2.png')}
							/>
						),
					}}
				/>
				<Stack.Screen
					name='DeckOverview'
					component={CallDeckOverview}
					language={languageGlobal}
				/>
				<Stack.Screen
					name='AddCards'
					component={CallAddCards}
					language={languageGlobal}
				/>
				<Stack.Screen
					name='AddAnotherLanguage'
					component={AddLanguageMain}
					options={{
						headerTitle: 'Add Another Language',
					}}
				/>
				<Stack.Screen name='Settings' component={CallSettings} />
			</Stack.Group>
			<Stack.Group>
				<Stack.Screen
					name='Learn'
					component={Learn}
					language={languageGlobal}
				/>
			</Stack.Group>
		</Stack.Navigator>
	);
};
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	scroll: {
		height: '70%',
	},
	logo: {
		width: 50,
		height: 50,
		marginTop: -2,
		marginLeft: -15,
	},
});
export default Home;
