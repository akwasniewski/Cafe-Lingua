import { StatusBar } from 'expo-status-bar';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import UpperNav from './Components/UpperNav';
import LowerNav from './Components/LowerNav';
import Stats from './Components/Stats';
import Scrollable from './Components/Scrollable';
export default function App() {
	return (
		<View style={styles.container}>
			<UpperNav />
			<Scrollable />
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
