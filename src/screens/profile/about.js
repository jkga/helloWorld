import React, { useState, useEffect } from "react" 
import {
  StyleSheet,
  Image,
  ScrollView,
  View,
} from 'react-native'

import {
  Layout,
  Text,
  Avatar,
  Button,
  Icon,
  Card,
  Modal,
} from "@ui-kitten/components"

import QRCode from 'react-native-qrcode-svg'
import { decode } from '../../utils/qrGenerator'
import useGlobalState from '../../stateManager/index'
import { BarCodeScanner } from 'expo-barcode-scanner'
import env from '../../../env.json'

import Firebase from '../../db/firebase'
import FirebaseDBService from '../../services/firebase/account'

const FirebaseDB = new FirebaseDBService (Firebase)

const stats = (profileData) => {
  profileData.scans = profileData.scans || {}
  return (<Layout style={{ flex: 1, alignContent: 'center', alignItems: 'center'}}>
    <Layout style={styles.container}>
      <Layout style={styles.layout}>
        <Text category='label'>{profileData.scans.total || 0}</Text>
        <Text appearance='hint'>Scans</Text>
      </Layout>

      <Layout style={styles.layout}>
        <Text category='label'>{profileData.scans.acquiantances || 0}</Text>
        <Text appearance='hint'>Acquaintances</Text>
      </Layout>

      <Layout style={styles.layout}>
        <Text category='label'>{profileData.scans.places || 0}</Text>
        <Text appearance='hint'>Places</Text>
      </Layout>
    </Layout>
  </Layout>)
}

const profile = (profileData) => {
  return (
  <Layout style={{ flex: 1,  alignContent: 'center', alignItems: 'center', paddingTop: 50}}>
    <Text category='h4'>{profileData.name}</Text>
    <Text appearance='hint'>{profileData.location || 'Location not set'}</Text>
  </Layout>)
}

const QRCardCustomHeader = () => {
  return(<>
    <Text
      style={styles.headerText}
      category='h6'>
      QR Code
    </Text>
  </>)
}

const VIDCardCustomHeader = () => {
  return(<>
    <Text
      style={styles.headerText}
      category='h6'>
      VID (Virtual Identification ID)
    </Text>
  </>)
}

const QRCard = (profileData) => {
  return (
    <Card header={QRCardCustomHeader}>
      
      {profileData.VID ? 
        <Layout style={styles.flexCenter}><QRCode value={profileData.QRKey} size={150} backgroundColor="transparent"/>
          <Text appearance='hint' style={{marginTop: 10}}>[{profileData.VID}]</Text>
          <Text appearance='hint'>Virtual Identification ID</Text>
        </Layout> : 
        <Layout style={styles.flexCenter}><Text>NO VID</Text></Layout> 
      } 
      <Text>
        The Maldives, officially the Republic of Maldives, is a small country in South Asia,
        located in the Arabian Sea of the Indian Ocean.
        It lies southwest of Sri Lanka and India, about 1,000 kilometres (620 mi) from the Asian continent
      </Text>
    </Card>)
}

const VIDCard = () => {
  return (
    <Card header={VIDCardCustomHeader}>
      <Text>
        The Maldives, officially the Republic of Maldives, is a small country in South Asia,
        located in the Arabian Sea of the Indian Ocean.
        It lies southwest of Sri Lanka and India, about 1,000 kilometres (620 mi) from the Asian continent
      </Text>
    </Card>)
}




export default () => { 
  const [profileData, setProfileData] = useGlobalState('profileData')
  const [isScannerModalVisible, setScannerModalVisibility] = useState (false)
  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)
  const [scannedCache, setScannedCache] = useState({VID: {}})
  

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  const toggleModal = () => {
    setScannerModalVisibility (false)
  }

  const modalBtn = () => {
    return (<Modal
      backdropStyle={styles.backdrop}
      onBackdropPress={toggleModal}
      visible={isScannerModalVisible}>
        <Layout style={styles.modalContainer}>
          <View
            style={{
              flex: 1,
              width: 500,
              height: 500,
              alignSelf: 'stretch',
            }}>
            <BarCodeScanner
              onBarCodeScanned={handleBarCodeScanned}
              style={[StyleSheet.absoluteFill, styles.cameraContainer]}
            />
            {scanned && <View style={{alignContent: 'center', alignItems: 'center', alignContent:'center'}}><Button title={'Tap to Scan Again'} onPress={() => setScanned(false)}>SCANNED!</Button></View>}
          </View>
      </Layout>
    </Modal>)
  }

  const handleBarCodeScanned = ({ type, data }) => {
    // set scanned state
    setScanned(true)

    decode (data, env.key).then(res => {
      // do not scan if already in state
      console.log('readingCache')
      setTimeout(() => setScanned(false) ,1500)
      if(scannedCache.VID[res.VID]) return console.log('Found in cache')
      // continue scanning
      let scannedDate = parseInt((new Date().getTime() / 1000).toFixed(0))
      //console.log(res)
      let payload = {
        VID: res.VID,
        type: res.type,
        timestamp: scannedDate
      }
      if(res.name) payload.name = res.name 

      FirebaseDB.scan(profileData.email, payload)

      let joined = {...scannedCache.VID}
      joined[res.VID] = scannedDate
      console.log('writing cache')
      //console.log(joined)
      // add to recent scan
      setScannedCache ({VID: joined})
    }).catch (e => { console.log(e)
      alert('Invalid QR code')
    })
   // alert(`Bar code with type ${type} and data ${data} has been scanned!`)
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
  <View style={{flex: 1}}>
    <ScrollView>
      <Layout>
        {profile (profileData)}
        <Layout style={{ flex: 1, paddingTop: 30}}>
        {stats (profileData)}
        </Layout>
        <Layout style={styles.flexCenter}>
          <Button onPress = {() => setScannerModalVisibility (true)} icon = {() => <Icon name='tv-outline' width={20} height={20} fill='white'/>} status='danger'>SCAN DEVICE</Button>
          {isScannerModalVisible ? modalBtn () : <Text></Text>}
        </Layout>
      </Layout>
      <Layout style={{marginTop: 30}}>{QRCard(profileData)}</Layout>
      <Layout style={{marginTop: 30}}>{VIDCard()}</Layout>
    </ScrollView>
  </View>)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  layout: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  flexCenter: {
    flex: 1,  
    alignContent: 'center', 
    alignItems: 'center', 
    justifyContent: 'center',
    margin: 30,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
    marginRight: 15,
  },
  headerText: {
    marginHorizontal: 24,
    marginVertical: 16,
  },
  headerImage: {
    flex: 1,
    height: 192,
  },
  modalContainer: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
})

