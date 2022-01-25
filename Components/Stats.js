import React from 'react';
import {
	View,
	StyleSheet,
	Image,
	Text,
	Pressable,
	TouchableOpacity,
} from 'react-native';

const Stats = () => {
	return (
		<View style={styles.container}>
			<View style={styles.column}>
				<Image style={styles.flag} source={require('../assets/french.png')} />
				<TouchableOpacity style={styles.button}>
					<Text style={styles.learn}>Learn all</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.column}>
				<View style={styles.languageWrapper}>
					<Text style={styles.language}>French</Text>
				</View>
				<Text style={styles.stat}>Cards: </Text>
				<Text style={styles.stat}>Mastery: </Text>
				<Text style={styles.stat}>Time:</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: '20%',
		padding: 15,
		backgroundColor: '#fff',
		flexDirection: 'row',
	},
	column: {
		flex: 1,
		alignItems: 'center',
	},
	flag: {
		height: 73,
		width: 110,
	},
	languageWrapper: {
		borderBottomWidth: 3,
		width: '100%',
		alignItems: 'center',
		borderColor: '#3d475e',
	},
	language: {
		fontSize: 30,
		color: '#3d475e',
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
		width: '80%',
		backgroundColor: 'purple',
		marginTop: 10,
		alignItems: 'center',
		borderRadius: 10,
	},
});
export default Stats;
