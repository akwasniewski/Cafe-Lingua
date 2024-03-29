import React from 'react';
import {
	View,
	StyleSheet,
	Image,
	Text,
	TouchableOpacity,
	Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
const DeckStats = (props, navigation) => {
	const mastery = Math.round(100 * (props.mastery / (props.cardCount * 2)));
	return (
		<View style={styles.container}>
			<Text style={styles.deckName}>{props.deckName}</Text>
			<View style={styles.columnContainer}>
				<View style={styles.column}>
					<TouchableOpacity
						style={styles.learnButton}
						onPress={() => {
							if (props.cardCount > 1) {
								props.navigation.navigate('Learn', {
									deckName: props.deckName,
									mastery: props.mastery,
									cardCount: props.cardCount,
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
						<Icon name='play' size={40} color='white' />
					</TouchableOpacity>
				</View>
				<View style={styles.column}>
					<Text style={styles.stat}>Cards: {props.cardCount}</Text>
					<Text style={styles.stat}>Mastery: {mastery}%</Text>
				</View>
			</View>
			<View style={styles.util}>
				<TouchableOpacity
					style={styles.editButton}
					onPress={() => {
						props.setMoreModal();
					}}>
					<Icon name='more-horizontal' color='#ffffff' size={26} />
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.editButton}
					onPress={() => {
						props.navigation.navigate('AddCards', {
							deckName: props.deckName,
						});
					}}>
					<Icon name='plus' color='#ffffff' size={26} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 40,
		padding: 15,
		backgroundColor: '#fff',
	},
	columnContainer: {
		marginTop: 10,
		flexDirection: 'row',
		paddingTop: 5,
		borderTopWidth: 3,
		borderColor: '#3d475e',
	},
	column: {
		flex: 1,
		alignItems: 'center',
	},
	flag: {
		height: 73,
		width: 110,
	},
	deckName: {
		fontSize: 30,
		color: '#3d475e',
		textAlign: 'center',
	},
	learn: {
		color: 'white',
		fontSize: 30,
	},
	stat: {
		color: '#3d475e',
		fontSize: 20,
		padding: 3,
	},
	util: {
		flexDirection: 'row-reverse',
	},
	learnButton: {
		flexDirection: 'row',
		padding: 10,
		backgroundColor: '#FF8DA1',
		marginTop: 15,
		alignItems: 'center',
		borderRadius: 10,
	},
	editButton: {
		flexDirection: 'row',
		padding: 10,
		marginLeft: 5,
		backgroundColor: '#3d475e',
		marginTop: 15,
		alignItems: 'center',
		borderRadius: 10,
	},
});
export default DeckStats;
