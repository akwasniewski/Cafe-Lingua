import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import UpperNav from './Components/UpperNav';
import Stats from './Components/Stats';
export default function App() {
	return (
		<View style={styles.container}>
			<UpperNav />
			<Stats />
			<StatusBar style='auto' />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
