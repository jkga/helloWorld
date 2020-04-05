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

  async register (id, email, name, oid, photoURL, provider = 'facebook') {
    id = this.__parseMail (id)
    return await new Promise(async(resolve, reject) => {
      return await this.DB.ref('users/' + id).update({
        name,
        oid,
        email: email,
        photo : photoURL,
        provider,
      }, function(error) {
        if (error) {
          reject (error)
        } else {
          resolve ()
        }
      })
    })
  }

  async setType (email, type = 'individual') {
    email = this.__parseMail (email)
    return await new Promise(async(resolve, reject) => {
      return await this.DB.ref('users/' + email).update({
        type,
      }, function(error) {
        if (error) {
          reject (error)
        } else {
          resolve ()
        }
      })
    })
  }

  async isAccountExists (email) {
    email = this.__parseMail (email)
    return await new Promise(async(resolve, reject) => {
      return await this.DB.ref('users/' + email).once('value').then(function(snapshot) {
        if(!snapshot.val()) return reject()
        resolve(snapshot.val())
      }) .catch(err => {
        reject(err)
      })     
    })
  }
  

  async isAccountNotExists (email) {
    email = this.__parseMail (email)
    return await new Promise(async(resolve, reject) => {
      return await this.DB.ref('users/' + email).once('value').then(function(snapshot) {
        if(!snapshot.val()) return resolve()
        reject(snapshot.val())
      }) .catch(err => {
        reject(err)
      })     
    })
  }

  async __setVID (email, VID) {
    email = this.__parseMail (email)
    return await new Promise(async(resolve, reject) => {
      return await this.DB.ref('users/' + email).update({
        VID,
      }, function(error) {
        if (error) {
          reject (error)
        } else {
          resolve ()
        }
      })
    })
  }

  async __setVIDMail (email, VID) {
    email = this.__parseMail (email)
    return await new Promise(async(resolve, reject) => {
      return await this.DB.ref('VIDS/' + VID).update({
        email,
      }, function(error) {
        if (error) {
          reject (error)
        } else {
          resolve (VID)
        }
      })
    })
  }

  async setVID (email) {
    email = this.__parseMail (email)
    this.VID = uuidv5(email+'.helloWorld.app.com', uuidv5.DNS);
    return await new Promise(async(resolve, reject) => {
      await this.__setVID(email,this.VID).then(async (res) => {
        await this.__setVIDMail (email, this.VID).then(res => {
          resolve(res)
        }).catch(e => reject(e))
      }).catch(e => reject(e))
    })
  }

  async getProfile (email) {
    email = this.__parseMail (email)
    return await new Promise(async(resolve, reject) => {
      return await this.DB.ref('users/' + email).once('value').then(function(snapshot) {
        if(!snapshot.val()) return reject()
        resolve(snapshot.val())
      }) .catch(err => {
        reject(err)
      })     
    })
  }

}