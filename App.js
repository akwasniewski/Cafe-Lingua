import { StatusBar } from 'expo-status-bar';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import UpperNav from './Components/UpperNav';
import LowerNav from './Components/LowerNav';
import Stats from './Components/Stats';
export default function App() {
	return (
		<View style={styles.container}>
			<UpperNav />
			<ScrollView style={styles.scroll}>
				<Stats />
			</ScrollView>
			<LowerNav />
			<StatusBar style='auto' />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	scroll: {
		height: '70%',
	},
});
