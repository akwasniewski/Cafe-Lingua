import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
const DeckStats = (props) => {
	return (
		<View style={styles.container}>
			<Text style={styles.deckName}>{props.deckName}</Text>
			<View style={styles.columnContainer}>
				<View style={styles.column}>
					<TouchableOpacity style={styles.button}>
						<Text style={styles.learn}>Learn</Text>
						<Icon name='play' size={40} color='white' />
					</TouchableOpacity>
				</View>
				<View style={styles.column}>
					<Text style={styles.stat}>Cards: {props.cardCount}</Text>
					<Text style={styles.stat}>Mastery: </Text>
				</View>
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
	button: {
		flexDirection: 'row',
		padding: 10,
		backgroundColor: '#FF8DA1',
		marginTop: 15,
		alignItems: 'center',
		borderRadius: 10,
	},
});
export default DeckStats;
