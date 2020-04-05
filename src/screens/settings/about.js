import React, { useState } from 'react'
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

export default ({navigation}) => {

  return(<Layout style={{flex: 1}}>
    <Layout style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignSelf: 'center', padding: 30}}>
      <Layout style={{ alignItems:'center'}}>
        <Text category='h5' appearance='hint'>HelloWorld Application</Text>
        <Text appearance='hint'>version 1.0</Text>
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
