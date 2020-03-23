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
    </Stack.Navigator>
  )
}


