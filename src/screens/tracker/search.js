import React, { useState } from 'react' 
import SnackBar from 'react-native-snackbar-component'
import useGlobalState from '../../stateManager/index'
import People from './assets/img/people.png'

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
          style={{width: 300, height: 300}}
          resizeMode="contain"
          source={People}
        />
          <Text category='h1'>HelloWorld</Text>
          <Text style={{textAlign: 'center', padding: 40}}>
            Helps you track if you determine if you have any direct or indirect physical contact {"\n"}for this past few weeks
          </Text>
        </View>
        <View style={{justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}>
          <Layout style={{width: 400}}>
                      <Input
              size='large'
              placeholder='Enter Virtual Identification Document (VID)'
              icon={()=><Icon name='search-outline'/>}
              onIconPress={()=> searchVID (navigation)}
              onSubmitEditing={Keyboard.dismiss}
            />
          </Layout>

        </View>
                
      </ScrollView>


    {snackBar(isSnackSuccessVisible, () => {
      setSnackSuccessVisibility (false)
    },profileData)}
  </Layout>)
}