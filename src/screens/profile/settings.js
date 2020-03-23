import React, { useState, useEffect } from "react"
import Firebase from '../../db/firebase'
import FirebaseAuth from '../../services/auth/firebaseAuth'
import useGlobalState from '../../stateManager/index'
import {
  View, Alert,
} from 'react-native'

import {
  Text,
  Icon,
  ListItem,
} from "@ui-kitten/components"
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator()

export default ({navigation}) => {
  const [isLoggedIn, setLoggedInStatus] = useGlobalState('isLoggedIn')
  const [isSnackSuccessVisible, setSnackSuccessVisibility] = useGlobalState('isSnackSuccessVisible')
  const [loginState, setLoginState] = useGlobalState('loginState')
  const [profileData, setProfileData] = useGlobalState('profileData')
  const accountLogout = (navigation) => {
    const FirebaseAuthentication = new FirebaseAuth (Firebase)
    FirebaseAuthentication.logout().then(res => {
      setSnackSuccessVisibility (false)
      setLoggedInStatus(false)
      setLoginState ('logout')
    }).catch(err => Alert.alert('Unable to logout. Please try again'))
  
  }

  return (
    <View>
      <ListItem title='Location' description='Change your permanent address' icon={()=> <Icon name='pin-outline'/>}/>
      <ListItem title='Privacy' description='Change primary settings' icon={()=> <Icon name='lock-outline'/>}/>
      <ListItem title='Log-out' description='Sign-out to your account' icon={()=> <Icon name='person-outline'/>} onPress={()=> accountLogout (navigation)}/>
      <ListItem title='About' description='About this application' icon={()=> <Icon name='award-outline'/>}/>
    </View>)
}