import React, { useEffect } from 'react';
import {
	SectionList,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	Image,
} from 'react-native';
import DeckOverview from '../Components/DeckOverview';
const Stack = createNativeStackNavigator();
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Scrollable from '../Components/Scrollable';
import Learn from '../Components/Learn';
import AddCards from '../Components/AddCards';
import AddDeck from '../Components/AddDeck';
import SettingsScreen from './SettingsScreen';
import Icon from 'react-native-vector-icons/Feather';
import AddLanguage from '../Components/AddLanguage';
import { languageGlobal } from '../App';
const Home = (props) => {
	const Scroll = ({ navigation }) => {
		return (
			<Scrollable
				setLanguage={(newLanguage) => props.setLanguage(newLanguage)}
				navigation={navigation}
			/>
		);
	};
	const CallSettings = () => {
		return (
			<SettingsScreen
				setLanguage={(newLanguage) => props.setLanguage(newLanguage)}
				setUserEmail={(newEmail) => props.setUserEmail(newEmail)}
			/>
		);
	};
	const AddLanguageMain = ({ navigation }) => {
		const AddNewLanguage = (newLanguage) => {
			navigation.navigate('Language');
			props.setLanguage(newLanguage);
		};
		return (
			<AddLanguage setLanguage={(newLanguage) => AddNewLanguage(newLanguage)} />
		);
	};
	return (
		<Stack.Navigator
			initialRouteName='Language'
			screenOptions={{
				headerStyle: {
					backgroundColor: '#3d475e',
				},
				headerTintColor: '#fff',
			}}>
			<Stack.Group>
				<Stack.Screen
					name='Language'
					component={Scroll}
					options={{
						headerTitle: languageGlobal,
						headerLeft: () => (
							<Image
								style={styles.logo}
								source={require('../assets/moka2.png')}
							/>
						),
					}}
				/>
				<Stack.Screen
					name='DeckOverview'
					component={DeckOverview}
					language={languageGlobal}
				/>
				<Stack.Screen
					name='AddCards'
					component={AddCards}
					language={languageGlobal}
				/>
				<Stack.Screen
					name='AddDeck'
					component={AddDeck}
					language={languageGlobal}
					options={{
						headerTitle: 'Add Deck',
					}}
				/>
				<Stack.Screen
					name='AddAnotherLanguage'
					component={AddLanguageMain}
					options={{
						headerTitle: 'Add Another Language',
					}}
				/>
				<Stack.Screen name='Settings' component={CallSettings} />
			</Stack.Group>
			<Stack.Group>
				<Stack.Screen
					name='Learn'
					component={Learn}
					language={languageGlobal}
				/>
			</Stack.Group>
		</Stack.Navigator>
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
	logo: {
		width: 50,
		height: 50,
		marginTop: -2,
		marginLeft: -15,
	},
});
export default Home;
