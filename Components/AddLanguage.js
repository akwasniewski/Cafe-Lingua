import React from 'react';
import {
	KeyboardAvoidingView,
	StyleSheet,
	Text,
	View,
	Modal,
	Image,
	FlatList,
} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { setDoc, doc, collection, updateDoc } from 'firebase/firestore';
import { db } from '../Database/firebase';
import { userEmailGlobal } from '../App';
import Icon from 'react-native-vector-icons/Feather';
import flags from '../assets/flags/getFlags.js';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { concat } from 'react-native-reanimated';
import { Banner } from 'react-native-paper';
const AddLanguage = ({ navigation }) => {
	console.log(flags);
	const [languageName, setLanguageName] = React.useState('');
	const [modalVisible, setModalVisible] = React.useState('');
	const [modalMode, setModalMode] = React.useState(0);
	const [bannerHighlight, setBannerHighlight] = React.useState(0);
	const [chosenFlagId, setChosenFlagId] = React.useState(0);
	const AddLanguageToDb = async (navigation) => {
		if (languageName != '' && bannerHighlight != 0) {
			try {
				setDoc(
					doc(db, 'users/' + userEmailGlobal + '/languages', languageName),
					{
						userEmail: userEmailGlobal,
						bannerMode: bannerHighlight,
						flagId: chosenFlagId,
					}
				);
			} catch (error) {
				alert(error.message);
			}
			try {
				setDoc(doc(db, 'users/' + userEmailGlobal), {
					lastLanguage: languageName,
				});
			} catch (error) {
				alert(error.message);
			}
			navigation.navigate('LoggedIn', {
				language: languageName,
			});
		}
	};
	const FlagChosen = (flagId) => {
		setChosenFlagId(flagId);
		setBannerHighlight(1);
		setModalVisible(false);
	};
	const Banner = () => {
		if (bannerHighlight == 1) {
			return (
				<View style={styles.bigFlagContainer}>
					<Image style={styles.bigFlag} source={flags[chosenFlagId].src} />
					<View style={styles.changeFlagInfo}>
						<Text style={styles.buttonText}>Change Banner</Text>
					</View>
				</View>
			);
		} else {
			return (
				<View style={styles.choose}>
					<Icon name='help-circle' size={50} color='white' />
					<Text style={styles.buttonText}>Choose a banner</Text>
				</View>
			);
		}
	};
	const FlagList = () => {
		const renderFlag = ({ item }) => (
			<View style={styles.miniFlagContainer}>
				<TouchableOpacity onPress={() => FlagChosen(item.id)}>
					<Image style={styles.miniFlag} source={item.src} />
				</TouchableOpacity>
			</View>
		);
		return (
			<FlatList
				data={flags}
				renderItem={renderFlag}
				keyExtractor={(item) => item.id}
				numColumns={3}
				contentContainerStyle={styles.flagListContainer}
			/>
		);
	};
	const ModalContent = () => {
		if (modalMode === 1) {
			return <View></View>;
		} else if (modalMode === 2) {
			return (
				<View>
					<View style={styles.modalUtil}>
						{/*currently it is juest invisible x for better spacing, fix it */}
						<TouchableOpacity onPress={() => setModalMode(3)}>
							<Icon name='arrow-left-circle' size={30} color='#FF8DA1' />
						</TouchableOpacity>
						<Text>Choose Country Flag</Text>
						<Icon name='arrow-left-circle' size={30} color='white' />
					</View>
					<FlagList />
				</View>
			);
		} else {
			return (
				<View>
					<View style={styles.modalUtil}>
						{/*currently it is juest invisible x for better spacing, fix it */}
						<TouchableOpacity onPress={() => setModalVisible(false)}>
							<Icon name='x-circle' size={30} color='#FF8DA1' />
						</TouchableOpacity>
						<Text>Choose a Banner Style</Text>
						<Icon name='x-circle' size={30} color='white' />
					</View>
					<View style={styles.modalOptions}>
						<TouchableOpacity
							style={styles.bannerOption}
							onPress={() => setModalMode(2)}>
							<Image
								style={styles.image}
								source={require('../assets/justflag.png')}
							/>
							<Text>Country Flag</Text>
						</TouchableOpacity>
						<TouchableOpacity style={styles.bannerOption}>
							<Image
								style={styles.image}
								source={require('../assets/rgb.png')}
							/>

							<Text>Color</Text>
						</TouchableOpacity>
					</View>
				</View>
			);
		}
	};
	return (
		<KeyboardAvoidingView style={styles.container}>
			<View style={styles.inputContainer}>
				<TextInput
					placeholder='New Language Name'
					value={languageName}
					onChangeText={(newLanguageName) => {
						setLanguageName(newLanguageName);
					}}
					style={styles.input}
				/>
				<TouchableOpacity onPress={() => setModalVisible(true)}>
					<Banner />
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => AddLanguageToDb(navigation)}
					style={styles.login}>
					<Text style={styles.buttonText}>Create Language</Text>
				</TouchableOpacity>
			</View>
			<Modal
				animationType='fade'
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => {
					Alert.alert('Modal has been closed.');
					setModalVisible(!modalVisible);
				}}>
				<View style={styles.container}>
					<View style={styles.modalView}>
						<ModalContent />
					</View>
				</View>
			</Modal>
		</KeyboardAvoidingView>
	);
};

export default AddLanguage;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	flagListContainer: {
		paddingVertical: 20,
	},
	miniFlagContainer: {
		flex: 1 / 3,
		paddingVertical: 10,
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 2,
	},
	miniFlag: {
		height: 60,
		width: 90,
	},
	bigFlagContainer: {
		alignItems: 'center',
		paddingVertical: 30,
		margin: 15,
	},
	bigFlag: {
		width: 300,
		height: 200,
	},
	image: {
		height: 100,
		width: 150,
		marginBottom: 10,
	},
	inputContainer: {
		width: '80%',
	},
	input: {
		backgroundColor: '#fff',
		padding: 10,
		marginVertical: 3,
		borderRadius: 5,
	},
	choose: {
		backgroundColor: '#3d475e',
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 30,
		margin: 15,
	},
	changeFlagInfo: {
		backgroundColor: '#3d475e',
		borderBottomLeftRadius: 5,
		borderBottomRightRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 10,
		width: 200,
	},
	login: {
		backgroundColor: '#FF8DA1',
		borderRadius: 5,
		padding: 5,
		marginVertical: 3,
		marginTop: 40,
	},
	signup: {
		backgroundColor: '#67B7D1',
		borderRadius: 5,
		padding: 5,
		marginVertical: 3,
	},
	buttonText: {
		color: '#fff',
		fontSize: 20,
		textAlign: 'center',
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
	modalOptions: {
		marginTop: 2,
		paddingVertical: 20,
		borderTopColor: '#f2f2f2',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	modalUtil: {
		borderBottomWidth: 3,
		paddingBottom: 5,
		borderBottomColor: '#f2f2f2',
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	bannerOption: {
		alignItems: 'center',
	},
});
