import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import {
	collection,
	doc,
	getDoc,
	getDocs,
	setDoc,
	updateDoc,
} from 'firebase/firestore';
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
	Modal,
	Image,
	TextInput,
} from 'react-native';
import flags from '../assets/flags/getFlags';
import Icon from 'react-native-vector-icons/Feather';
import Stats from './Stats';
const wait = (timeout) => {
	return new Promise((resolve) => setTimeout(resolve, timeout));
};
const Item = ({ deckName, cardCount, mastery, navigation }) => {
	const deckMastery = Math.round(100 * (mastery / (cardCount * 2)));
	var borderColor = '#3d475e';
	if (deckMastery > 74) borderColor = '#C6EBBE';
	else if (deckMastery > 49) borderColor = '#FFFD98';
	else if (deckMastery > 24) borderColor = '#FF8DA1';
	return (
		<TouchableOpacity
			onPress={() => {
				navigation.navigate('DeckOverview', {
					deckName: deckName,
					cardCount: cardCount,
					mastery: mastery,
				});
			}}>
			<View style={styles.item}>
				<View style={[styles.info, { borderColor: borderColor }]}>
					<Text style={styles.title}>{deckName}</Text>
					<Text>Cards: {cardCount}</Text>
					<Text>Mastery: {deckMastery}%</Text>
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
};

const Scrollable = (props) => {
	const [languageSelectModal, setLanguageSelectModal] = React.useState(false);
	const [addDeckModal, setAddDeckModal] = React.useState(false);
	const navigation = props.navigation;
	const [refreshing, setRefreshing] = React.useState(false);
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
		props.FetchData();
		wait(1000).then(() => setRefreshing(false));
	};
	const renderItem = ({ item }) => (
		<Item
			deckName={item.deckName}
			cardCount={item.cardCount}
			mastery={item.mastery}
			navigation={navigation}
		/>
	);
	const RenderLanguage = ({ item }) => {
		return (
			<TouchableOpacity
				onPress={async () => {
					await updateDoc(doc(db, 'users/' + userEmailGlobal), {
						lastLanguage: item.name,
					});
					props.setLanguage(item.name);
				}}>
				<View style={styles.langItem}>
					<View style={styles.bannerShadow}>
						<Image style={styles.flag} source={flags[item.flagId].src} />
					</View>

					<Text style={styles.learn}>{item.name}</Text>
				</View>
			</TouchableOpacity>
		);
	};
	const AddLangButton = () => {
		return (
			<TouchableOpacity
				style={styles.learnButton}
				onPress={() => {
					navigation.navigate('AddAnotherLanguage');
				}}>
				<View style={styles.modalContainer}>
					<Text style={styles.learn}>Add Another Language</Text>
				</View>
			</TouchableOpacity>
		);
	};
	const CallStats = () => {
		return (
			<Stats
				flagId={props.flagId}
				bannerMode={props.bannerMode}
				cardCount={props.cardCount}
				mastery={props.mastery}
				navigation={navigation}
				setLanguageSelectModal={() => setLanguageSelectModal(true)}
				setAddDeckModal={() => setAddDeckModal(true)}
			/>
		);
	};
	const LanguageSelect = () => {
		return (
			<View>
				<View style={styles.modalUtil}>
					{/*currently it is juest invisible x for better spacing, fix it */}
					<TouchableOpacity onPress={() => setLanguageSelectModal(false)}>
						<Icon name='x-circle' size={30} color='#FF8DA1' />
					</TouchableOpacity>
					<Text>Choose Language</Text>
					<Icon name='x-circle' size={30} color='white' />
				</View>
				<View style={styles.langList}>
					<FlatList
						data={props.langs}
						renderItem={RenderLanguage}
						keyExtractor={(item) => item.id}
					/>
				</View>
				<AddLangButton />
			</View>
		);
	};
	const AddDeck = () => {
		const [newDeckName, setNewDeckName] = React.useState('');
		const AddDeckToDb = async (navigation) => {
			if (newDeckName != '') {
				try {
					setDoc(
						doc(
							db,
							'users/' +
								userEmailGlobal +
								'/languages/' +
								languageGlobal +
								'/decks',
							newDeckName
						),
						{
							userEmail: userEmailGlobal,
							deckName: newDeckName,
							cardCount: 0,
							mastery: 0,
						}
					);
				} catch (error) {
					alert(error.message);
				}
				navigation.navigate('AddCards', { deckName: newDeckName });
			} else {
				Alert.alert("Can't add Deck", 'Inproper deck name', [
					{
						text: 'Ok',
						style: 'cancel',
					},
				]);
			}
		};
		return (
			<View>
				<View style={styles.modalUtil}>
					{/*currently it is juest invisible x for better spacing, fix it */}
					<TouchableOpacity onPress={() => setAddDeckModal(false)}>
						<Icon name='x-circle' size={30} color='#FF8DA1' />
					</TouchableOpacity>
					<Text>Add New Deck</Text>
					<Icon name='x-circle' size={30} color='white' />
				</View>
				<View style={styles.inputContainer}>
					<TextInput
						placeholder='New Deck Name'
						value={newDeckName}
						onChangeText={(newerDeckName) => {
							setNewDeckName(newerDeckName);
						}}
						style={styles.input}
						multiline={true}
					/>
					<TouchableOpacity
						onPress={() => AddDeckToDb(navigation)}
						style={styles.login}>
						<Text style={styles.buttonText}>Create Deck</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
	};
	return (
		<View style={styles.container}>
			<Modal
				animationType='fade'
				transparent={true}
				visible={languageSelectModal}
				onRequestClose={() => {
					Alert.alert('Modal has been closed.');
					setLanguageSelectModal(!languageSelectModal);
				}}>
				<View style={styles.modalContainer}>
					<View style={styles.modalView}>
						<LanguageSelect />
					</View>
				</View>
			</Modal>
			<Modal
				animationType='fade'
				transparent={true}
				visible={addDeckModal}
				onRequestClose={() => {
					Alert.alert('Modal has been closed.');
					setAddDeckModal(!addDeckModal);
				}}>
				<View style={styles.modalContainer}>
					<View style={styles.modalView}>
						<AddDeck />
					</View>
				</View>
			</Modal>
			<FlatList
				ListHeaderComponent={CallStats}
				data={props.decks}
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
	langList: {
		maxHeight: 400,
	},
	langItem: {
		backgroundColor: '#3d475e',
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 10,
	},
	item: {
		backgroundColor: '#d3d3d3',
		padding: 10,
		marginVertical: 8,
		marginHorizontal: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 10,
	},

	info: {
		width: '50%',
		borderLeftWidth: 10,
		paddingLeft: 5,
		borderRadius: 5,
	},
	inputContainer: {
		alignItems: 'center',
		paddingVertical: 30,
	},
	input: {
		backgroundColor: '#eee',
		padding: 10,
		marginVertical: 3,
		borderRadius: 5,
		width: '80%',
		fontSize: 20,
		textAlign: 'center',
	},
	login: {
		backgroundColor: '#FF8DA1',
		borderRadius: 5,
		padding: 5,
		marginVertical: 3,
		width: '60%',
	},
	buttonText: {
		color: '#fff',
		fontSize: 25,
		textAlign: 'center',
	},
	learnButton: {
		flexDirection: 'row',
		padding: 10,
		backgroundColor: '#FF8DA1',
		marginTop: 15,
		alignItems: 'center',
		borderRadius: 10,
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
	learn: {
		color: 'white',
		fontSize: 25,
		textAlign: 'center',
	},
	flag: {
		height: 73,
		width: 110,
	},
	bannerShadow: {
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 4,
	},
	title: {
		fontSize: 25,
	},
	controls: {
		alignItems: 'center',
		width: '50%',
		paddingBottom: 10,
	},
});

export default Scrollable;
