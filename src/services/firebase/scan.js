import { v5 as uuidv5 } from 'uuid'
export default class {
  constructor (FirebaseInstace) {
    this.Firebase = FirebaseInstace
    this.initializeDB ()
  }

  initializeDB () {
    this.DB = this.Firebase.database()
  }
  getDBInstance () {
    return this.DB
  }

  __parseMail (mail) {
    return mail.split('.').join(',')
  }

  async scan (email, data) {
    email = this.__parseMail (email)
    return await new Promise(async(resolve, reject) => {
      return await this.DB.ref('scans/' + email).push({
        VID: data.VID,
        name: data.name,
        type: data.type,
        createdAt: data.timestamp,
      }, function(error) {
        if (error) {
          reject (error)
        } else {
          resolve ()
        }
      })
    })
  }


  async scanPlaces (email, data) {
    email = this.__parseMail (email)
    return await new Promise(async(resolve, reject) => {
      return await this.DB.ref('scansPlaces/' + email).push({
        VID: data.VID,
        name: data.name,
        type: data.type,
        createdAt: data.timestamp,
      }, function(error) {
        if (error) {
          reject (error)
        } else {
          resolve ()
        }
      })
    })
  }

  async incrementScanCount (email) {
    email = this.__parseMail (email)
    return new Promise(async(resolve, reject) => {
      let ref = this.DB.ref('users/'+ email + '/scanCount')
      try {
        return resolve(await ref.transaction((count) => {
          let val = (count || 0) + 1
          //if(val > 2) return
          return val
        }))
      } catch (e) {
        reject (e)
      }
    })
  }

  async incrementScanPlacesCount (email) {
    email = this.__parseMail (email)
    return new Promise(async(resolve, reject) => {
      let ref = this.DB.ref('users/'+ email + '/scanCountPlaces')
      try {
        return resolve(await ref.transaction((count) => {
          let val = (count || 0) + 1
          //if(val > 2) return
          return val
        }))
      } catch (e) {
        reject (e)
      }
    })
  }

  async getScansStartAt (email, firebaseIndex, limit = 1) {
    email = this.__parseMail (email)
    return await new Promise(async(resolve, reject) => {
      let data = []
      await this.DB.ref('scans/' + email).orderByKey().endAt(firebaseIndex).limitToLast(limit).once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          let t = {}
          t[child.key] = child
          // prevent adding the current cursor
          if(child.key!=firebaseIndex) data.unshift(t)
        })

        //resolve({key: snapshot.key, val: data})
      })
      resolve(data)
    })
  }

  async getScansPlacesStartAt (email, firebaseIndex, limit = 1) {
    email = this.__parseMail (email)
    return await new Promise(async(resolve, reject) => {
      let data = []
      await this.DB.ref('scansPlaces/' + email).orderByKey().endAt(firebaseIndex).limitToLast(limit).once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          let t = {}
          t[child.key] = child
          // prevent adding the current cursor
          if(child.key!=firebaseIndex) data.unshift(t)
        })

        //resolve({key: snapshot.key, val: data})
      })
      resolve(data)
    })
  }

  async getScansStartAtByType (email, type, firebaseIndex, limit = 1) {
    email = this.__parseMail (email)
    return await new Promise(async(resolve, reject) => {
      let data = []
      await this.DB.ref('scans/' + email).orderByKey().endAt(firebaseIndex).limitToLast(limit).once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          let t = {}
          t[child.key] = child
          // prevent adding the current cursor
          if(child.key!=firebaseIndex && JSON.parse(JSON.stringify(child)).type === type) data.unshift(t)
        })

        //resolve({key: snapshot.key, val: data})
      })
      resolve(data)
    })
  }

  async getScansStartAtByTypeExcept (email, type, firebaseIndex, limit = 1) {
    email = this.__parseMail (email)
    return await new Promise(async(resolve, reject) => {
      let data = []
      await this.DB.ref('scans/' + email).orderByKey().endAt(firebaseIndex).limitToLast(limit).once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          let t = {}
          t[child.key] = child
          // prevent adding the current cursor
          if(child.key!=firebaseIndex && JSON.parse(JSON.stringify(child)).type != type) data.unshift(t)
        })

        //resolve({key: snapshot.key, val: data})
      })
      resolve(data)
    })
  }

  async __getScanSinglePage (email, limit) {
    email = this.__parseMail (email)
    let data = []
    return await new Promise(async(resolve, reject) => {
      await this.DB.ref('scans/' + email).limitToLast(limit).once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          let t = {}
          t[child.key] = child
          // prevent adding the current cursor
          data.unshift(t)
        })

        //resolve({key: snapshot.key, val: data})
      })
      resolve(data)
    })
  }

  async __getScanPlacesSinglePage (email, limit) {
    email = this.__parseMail (email)
    let data = []
    return await new Promise(async(resolve, reject) => {
      await this.DB.ref('scansPlaces/' + email).limitToLast(limit).once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          let t = {}
          t[child.key] = child
          // prevent adding the current cursor
          data.unshift(t)
        })

        //resolve({key: snapshot.key, val: data})
      })
      resolve(data)
    })
  }

  async __getScanSinglePageByType (email, type, limit) {
    email = this.__parseMail (email)
    let data = []
    return await new Promise(async(resolve, reject) => {
      await this.DB.ref('scans/' + email).limitToLast(limit).once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          let t = {}
          t[child.key] = child
          // prevent adding the current cursor
          if(type === JSON.parse(JSON.stringify(child)).type) data.unshift(t)
        })

        //resolve({key: snapshot.key, val: data})
      })
      resolve(data)
    })
  }

  async __getScanSinglePageByTypeExcept (email, type, limit) {
    email = this.__parseMail (email)
    let data = []
    return await new Promise(async(resolve, reject) => {
      await this.DB.ref('scans/' + email).limitToLast(limit).once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          let t = {}
          t[child.key] = child
          // prevent adding the current cursor
          if(type != JSON.parse(JSON.stringify(child)).type) data.unshift(t)
        })

        //resolve({key: snapshot.key, val: data})
      })
      resolve(data)
    })
  }

  async getScans (email, firebaseIndex = '', limit) {
    email = this.__parseMail (email)
    // if no index specified
    if(!firebaseIndex.length) return this.__getScanSinglePage (email,  limit)
    return this.getScansStartAt (email, firebaseIndex, limit)
  }

  async getScansPlaces (email, firebaseIndex = '', limit) {
    email = this.__parseMail (email)
    // if no index specified
    if(!firebaseIndex.length) return this.__getScanPlacesSinglePage (email,  limit)
    return this.getScansPlacesStartAt (email, firebaseIndex, limit)
  }


  async getScansByType (email, type, firebaseIndex = '', limit) {
    email = this.__parseMail (email)
    // if no index specified
    if(!firebaseIndex.length) return this.__getScanSinglePageByType (email, type, limit)
    return this.getScansStartAtByType (email, type, firebaseIndex, limit)
  }

  async getScansByTypeExcept (email, type, firebaseIndex = '', limit) {
    email = this.__parseMail (email)
    // if no index specified
    if(!firebaseIndex.length) return this.__getScanSinglePageByTypeExcept (email, type, limit)
    return this.getScansStartAtByTypeExcept (email, type, firebaseIndex, limit)
  }


  async getScanRecentListener (email, callback, limit = 1) {
    email = this.__parseMail (email)
    return this.getDBInstance().ref('scans/' + email).limitToLast(limit).on("value", function(snapshot) {
      callback (snapshot)
    })  
  }

  async searchScan(email, startAt, endAt) {
    email = this.__parseMail (email)
    let data = []
    return await new Promise(async(resolve, reject) => {
      await this.DB.ref('scans/' + email).orderByChild('createdAt').startAt(parseInt(startAt)).endAt(parseInt(endAt)).once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          let t = {}
          t[child.key] = child
          // prevent adding the current cursor
          data.unshift(t)
        })
      })
      resolve(data)
    })
  }

  async searchScanPlaces(email, startAt, endAt) {
    email = this.__parseMail (email)
    let data = []
    return await new Promise(async(resolve, reject) => {
      await this.DB.ref('scansPlaces/' + email).orderByChild('createdAt').startAt(parseInt(startAt)).endAt(parseInt(endAt)).once("value", function(snapshot) {
        snapshot.forEach(function(child) {
          let t = {}
          t[child.key] = child
          // prevent adding the current cursor
          data.unshift(t)
        })
      })
      resolve(data)
    })
  }

}