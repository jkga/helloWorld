import React, { useState } from 'react' 

import {
  Layout,
  Text,
  Button,
  Icon,
} from "@ui-kitten/components"

export default ({navigation}) => (
  <Layout style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text category='h3' appearance='hint'>Sign-in Required</Text>
    <Text style={{textAlign: 'center', padding: 20}} appearance='hint'>
      You need to login your account first before using all the application features.
    </Text>
    <Button icon = {() => <Icon name='arrow-ios-back-outline' width={20} height={20}/>} appearance='ghost' onPress={()=> navigation.navigate('Auth')}>Go to sign-in page</Button>
  </Layout>
)

