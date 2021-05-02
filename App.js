import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createAppContainer, createSwitchNavigator,} from 'react-navigation';
import WelcomeScreen from './screens/welcomeScreen';
import{ AppTabNavigator} from './components/appTabNavigator';
import {AppDrawerNavigator} from './components/appDrawerNavigator';
import {AppStackNavigator} from './components/appStackNavigator';

export default function App() {
  return (
    <AppContainer/>
  );
}


const switchNavigator = createSwitchNavigator({
  WelcomeScreen:{screen: WelcomeScreen},
  Drawer:{screen: AppDrawerNavigator},
  BottomTab:{screen: AppTabNavigator},
  Stack:{screen: AppStackNavigator}
})

const AppContainer =  createAppContainer(switchNavigator);