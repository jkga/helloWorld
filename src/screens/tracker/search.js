import React, { useState } from 'react' 
import SnackBar from 'react-native-snackbar-component'
import People from './assets/img/people.png'
import useGlobalState from '../../stateManager/index'

import {
  Layout,
  Text,
  Button,
  Icon,
  Input
} from "@ui-kitten/components"

import {
  View,
  ScrollView,
  Keyboard,
  Image,
} from 'react-native'


const snackBar = (isVisible, callback, data = {}) => {
  data.name = data.name || ''
  return (
    <SnackBar visible={isVisible} textMessage={`Hello ${data.name}!`} actionHandler={()=>{
      console.log("snackbar button clicked!")
      callback()
    }} actionText="let's go"/>
  )
}

export default ({navigation}) => {

  const [isSnackSuccessVisible, setSnackSuccessVisibility] = useGlobalState('isSnackSuccessVisible')
  const [profileData, setProfileData] = useGlobalState('profileData')

  const searchVID = (navigation) => {
    navigation.navigate('TrackerSearchResults')
  }
  
  

  return(<Layout style={{ flex: 1 ,  justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>

      <ScrollView keyboardDismissMode='interactive' keyboardShouldPersistTaps='never'  contentContainerStyle={{flexGrow : 1, alignItems: 'center', justifyContent: 'center'}}>
        <View style={{ alignItems: 'center'}}>
        <Image
          style={{width: 200, height: 200}}
          resizeMode="contain"
          source={People}
        />
          <Text category='h1'>HelloWorld</Text>
          <Text style={{textAlign: 'center', padding: 40}}>
            This mobile application aims to monitor physical human interaction by recording digitally all possible close human contacts and visited places 
            with a very least minimum action and effort. This also aims to ensure that recording and tracing of all contacts wil be faster and more reliable 
            than memory and written notes.
          </Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
          <Layout>
                      <Input
              size='large'
              placeholder='Enter Virtual Identification Document (VID)'
              icon={()=><Icon name='search-outline'/>}
              onIconPress={()=> searchVID (navigation)}
              onSubmitEditing={Keyboard.dismiss}
            />
          </Layout>

          <Layout style={{justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
            <Text>-OR-</Text>
            <Button appearance='outline' status='info' style={{marginTop: 10}}>SCAN CODE</Button>
          </Layout>

        </View>
                
      </ScrollView>


    {snackBar(isSnackSuccessVisible, () => {
      //setSnackSuccessVisibility (false)
      navigation.navigate('Me')
    },profileData)}
  </Layout>)
}