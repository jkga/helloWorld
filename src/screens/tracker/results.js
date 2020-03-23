import React, { useState } from 'react' 
import useGlobalState from '../../stateManager/index'
import People from './assets/img/people.png'

import {
  Layout,
  Text,
  Button,
  Icon,
  Input,
  Card,
  CardHeader,
  Datepicker,
  Toggle,
} from "@ui-kitten/components"

import {
  View,
  ScrollView,
  Keyboard,
  Image,
} from 'react-native'

const searchVID = (e) => {
  console.log(e)
}


export default () => {

  const [profileData, setProfileData] = useGlobalState('profileData')


  const emptyDirectSearch = () => {
    return (<Text>
      There is no direct physical contact made with this account from specified date
    </Text>)
  }

  const searchSubjectCard = () => {
    return (<Card style={{marginBottom: 30}} header={() =>  <CardHeader title='Subject: c91de925-5e46-48ea-99fb-3c533087c5b8' description='Searching in 130 records'/>}>
      {emptyDirectSearch ()}
    </Card>)
  }


  const searchDateCard = () => {
    return (<Layout style={{flex: 1, flexDirection: 'row'}}>
            <Layout style={{width: 200, margin: 15}}>
              <Datepicker placeholder='Pick Date'/>
            </Layout>

            <Layout style={{width: 200, margin: 15}}>
              <Datepicker placeholder='Pick Date'/>
            </Layout>

            <Layout style={{width: 200, margin: 15}}>
              <Datepicker placeholder='Pick Date'/>
            </Layout>
        </Layout>)
  }

  const dateToggleSelector = () => {
    return (<Layout style={{flex: 1, marginBottom: 30, flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'flex-end'}}>
      <Toggle text='Show date filter' checked={false}/>
    </Layout>)
  }


  return(<Layout style={{ flex: 1, padding: 20}}>
      <ScrollView>
        <View>
          {dateToggleSelector ()}
          {searchDateCard ()}
          {searchSubjectCard ()}  
        </View>
      </ScrollView>
  </Layout>)
}