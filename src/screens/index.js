import React, { useState, useEffect } from 'react' 
import { createStackNavigator } from '@react-navigation/stack'
import AuthScreen from './auth'
import Firebase from '../db/firebase'
import FirebaseAuth from '../services/auth/firebaseAuth'
import SnackBar from 'react-native-snackbar-component'
import FirebaseDBService from '../services/firebase/account'
import useGlobalState from '../stateManager/index'
import { generateQRCodeKey } from '../utils/qrGenerator'
import trackScreen from '../screens/track'
import env from '../../env.json'
import {
  Layout,
  Text,
  Button,
  Icon,
  Spinner,
} from "@ui-kitten/components"


const FirebaseAuthentication = new FirebaseAuth (Firebase)
const FirebaseDB = new FirebaseDBService (Firebase)
const Stack = createStackNavigator()

const snackBar = (isVisible, callback, data = {}) => {
  data.name = data.name || ''
  return (
    <SnackBar visible={isVisible} textMessage={`Hello ${data.name}!`} actionHandler={()=>{
      console.log("snackbar button clicked!")
      callback()
    }} actionText="let's go"/>
  )
}

const splash = () => {
  return(<Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Spinner size='large'/>
    <Text appearance='hint'>Please wait a moment</Text>
  </Layout>)
}

export default ({navigation}) =>  {

  const [isSnackSuccessVisible, setSnackSuccessVisibility] = useGlobalState('isSnackSuccessVisible')
  const [isLoggedIn, setLoggedInStatus] = useGlobalState('isLoggedIn')
  const [loginState, setLoginState] = useGlobalState('loginState')
  const [profileData, setProfileData] = useGlobalState('profileData')

  const loginSuccess = () => {
    setLoginState('done')
    setLoggedInStatus (true)
    setSnackSuccessVisibility (true)
    navigation.navigate ('Home')
  }

  const redirectToAuthenticationPage = () => {
    setLoggedInStatus (false)
    navigation.navigate ('Auth')
  }

  const register = (user, key) => {
    // signup for the very first time
    FirebaseDB.register (user.email, user.email,user.displayName, user.providerData[0].uid, user.photoURL, user.providerData[0].providerId).then(res => {
      console.log('Signed up successfully!')
      FirebaseDB.setVID(user.email).then(res => {
        console.log('Firebase: Registration -> Set VID successfully!')
        user.QRKey = generateQRCodeKey (user.name, res.VID, user.type || 'individual', key)
        if(res.email && res.VID) setProfileData (res)
        loginSuccess ()
      }).catch(err => {
        console.log(err)
        console.log('Firebase: Registration -> Set VID failed!!!')
        redirectToAuthenticationPage ()
      })
      
    }).catch(err => {
      console.log(err)
      console.log('Firebase: Account -> error registering')
      redirectToAuthenticationPage ()
    })
  }

  const firebaseLogin = (user, key) => {
    FirebaseDB.isAccountExists (user.email).then(res => {
      if(!res.VID) {
        (FirebaseDB.setVID(user.email) & console.log('Firebase: Account -> Set VID successfully!'))
        //FirebaseDB
      }
    }).catch(err => {
      register (user, key)
    })
  }

  const firebaseProfile = async (email, key) => {
    return await new Promise(async (resolve, reject) => {
      await FirebaseDB.getProfile (email).then(res => {
        // generate QR code and save profile to cache
        res.QRKey = generateQRCodeKey (res.name, res.VID, res.type || 'individual', key)
        if(res.email && res.VID) setProfileData (res)
        resolve(res)
      }).catch(err => {
        console.log('Firebase: [NO PROFILE] found in remote storage')
        reject(err)
      })
    })

  }

  const setProfileDataToCache = (profileData, firebaseJSON, email, key) => {
    if(!profileData.email) {
      console.log('Firebase: Profile -> [NOT FOUND] in cache')
      firebaseProfile (email, key).then(res => {
        console.log('Firebase: Saved data in cache')
        loginSuccess ()
      }).catch(err => {
        console.log('Firebase: [NO PROFILE] found in remote storage -> trying to create new one from Firebase Auth JSON')
        register (firebaseJSON)
      })
    } else {
      console.log('Firebase: Profile found in cache')
      loginSuccess ()
    }
  }

  const firebaseCheckAccount = (key) => {
    // firebase onevent change listener
    FirebaseAuthentication.isAuthenticated().then(json => { 
      //console.log(json.user)
      console.log('Firebase: User Authenticated')
      if(!json.user) {
        console.log('Firebase: No firebase account')
        firebaseLogin (json.user, key)
      } else {
        console.log('Firebase: Account -> exists & Opening cache')
        // get firebase data if not found in state
        setProfileDataToCache (profileData, json.user, json.user.email, key)
      }
    }).catch(e => {
      console.log(e)
      console.log('Firebase: Authorization required')
      redirectToAuthenticationPage ()
    })
  }


  useEffect(() => {
    firebaseCheckAccount (env.key)
  }, [])

  useEffect(() => {
    //success login from btn click
    if(loginState === 'finished'){
      console.log('Firebase: Third Party OAuth successfully executed')
      console.log('Firebase: Checking Firebase account from cache & remote server')
      firebaseCheckAccount (env.key)
      //navigation.navigate ('Splash')
    }
    // on logout & reset to initial state
    console.log(loginState)
    if(loginState === 'logout'){
      setProfileData ({})
      navigation.navigate ('Auth')
      setLoginState('pending')
    }
  })


  return (
    <Stack.Navigator initialRouteName='Splash' mode='modal' headerMode='none'>
      <Stack.Screen name="Splash" component={splash}/>
      <Stack.Screen name="Auth" component={AuthScreen}/>
      <Stack.Screen name="Home" component={trackScreen}/>
    </Stack.Navigator>)
  }