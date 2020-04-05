import React, { useState, useEffect } from 'react'
import SnackBar from 'react-native-snackbar-component'
import Firebase from '../db/firebase'
import FirebaseAuth from '../services/auth/firebaseAuth'
import FacebookAuth from '../services/auth/facebookAuth'
import FirebaseDBService from '../services/firebase/account'
import useGlobalState from '../stateManager/index'
import People from './tracker/assets/img/people.png'

import {
  Layout,
  Text,
  Button,
  Icon,
  Spinner,
} from "@ui-kitten/components"
import { Alert, YellowBox, Image } from 'react-native'


const snackBar = (isVisible, callback, data = {}) => {
  data.name = data.name || ''
  return (
    <SnackBar visible={isVisible} textMessage={`Hello! ${data.name}`} actionHandler={()=>{
      console.log("snackbar button clicked!")
      callback()
    }} actionText="let's go"/>
  )
}


const snackBarFailed = (isVisible) => {
  return (
    <SnackBar visible={isVisible} textMessage="Sorry! Something went wrong" actionHandler={()=>{}} actionText="Try again later"/>
  )
}

YellowBox.ignoreWarnings([
  'Setting a timer', // TODO: Remove when fixed
])

const FirebaseAuthentication = new FirebaseAuth (Firebase)
const FirebaseDB = new FirebaseDBService (Firebase)

export default ({navigation}) => {

  const [isSnackSuccessVisible, setSnackSuccessVisibility] = useGlobalState('isSnackSuccessVisible')
  const [isLoggedIn, setLoggedInStatus] = useGlobalState('isLoggedIn')
  const [loginState, setLoginState] = useGlobalState('loginState')
  const [profileData, setProfileData] = useGlobalState('profileData')


  useEffect(() => {
      if(loginState === 'loading' && isLoggedIn === false) {
        setLoginState ('fetching')   
        const FacebookAuthentication = new FacebookAuth ()
        FacebookAuthentication.login().then(fb => {
          //fb check
          if(!fb.token) return setLoginState ('failed')
          console.log('FB: Sucess')
          // firebase login
          FirebaseAuthentication.login(fb.token).then(json => {
            //console.log(json)
            console.log('Firebase authenticated successfully')
            setLoginState ('finished')
            //firebaseLogin ()
          }).catch((err) => {
            console.log(err)
            console.log('Firebase failed!!')
            setLoginState ('failed')
          }) 

        }).catch(err => {
          // facebook error
          if(err.status === 'canceled') {
            setLoggedInStatus (false)
            setLoginState ('pending')
          } else {
            console.log(err)
            setLoginState ('failed')
          }
        })
      }  
    
  })

  return(<Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Image style={{width: 300, height: 300}} resizeMode="contain" source={People}/>
    <Text category='h1'>HelloWorld</Text>
    <Text style={{textAlign: 'center', padding: 20}}>
      This mobile application aims to monitor physical human interaction by recording digitally all possible close human contacts and visited places 
      with a very least minimum action and effort. This also aims to ensure that recording and tracing of all contacts wil be faster and more reliable 
      than memory and written notes.
    </Text>
    <Layout style={{marginTop: 50, textAlign: 'center'}}>
      {(!isLoggedIn && (loginState === 'pending' || loginState === 'failed')) ? <Button onPress={() => setLoginState ('loading')} icon = {() => <Icon name='facebook' width={20} height={20}/>}>Login via facebook</Button> : <Text></Text>}
      {loginState === 'loading' ? <>
        <Button icon = {() => <Icon name='facebook' width={20} height={20}/>}  disabled={true}>Authenticating . . .</Button>
        <Layout style={{ marginTop: 20, alignItems:'center'}}><Spinner size='large'/></Layout></> : <Text></Text>}
      {loginState === 'finished' ? 
        <Layout>
          <Text><Spinner size='large'/></Text>
        </Layout> : <Layout></Layout>
      }
    </Layout>
    

    {/*snackBar(isSnackSuccessVisible, () => {
      //setSnackSuccessVisibility (false)
      navigation.navigate('AccountProfile')
    },profileData)*/}

    {snackBarFailed(loginState === 'failed')}

    

  </Layout>)
}

