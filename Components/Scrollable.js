import React from 'react';
import {
	View,
	SectionList,
	StyleSheet,
	Text,
	StatusBar,
	FlatList,
} from 'react-native';
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
		title: 'First Item',
	},
	{
		id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
		title: 'Second Item',
	},
	{
		id: '58694a0f-3da1-471f-bd96-145571e29d72',
		title: 'Third Item',
	},
	{
		id: 'bd7a3bea-c1b1-46c2-aed5-3ad53abb28ba',
		title: 'First Item',
	},
	{
		id: '3ac683fc-c605-48d3-a4f8-fbd91aa97f63',
		title: 'Second Item',
	},
	{
		id: '58694a3f-3da1-471f-bd96-145571e29d72',
		title: 'Third Item',
	},
];

const Item = ({ title }) => (
	<View style={styles.item}>
		<Text style={styles.title}>{title}</Text>
	</View>
);

const Scrollable = () => {
	const renderItem = ({ item }) => <Item title={item.title} />;

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
		backgroundColor: '#f9c2ff',
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
	},
	title: {
		fontSize: 32,
	},
});

export default Scrollable;
