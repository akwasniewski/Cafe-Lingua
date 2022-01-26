import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
const LowerNav = () => {
	return (
		<View style={styles.container}>
			<Icon name='home' size={35} color='white' />
			<Icon name='plus-circle' size={35} color='white' />
			<Icon name='search' size={35} color='white' />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: '10%',
		backgroundColor: '#3d475e',
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingTop: 15,
	},
});
export default LowerNav;
