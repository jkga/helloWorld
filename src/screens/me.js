import React, { useState, useEffect } from "react"
import {
  View,
} from 'react-native'

import {
  Text,
  Icon
} from "@ui-kitten/components"
import { createStackNavigator } from '@react-navigation/stack'
import AboutScreen from './profile/about'
import SettingsScreen from './profile/settings'
import SettingsPrivacyScreen from './settings/privacy'
import SettingsAboutScreen from './settings/about'
import SettingsAccountTypeScreen from './settings/accountType'


const Stack = createStackNavigator()


export default ({navigation}) => { 

  return (
    <Stack.Navigator initialRouteName='AccountProfile' mode='modal'>
      <Stack.Screen name="AccountProfile" component={AboutScreen} options={{
        title: 'Profile',
        headerRight: () => <Icon name='settings-outline'  width={25} height={25} style={{marginRight: 10}} onPress={()=> navigation.navigate('AccountSettings')}/>
      }}/>
      <Stack.Screen name="AccountSettings" component={SettingsScreen} options={{
        title: 'Account Settings'
      }}/>
      <Stack.Screen name="AccountSettingsPrivacy" component={SettingsPrivacyScreen} options={{
          title: 'Privacy Settings'
      }}/>
      <Stack.Screen name="AccountSettingsAbout" component={SettingsAboutScreen} options={{
          title: 'About Application'
      }}/>
      <Stack.Screen name="AccountSettingsAccountType" component={SettingsAccountTypeScreen} options={{
          title: 'Account Type'
      }}/>
    </Stack.Navigator>
  )
}


