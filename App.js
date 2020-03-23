import React, { useState, useEffect } from "react"
import {
  AccessibilityRole,
  ImageProps,
  ImageStyle,
  StyleSheet,
  TouchableOpacity,
  View,
  Text as RNText,
  SafeAreaView,
  Alert,
  
} from "react-native"

import {
  ApplicationProvider,
  Button,
  Icon,
  IconRegistry,
  Layout,
  Text,
  Divider,
  Spinner,
  TopNavigation,
  BottomNavigation, 
  BottomNavigationTab
} from "@ui-kitten/components"

import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { EvaIconsPack } from "@ui-kitten/eva-icons"
import { mapping, light, dark } from "@eva-design/eva"
import IndexScreen from './src/screens/index'
import StatScreen from './src/screens/stat'
import MeScreen from './src/screens/me'
import SignInRequiredScreen from './src/screens/signinRequired'

import useGlobalState from './src/stateManager/index'

const BottomTab = createBottomTabNavigator()


const themes = {
  light: {
    theme: light,
    icon: "sun",
    text: "LIGHT",
  },
  dark: {
    theme: dark,
    icon: "moon",
    text: "DARK",
  },
}



const BottomTabBar = ({ navigation, state }) => {
  const onSelect = (index) => {
    navigation.navigate(state.routeNames[index])
  }
  return (
    <SafeAreaView>
      <BottomNavigation selectedIndex={state.index} onSelect={onSelect}>
        <BottomNavigationTab  icon={() => <Icon name='home-outline'/>}/>
        <BottomNavigationTab  icon={() => <Icon name='pin-outline'/>}/>
        <BottomNavigationTab  icon={() => <Icon name='person-outline'/>}/>
      </BottomNavigation>
    </SafeAreaView>
  )
}


const App = () => {

  const [themeName, setThemeName] = useState("light")
  const theme = themes[themeName].theme
  const [isLoggedIn, setLoggedInStatus] = useGlobalState('isLoggedIn')
  const [profileData, setProfileData] = useGlobalState('profileData')
  
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider mapping={mapping} theme={theme}>
        <Layout style={styles.container}></Layout>
        <NavigationContainer>
          <BottomTab.Navigator tabBar={props => <BottomTabBar {...props} />}>
            <BottomTab.Screen name='Main' component={IndexScreen}/>
            { isLoggedIn ? <BottomTab.Screen name='Stat' component={StatScreen} lazy={true}/> : <BottomTab.Screen name='Stat' component={SignInRequiredScreen} lazy={true}/>}
            { isLoggedIn ? <BottomTab.Screen name='Me' component={MeScreen} lazy={true}/> : <BottomTab.Screen name='Me' component={SignInRequiredScreen} lazy={true}/>}
          </BottomTab.Navigator>
        </NavigationContainer>
      </ApplicationProvider>
    </>
  )
}

const styles = StyleSheet.create({
  container: {

  },
  text: {
    textAlign: "center",
  },
  iconButton: {
    marginVertical: 16,
  },
  nativeButton: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
})

export default App