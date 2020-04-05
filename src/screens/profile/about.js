import React, { useState, useEffect } from "react" 
import QRCode from 'react-native-qrcode-svg'
import { decode } from '../../utils/qrGenerator'
import useGlobalState from '../../stateManager/index'
import { BarCodeScanner } from 'expo-barcode-scanner'
import Firebase from '../../db/firebase'
import FirebaseDBService from '../../services/firebase/scan'
import env from '../../../env.json'
import User from './assets/img/user.png'
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

const DEFAULT_SCAN_TYPE = 'individual'
const FirebaseDB = new FirebaseDBService (Firebase)


const profile = (profileData) => {
  return (
  <Layout style={{ flex: 1, flexDirection:'row', alignContent: 'center', alignSelf: 'center', alignItems: 'center', paddingTop: 50}}>
    <Layout>
      <Avatar source={{uri: profileData.photo}} style={{ width: 50, height: 50, marginRight: 20 }}/>
    </Layout>
    <Layout>
      <Text category='h4'>{profileData.name}</Text>
      <Text appearance='hint'>{profileData.location || 'Location not set'}</Text>
    </Layout>
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
      <Text >
        This is your unique computer generated QR codes that identifies you among the rest of the users. {"\n"}
        This includes your <Text appearance='hint'>VID</Text> and other information such as <Text appearance='hint'>name</Text> , <Text appearance='hint'>location</Text>
        and <Text appearance='hint'>account type.</Text> <Text> To control tha data you share, click the settings icon above and select <Text appearance='hint'>Privacy</Text></Text>
      </Text>
    </Card>)
}


export default () => { 
  const [profileData, setProfileData] = useGlobalState('profileData')
  const [isScannerModalVisible, setScannerModalVisibility] = useState (false)
  const [isScannerScannedModalVisible, setScannerScannedModalVisibility] = useState (false)
  const [hasPermission, setHasPermission] = useState(null)
  const [scanned, setScanned] = useState(false)
  const [scannedCache, setScannedCache] = useState({VID: {}})
  const [scannedResult, setScannedResult] = useState({})
  const [test, setTest] = useGlobalState('test')
  
  useEffect(() => {
    console.log(test)
  })

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])


  const toggleModal = () => {
    setScannerModalVisibility (false)
  }

  const toggleModalScanned = () => {
    setScannerScannedModalVisibility (false)
  }

  const scanSuccess = () => { 
    FirebaseDB.incrementScanCount(profileData.email).then(async(res) => {
      console.log('showing scan results:',res)
      if(res.committed)  setProfileData((prevState) => {
        prevState.scanCount ++
        return prevState
      })
    }).catch(e => { console.log(e)
      // failed
    })
  }

  const scanSuccessPlaces = () => { 
    FirebaseDB.incrementScanPlacesCount(profileData.email).then(async(res) => {
      console.log('showing scan results:', res)
      if(res.committed)  setProfileData((prevState) => {
        prevState.scanCountPlaces ++
        return prevState
      })
    }).catch(e => { console.log(e)
      // failed
    })
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


  const modalScanned = () => { console.log(scanned)
    return (<Modal
      backdropStyle={styles.backdrop}
      onBackdropPress={toggleModalScanned}
      visible={isScannerScannedModalVisible}>
        <Layout style={{padding: 10, background: '#fff', elevation: 4}}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              width:400,
              minHeight: 100,
            }}>

              <Layout style={{width: '30%', alignItems: 'center'}}>
                <Avatar source={User} style={{width: 70, height: 70}}/>
                <Text category='label' appearance='hint'>{scannedResult.type}</Text>
              </Layout>

              <Layout style={{width: '70%'}}>
                <Text>{scannedResult.name}</Text>
                <Text category='label'>{scannedResult.VID}</Text>
                <Layout style={{flex: 1, flexDirection: 'row'}}>
                  <Icon name='checkmark-circle-2-outline' width={20} height={20} fill='green'/> 
                  <Text style={{color: 'green'}}> Scanned successfully!</Text>
                </Layout>
                
              </Layout>
              
          </View>
      </Layout>
    </Modal>)
  }

  const stats = () => { 
    return (<Layout style={{ flex: 1, alignContent: 'center', alignItems: 'center'}}>
      <Layout style={styles.container}>
        <Layout style={styles.layout}>
          <Text category='label'>{profileData.scanCount || 0}</Text>
          <Text appearance='hint'>Scans</Text>
        </Layout>
  
        <Layout style={styles.layout}>
          <Text category='label' style={{textTransform: 'capitalize'}}>{profileData.type ? profileData.type : 'Individual'}</Text>
          <Text appearance='hint'>Account Type</Text>
        </Layout>

        <Layout style={styles.layout}>
          <Text category='label'>{profileData.scanCountPlaces || 0}</Text>
          <Text appearance='hint'>Places</Text>
        </Layout>
      </Layout>
    </Layout>)
  }
  

  const handleBarCodeScanned = ({ type, data }) => {
    // set scanned state
    console.log('scanned')
    setScanned(true)

    decode (data, env.key).then(res => {
      // do not scan if already in state
      console.log('readingCache')
      setTimeout(() => setScanned(false) ,1500)
      //if(scannedCache.VID[res.VID]) return console.log('Found in cache')
      // continue scanning
      let scannedDate = parseInt((new Date().getTime() / 1000).toFixed(0))
      //console.log(res)
      let payload = {
        VID: res.VID,
        type: res.type,
        timestamp: scannedDate
      }
      if(res.name) payload.name = res.name 

      if(payload.type === DEFAULT_SCAN_TYPE) {
        FirebaseDB.scan(profileData.email, payload).then(res => {
          scanSuccess ()
        })
      } else {
        FirebaseDB.scanPlaces(profileData.email, payload).then(res => {
          scanSuccessPlaces ()
        })
      }

      let joined = {...scannedCache.VID}
      joined[res.VID] = scannedDate
      console.log('writing cache')
      //console.log(joined)
      // add to recent scan
      setScannedCache ({VID: joined})
      setScannedResult (payload)
      // show UI
      setScannerModalVisibility (false)
      setScannerScannedModalVisibility (true)
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
          {stats ()}
          </Layout>
          <Layout style={styles.flexCenter}>
            <Button onPress = {() => setScannerModalVisibility (true) } icon = {() => <Icon name='tv-outline' width={20} height={20} fill='white'/>} status='danger'>SCAN DEVICE</Button>
            {isScannerModalVisible ? modalBtn () : <Text></Text>}
            {modalScanned ()}
          </Layout>
        </Layout>
        <Layout style={{marginTop: 30}}>{QRCard(profileData)}</Layout>
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

