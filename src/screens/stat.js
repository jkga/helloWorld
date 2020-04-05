import React, { useState, useEffect } from "react"

import {
  View,
  ScrollView,
  YellowBox,
} from 'react-native'

import {
  Layout,
  Text,
  TabView,
  Tab,
  Icon,
  Card,
  TopNavigation,
  Button,
  Spinner,
} from "@ui-kitten/components"

import { Flag } from 'react-native-svg-flagkit'
import UserItem from '../components/user-item' 
import Firebase from '../db/firebase'
import FirebaseDBService from '../services/firebase/scan'
import useGlobalState from '../stateManager/index'

const FirebaseDB = new FirebaseDBService (Firebase)


const data = new Array(3).fill({
  title: 'John Hey Doe',
  description: 'Manila, Caloocan, Philip[pines',
})

const dataLoc = new Array(3).fill({
  title: 'Manila, Caloocan, Philippines',
  description: '100 scanned person',
})



const TopNav = () => {
  return (<Layout>
    <TopNavigation
      title=''
      alignment='center'
    />
  </Layout>)
}


YellowBox.ignoreWarnings([
  'VirtualizedLists should never be nested', // TODO: Remove when fixed
])




export default () => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isLoadingPeople, setIsLoadingPeople] = useState(false)
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false)
  const [isLoadMoreIconVisiblePeople, setIsLoadMoreIconVisiblePeople] = useState(true)
  const [isLoadMoreIconVisiblePlaces, setIsLoadMoreIconVisiblePlaces] = useState(true)
  const [scannedData, setScannedData] = useState([])
  const [scannedDataPlaces, setScannedDataPlaces] = useState([])
  const [scannedCurrentIndex, setScannedCurrentIndex] = useState('')
  const [scannedCurrentPlaceIndex, setScannedCurrentPlaceIndex] = useState('')
  const [profileData, setProfileData] = useGlobalState('profileData')
  const [isListeningToRecentList, setisListeningToRecentList] = useState(false)
  const LIMIT = 10

  const getScanPlacesDataFromDB = (d) => {
    console.log('getting scanned data from the list')
    let t = d ? d : ''
    FirebaseDB.getScansPlaces(profileData.email, t ,LIMIT).then(res => {
      console.log('getting first page without filter')
      console.log(res)
      let t = !scannedDataPlaces.length ? res : [...scannedDataPlaces,...res]
      setScannedDataPlaces (t)
      setIsLoadingPlaces (false)
      if(!res.length) setIsLoadMoreIconVisiblePlaces (false)
    })
  }

  const getScanDataFromDB = (d='') => {
    console.log('getting scanned data from the list by type')
    let t = d ? d : ''
    FirebaseDB.getScans(profileData.email, t ,LIMIT).then(res => {
      console.log('getting first page by type')
      console.log(res)
      let t = !scannedDataPlaces.length ? res : [...scannedData,...res]
      setScannedData (t)
      setIsLoadingPeople(false)
      if(!res.length) setIsLoadMoreIconVisiblePeople (false)
    })
  }

  const loadMore = () => {
    setIsLoadingPeople (true)
    console.log('Loading more data')
    console.log(scannedData)
    if(!scannedData.length) return setIsLoadMoreIconVisiblePeople(false)

    let d = Object.keys(scannedData[scannedData.length-1])[0]
    console.log('setting cursor to', d)
    setScannedCurrentIndex (d)
    getScanDataFromDB (d)
    
  }

  const loadMoreExcept = (type) => {
    setIsLoadingPlaces (true)
    console.log('Loading more places')
    console.log(scannedDataPlaces)
    if(!scannedDataPlaces.length) return setIsLoadMoreIconVisiblePlaces(false)

    let d = Object.keys(scannedDataPlaces[scannedDataPlaces.length-1])[0]
    console.log('setting cursor to', d)
    setScannedCurrentPlaceIndex (d)
    getScanPlacesDataFromDB (d)
    
  }


  const emptyCard = () => {
    return (
      <Card style={{margin: 20}}>
        <Text>
          You do not have any previous scan. 
        </Text>
      </Card>)
  }

  useEffect(() => {
    // get scanned data
    getScanDataFromDB ()
    getScanPlacesDataFromDB ()
    
  }, [])

  if(!isListeningToRecentList) FirebaseDB.getScanRecentListener(profileData.email, (snapshot) => {
    console.log('reading scanned data')
    console.log(scannedData)
    console.log('---xx-retrieving insert-ttss--')
    setisListeningToRecentList (true)
    let t =[JSON.parse(JSON.stringify(snapshot))]
    /*setScannedData(prev => {
      prev = [...t,...prev]
      return prev
    })*/
  })

  return (
    <View style={{flex: 1}}>
      { TopNav () }
      <ScrollView>
        <TabView selectedIndex={selectedIndex} onSelect={setSelectedIndex}>
          <Tab title='People' name='People'>
            <Layout>
              <Layout>
                { !scannedData.length ? emptyCard () : undefined}
              </Layout>
              <Layout style={{flex: 1, paddingTop: 20}}>
                {UserItem(scannedData)}
              </Layout>
              <Layout style={{flex: 1, paddingTop: 20, alignItems: 'center'}}>
                { isLoadMoreIconVisiblePeople ? (isLoadingPeople ? <Spinner size='small'/> :<Button appearance='ghost' status='info' onPress={()=> loadMore ()}>Load More</Button>) : undefined}
              </Layout>
            </Layout>
          </Tab>

          <Tab title='Places' onSelect={()=> console.log('people selected')}>
            <Layout>
              <Layout>
                { !scannedDataPlaces.length ? emptyCard () : undefined}
              </Layout>
              <Layout style={{flex: 1, paddingTop: 20}}>
                {UserItem(scannedDataPlaces)}
              </Layout>
              <Layout style={{flex: 1, paddingTop: 20, alignItems: 'center'}}>
                { isLoadMoreIconVisiblePlaces ? (isLoadingPlaces ? <Spinner size='small'/> :<Button appearance='ghost' status='info' onPress={()=> loadMoreExcept ()}>Load More</Button>) : undefined}
              </Layout>
            </Layout>
          </Tab>
      </TabView>
    </ScrollView>
  </View>)
}

