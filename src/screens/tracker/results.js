import React, { useState, useEffect } from 'react' 
import Firebase from '../../db/firebase'
import FirebaseDBService from '../../services/firebase/scan'
import useGlobalState from '../../stateManager/index'
import Heart from './assets/img/heart.png'

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

const CURRENT_DATE = new Date()
const CURRENT_YEAR = CURRENT_DATE.getFullYear ()
const CURRENT_MONTH = CURRENT_DATE.getMonth() < 9 ? ('0' + CURRENT_DATE.getMonth()) : CURRENT_DATE.getMonth()
const CURRENT_DAY = '01'
const CURRENT_MONTH_END = '31'
const CURRENT_UNIX_TIMESTAMP = Math.floor(Date.parse(new Date(CURRENT_YEAR, CURRENT_MONTH, CURRENT_DAY)) / 1000)
const CURRENT_MONTH_END_UNIX_TIMESTAMP = Math.floor(Date.parse(new Date(CURRENT_YEAR, CURRENT_MONTH, CURRENT_MONTH_END)) / 1000)
const searchVID = (e) => {
  console.log(e)
}

const FirebaseDB = new FirebaseDBService (Firebase)
export default () => {
  const [profileData, setProfileData] = useGlobalState('profileData')
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => { 
    console.log('start at: ',CURRENT_UNIX_TIMESTAMP)
    console.log('end at: ',CURRENT_MONTH_END_UNIX_TIMESTAMP)
    FirebaseDB.searchScan (profileData.email, CURRENT_UNIX_TIMESTAMP , CURRENT_MONTH_END_UNIX_TIMESTAMP).then(res => {
      console.log(res)
      setSearchResults (res)
    })
  },[])

  const showResults = () => {
  let res = searchResults.map((val, i) => { 
    let data = JSON.parse(JSON.stringify(Object.values(val)[0]))
    let d = new Date(data.createdAt*1000)
    return (
      <Layout key={i} style={{flex: 1, flexDirection: 'row'}}>
        <Layout style={{width: '70%'}}><Text>{i+1}. {data.name}</Text></Layout>
        <Layout><Text appearance='hint' style={{ alignSelf: 'flex-end'}}>{d.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text></Layout>
      </Layout>) 
  })

  return (<Layout>{res}</Layout>)
  }

  const emptyDirectSearch = () => {
    return (<Text>
      There is no direct physical contact made with this account from specified date
    </Text>)
  }

  const searchSubjectCard = () => {
    return (<Card style={{marginBottom: 30}} header={() =>  <CardHeader title='VID: c91de925-5e46-48ea-99fb-3c533087c5b8' description=''/>}>
      {!searchResults.length ? emptyDirectSearch () : 
        <Layout>
          {searchResults.length ? <Text appearance='hint' category='label'>{searchResults.length} results found in {profileData.scanCount}</Text> : undefined}
          {showResults()}
        </Layout>}
    </Card>)
  }

  const searchMessageHeartCard = () => {
    return (<Card style={{marginBottom: 30, backgroundColor: 'rgba(240,240,240,0.8)', width: '100%'}}>
      <Layout style={{flex: 1, flexDirection: 'row', backgroundColor: 'rgba(240,240,240,0.8)'}}>
        <Layout style={{width: '20%', backgroundColor: 'none'}}>
          <Image
            style={{width: 60, height: 60}}
            source={Heart}
          />
        </Layout>
        <Layout style={{width: '80%',backgroundColor: 'none'}}>
          <Text style={{flex: 1, flexWrap: 'wrap'}}>You might have meet this person along your exciting journey.Wish him/her a prosperous and a happy life!</Text>
        </Layout>
      </Layout>
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
      <Text category='label' appearance='hint'>From: Wed March 25 2020 {"\n"}To: Wed March 25 2020 </Text>
      <Toggle text='Show date filter' checked={false} size='small'/>
    </Layout>)
  }


  return(<Layout style={{ flex: 1, padding: 20}}>
      <ScrollView>
        <View>
          {dateToggleSelector ()}
          {searchMessageHeartCard ()}
          {searchSubjectCard ()}  
        </View>
      </ScrollView>
  </Layout>)
}