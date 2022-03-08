import React from 'react';
import {
	NavigationContainer,
	StackActions,
	useLinkProps,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
const Stack = createNativeStackNavigator();
import HomeScreen from './Screens/HomeScreen';
import SettingsScreen from './Screens/SettingsScreen';
import Icon from 'react-native-vector-icons/Feather';
const Tab = createMaterialBottomTabNavigator();
export default function App() {
	const [user, setUser] = React.useState([]);
	const SettingsScreenCall = () => {
		return (
			<SettingsScreen user={user} setUser={(newUser) => setUser(newUser)} />
		);
	};
	return (
		<>
			<NavigationContainer>
				<Tab.Navigator
					barStyle={{
						backgroundColor: '#3d475e',
					}}
					activeColor='#FF8DA1'
					inactiveColor='white'>
					<Tab.Screen
						name='Home'
						component={HomeScreen}
						options={{
							tabBarLabel: 'Home',
							tabBarIcon: ({ color }) => (
								<Icon name='home' color={color} size={26} />
							),
						}}
					/>
					<Tab.Screen
						name='Settings'
						component={SettingsScreenCall}
						options={{
							tabBarLabel: 'Settings',
							tabBarIcon: ({ color }) => (
								<Icon name='settings' color={color} size={26} />
							),
						}}
					/>
				</Tab.Navigator>
			</NavigationContainer>
		</>
	);
}
