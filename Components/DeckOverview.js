import React from 'react';
import { View, Text } from 'react-native';
const DeckOverview = ({ route, navigation }) => {
	const { title } = route.params;
	return (
		<View>
			<Text>{title}</Text>
		</View>
	);
};

export default DeckOverview;
