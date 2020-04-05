import React, { useState, useEffect } from 'react'
import Firebase from '../../db/firebase'
import FirebaseDBService from '../../services/firebase/privacy'
import useGlobalState from '../../stateManager/index'


import {
  Layout,
  Text,
  Button,
  Icon,
  Toggle,
} from "@ui-kitten/components"

import {
  View, StyleSheet
} from 'react-native'

const FirebaseDB = new FirebaseDBService (Firebase)

export default ({navigation}) => {
  const [profileData, setProfileData] = useGlobalState('profileData')
  const [isNameVisible, setNameVisible] = useState(true)
  const [isLocationVisible, setLocationVisible] = useState (true)


  const onCheckedNameChange = (isChecked) => {
    setNameVisible (isChecked)
    FirebaseDB.setNameVisibility(profileData.email, isChecked).then(res => {
      setNameVisible (isChecked)
      setProfileData (prev => {
        prev.privacy.name = !prev.privacy.name
        return prev
      })
    }).catch(e => {
      setNameVisible (!isChecked)
    })
  }

  const onCheckedLocationChange = (isChecked) => {
    setLocationVisible (isChecked)
    FirebaseDB.setLocationVisibility(profileData.email, isChecked).then(res => {
      setLocationVisible (isChecked)
      setProfileData (prev => {
        prev.privacy.location = !prev.privacy.location
        return prev
      })
    }).catch(e => {
      setLocationVisible (!isChecked)
    })
  }

  useEffect(() => {
    if(profileData.privacy) {
      setNameVisible (profileData.privacy.name)
      setLocationVisible (profileData.privacy.location)
    }
  },[])

  return(<Layout style={{ flex: 1, padding: 30}}>
    <Icon name='facebook' width={30} height={30}/>
    <Text category='h6'>Data Review</Text>
    <Text appearance='hint' category='label'>
      Manage the visibility of the data that you share to public
    </Text>
    <Layout style={styles.container}>
      <Layout style={styles.item}>
        <Text>Virtual Identification Document (VID)</Text>
      </Layout>
      <Layout style={styles.item}>
        <Toggle text='Enabled' checked={true} disabled={true}/>
      </Layout>

      <Layout style={styles.item}>
        <Text>Name</Text>
      </Layout>
      <Layout style={styles.item}>
        <Toggle text={isNameVisible ? 'Enabled' :'Disabled'} checked={isNameVisible} onChange={onCheckedNameChange}/>
      </Layout>

      <Layout style={styles.item}>
        <Text>Location</Text>
      </Layout>
      <Layout style={styles.item}>
        <Toggle text={isLocationVisible ? 'Enabled' :'Disabled'} checked={isLocationVisible} onChange={onCheckedLocationChange}/>
      </Layout>


      <Layout style={styles.item}>
        <Text>Account Type</Text>
        <Text appearance='hint' style={{fontSize: 12}}>Individual, Organization, Government, Private company</Text>
      </Layout>
      <Layout style={styles.item}>
        <Toggle text='Disabled' checked={false} disabled={true}/>
      </Layout>

    </Layout>
  </Layout>)
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    marginTop: 50
  },
  item: {
    width: '50%', // is 50% of container width
    padding: 20,
  }
})
