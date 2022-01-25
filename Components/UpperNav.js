import React from 'react';
import { Text, SafeAreaView, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
const UpperNav = () => {
	return (
		<SafeAreaView style={styles.upperNavOut}>
			<View style={styles.upperNavIn}>
				<Text style={styles.text}>Cafe Lingua</Text>
				<Icon name='settings' size={25} color='white' />
			</View>
		</SafeAreaView>
	);
};
const styles = StyleSheet.create({
	upperNavOut: {
		height: 130,
		backgroundColor: '#3d475e',
	},
	upperNavIn: {
		padding: 15,
		justifyContent: 'space-between',
		flexDirection: 'row',
	},
	text: {
		color: '#fff',
		fontSize: 25,
		textAlign: 'center',
	},
});
export default UpperNav;
