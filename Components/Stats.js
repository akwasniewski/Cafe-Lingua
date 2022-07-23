import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import flags from '../assets/flags/getFlags';
import { languageGlobal, userEmailGlobal } from '../App';
import { db } from '../Database/firebase';
import { getDoc, doc } from 'firebase/firestore';
const Stats = (props) => {
	const [bannerMode, setBannerMode] = React.useState(0);
	const [flagId, setFlagId] = React.useState(0);
	React.useEffect(async () => {
		const language = await getDoc(
			doc(db, 'users/' + userEmailGlobal + '/languages/', languageGlobal)
		);
		// pretier-ignore
		{
			setBannerMode(language.data().bannerMode);
			setFlagId(language.data().flagId);
		}
	}, []);

	return (
		<View style={styles.container}>
			<View style={styles.column}>
				<View style={styles.bannerShadow}>
					<Image style={styles.flag} source={flags[flagId].src} />
				</View>

				<TouchableOpacity style={styles.button}>
					<Text style={styles.learn}>Learn all</Text>
					<Icon name='play' size={40} color='white' />
				</TouchableOpacity>
			</View>
			<View style={styles.column}>
				<View style={styles.languageWrapper}>
					<Text style={styles.language}>{languageGlobal}</Text>
				</View>
				<Text style={styles.stat}>Cards: {props.cardCount}</Text>
				<Text style={styles.stat}>Mastery: {props.mastery}% </Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop: 40,
		padding: 15,
		backgroundColor: '#fff',
		flexDirection: 'row',
	},
	column: {
		flex: 1,
		alignItems: 'center',
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
		flexDirection: 'row',
		padding: 10,
		backgroundColor: '#FF8DA1',
		marginTop: 15,
		alignContent: 'center',
		borderRadius: 10,
	},
});
export default Stats;
