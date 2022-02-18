import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import {
	View,
	StyleSheet,
	Text,
	FlatList,
	TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Stats from './Stats';
const DATA = [
	{
		id: 'bd3acbea-c1b1-46c2-aed5-3ad53abb28ba',
		title: 'First Item',
	},
	{
		id: '3ac38afc-c605-48d3-a4f8-fbd91aa97f63',
		title: 'Second Item',
	},
	{
		id: '58634a0f-3da1-471f-bd96-145571e29d72',
		title: 'Third Item',
	},
	{
		id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
		title: 'Fourth Item',
	},
	{
		id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
		title: 'Fifth Item',
	},
	{
		id: '58694a0f-3da1-471f-bd96-145571e29d72',
		title: 'Sixth Item',
	},
	{
		id: 'bd7a3bea-c1b1-46c2-aed5-3ad53abb28ba',
		title: 'Seventh item',
	},
	{
		id: '3ac683fc-c605-48d3-a4f8-fbd91aa97f63',
		title: 'Eight Item',
	},
	{
		id: '58694a3f-3da1-471f-bd96-145571e29d72',
		title: 'Nineth Item',
	},
];

const Item = ({ title, navigation }) => (
	<TouchableOpacity
		onPress={() => {
			navigation.navigate('DeckOverview', {
				title: title,
			});
		}}>
		<View style={styles.item}>
			<View style={styles.info}>
				<Text style={styles.title}>{title}</Text>
				<Text>Cards: </Text>
			</View>
			<View style={styles.controls}>
				<TouchableOpacity>
					<View style={styles.learnButton}>
						<Text style={styles.learn}>Learn</Text>
						<Icon name='play' size={30} color='white' />
					</View>
				</TouchableOpacity>
				<TouchableOpacity>
					<View style={styles.editButton}>
						<Icon name='edit' size={30} color='white' />
					</View>
				</TouchableOpacity>
			</View>
		</View>
	</TouchableOpacity>
);

const Scrollable = ({ navigation }) => {
	const renderItem = ({ item }) => (
		<Item title={item.title} navigation={navigation} />
	);
	return (
		<View style={styles.container}>
			<FlatList
				ListHeaderComponent={Stats}
				data={DATA}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	item: {
		backgroundColor: '#d3d3d3',
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		borderRadius: 10,
	},
	info: {
		width: '50%',
	},
	learnButton: {
		flexDirection: 'row',
		backgroundColor: '#FF8DA1',
		marginTop: 15,
		alignItems: 'center',
		borderRadius: 10,
		padding: 10,
	},
	editButton: {
		marginTop: 15,
		marginLeft: 10,
		alignItems: 'center',
		borderRadius: 10,
		padding: 10,
		backgroundColor: '#67B7D1',
	},
	learn: {
		color: 'white',
		fontSize: 25,
	},
	title: {
		fontSize: 25,
	},
	controls: {
		flexDirection: 'row',
		width: '50%',
	},
});

export default Scrollable;
