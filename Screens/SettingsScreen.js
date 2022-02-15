import React from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
const Home = () => {
	return (
		<View style={styles.container}>
			<Text>settings</Text>
		</View>
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
});
export default Home;
