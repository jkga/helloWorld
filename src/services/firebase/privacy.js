import { v5 as uuidv5 } from 'uuid'

export default class {
  constructor (FirebaseInstace) {
    this.Firebase = FirebaseInstace
    this.initializeDB ()
  }

  initializeDB () {
    this.DB = this.Firebase.database()
  }

  __parseMail (mail) {
    return mail.split('.').join(',')
  }

  async setLocationVisibility (email, visibility) {
    email = this.__parseMail (email)
    return await new Promise(async(resolve, reject) => {
      return await this.DB.ref('users/' + email + '/privacy').update({
        location: visibility,
      }, function(error) {
        if (error) {
          reject (error)
        } else {
          resolve ()
        }
      })
    })
  }


  async setNameVisibility (email, visibility) {
    email = this.__parseMail (email)
    return await new Promise(async(resolve, reject) => {
      return await this.DB.ref('users/' + email + '/privacy').update({
        name: visibility,
      }, function(error) {
        if (error) {
          reject (error)
        } else {
          resolve ()
        }
      })
    })
  }



  async getScans (email, firebaseIndex = '', limit) {
    email = this.__parseMail (email)
  }

}