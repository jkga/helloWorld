import React, { useState, useEffect } from 'react'
import useGlobalState from '../../stateManager/index' 
import Firebase from '../../db/firebase'
import FirebaseDBService from '../../services/firebase/account'
import {Updates} from 'expo'

import {
  Layout,
  Text,
  Button,
  Icon,
  Select,
  Spinner
} from "@ui-kitten/components"

import {
  View, StyleSheet
} from 'react-native'

const FirebaseDB = new FirebaseDBService (Firebase)

export default ({navigation}) => {
  const [profileData, setProfileData] = useGlobalState('profileData')
  const [test, setTest] = useGlobalState('test')
  const [selectedOption, setSelectedOption] = useState(null)
  const [isSaving, setSaving] = useState(false)
  const [isSuccess, setSuccess] = useState(false)
  const [isFailed, setFailed] = useState(false)
  const data = [
    { text: 'Individual', value: 'individual' },
    { text: 'Organization' , value: 'organization' },
    { text: 'Academe' , value: 'academe' },
    { text: 'Corporate' , value: 'corporate' },
    { text: 'Government' , value: 'government' },
    { text: 'Community' , value: 'community' },
  ]


  const selectOption = (index) => {
    setSelectedOption (index)
  }

  const saveCategory = () => {
    console.log('Account: Saving category')
    setSaving (true)
    if(!selectedOption.value) setSaving (false)
    FirebaseDB.setType(profileData.email, selectedOption.value).then(res => {
      console.log('Account: Category changed')
      setProfileData (prevState => {
        prevState.type = selectedOption.value
        return prevState
      })
      setSaving (false)
      setSuccess (true)

    }).catch(err => setFailed(true) & setSaving(false))
  }

  const renderSaveIcon = () => {
    if(isSuccess) return (<Icon name='checkmark-circle-2-outline' width={30} height={30} fill='rgb(255,255,255)'/>)
    return  (<Icon name='person-outline'/>)
  }

  const restartApp = () => {
    Updates.reload()
  }

  useEffect(() => {
    // change default type
    if(!profileData.type) setSelectedOption (data[0])
  },[])
 

  return(<Layout style={{flex: 1}}>
    <Layout style={{ flex: 1, padding: 30}}>
      <Layout>
        <Text category='h6'>Bussiness Type</Text>
        <Text appearance='hint' category='label'>
          Please select type appropriately
        </Text>
      </Layout>

      <Layout>
        <Select data={data} selectedOption={selectedOption} onSelect={selectOption}/>
      </Layout>

      <Layout style={{marginTop: 30}}>
        { !isSaving ? <Button onPress={saveCategory} icon={renderSaveIcon}> {isSuccess ? 'SAVED' : 'SAVE'}</Button> : <Layout style={{alignItems: 'center'}}><Spinner size='medium'/></Layout> }
        { isFailed ? <Text status='danger'>Unable to save. Please try again later</Text> : undefined}
        { isSuccess ? <Layout style={{marginTop: 70}}>

          <Button onPress={restartApp} status='danger'>You need to restart the app to see the changes. Restart Now</Button>
        </Layout>: undefined}
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
