

import React, { useState, useEffect } from "react"
import {
  View,
} from 'react-native'

import {
  Text,
  Icon
} from "@ui-kitten/components"
import { createStackNavigator } from '@react-navigation/stack'
import SearchScreen from './tracker/search'
import SearchScreenResults from './tracker/results'


const Stack = createStackNavigator()


export default ({navigation}) => { 

  return (
    <Stack.Navigator initialRouteName='TrackerSearch' mode='screen'>
      <Stack.Screen name="TrackerSearch" component={SearchScreen} options={{
        headerShown: false
      }}/>
      <Stack.Screen name="TrackerSearchResults" component={SearchScreenResults} options={{
        title: 'Search Results',
      }}/>
    </Stack.Navigator>
  )
}