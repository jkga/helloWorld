import React, { useState } from "react"

import {
  ScrollView,
} from 'react-native'

import {
  Layout,
  Text,
  TabView,
  Tab,
  Icon,
  Input,
} from "@ui-kitten/components"


import UserItem from '../components/user-item' 
import LocationItem from '../components/location-item' 


const data = new Array(8).fill({
  title: 'John Hey Doe',
  description: 'Manila, Caloocan, Philip[pines',
})

const dataLoc = new Array(8).fill({
  title: 'Manila, Caloocan, Philippines',
  description: '100 scanned person',
})



export default () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <Layout>
      <TabView
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}>
        <Tab title='Map'>
          <Layout style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text category='h1'>Map</Text>
          </Layout>
          {/*<Layout style={{flex: 2}}>{map}</Layout>*/}
        </Tab>


        <Tab title='Locations'>
          <Layout>
              <ScrollView>
                <Layout style={{flex: 1}}>
                  {LocationItem (dataLoc)}
                </Layout>
              </ScrollView>
          </Layout>
        </Tab>

        <Tab icon={() => <Icon name='list-outline' width={20} height={20}/>}>
          <Layout>
              <ScrollView>
                <Layout style={{flex: 1}}>
                  {UserItem (data)}
                </Layout>
              </ScrollView>
          </Layout>
        </Tab>
      </TabView>
    </Layout>)
}

