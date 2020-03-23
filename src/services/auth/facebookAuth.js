import * as Facebook from 'expo-facebook'
import env from '../../../facebook.json'

export default class {
  constructor () {
    this.Facebook = Facebook
  }

  __init () {
    //this.Facebook.setAutoLogAppEventsEnabledAsync (false)
    //this.Facebook.setAutoInitEnabledAsync(false)
    //this.Facebook.setAdvertiserIDCollectionEnabledAsync(false)
    return this.Facebook.initializeAsync(env.appId.toString())
  }

  login () {
    return new Promise(async (resolve, reject) => {
      try {
        await this.__init ()
        const {
          type,
          token,
          expires,
          permissions,
          declinedPermissions,
        } = await Facebook.logInWithReadPermissionsAsync({
          permissions: ['public_profile', 'email'],
          behavior: 'web',
        })
    
        if (type === 'success') {
          resolve({ type, token, expires, permissions, declinedPermissions })
  
          // Get the user's name using Facebook's Graph API
          fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${token}`)
          .then(response => response.json())
          .then(data => {
            if(data.error || !data.email) return reject ({status: 'failed', message: {}})
            resolve(data)
          })
          .catch(e => reject ({status: 'failed', message: e}))
          
        } else { console.log(message)
          reject ({status: 'canceled', message: {}})
        }
      } catch ({ message }) { 
        reject ({status: 'failed', message})
      }

    })
  }
}