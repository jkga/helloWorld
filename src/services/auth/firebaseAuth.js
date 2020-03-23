
export default class {
  constructor (FirebaseInstace) {
    this.Firebase = FirebaseInstace
  }
  async isAuthenticated () {
    return await new Promise(async(resolve, reject) => {
      // Listen for authentication state to change.
      await this.Firebase.auth().onAuthStateChanged((user) => {
        if (user != null) {
          resolve({Firebase: this.Firebase, user})
        } else {
          reject ()
        }

      })
    })
  }

  login (token) {
    // firebase
    // Build Firebase credential with the Facebook access token.
    this.credential = this.Firebase.auth.FacebookAuthProvider.credential(token)

    return new Promise((resolve, reject) => {
      // Sign in with credential from the Facebook user.
      this.Firebase.auth().signInWithCredential(this.credential).then( res => {
        resolve(res)
      }).catch((error) => {
        // Handle Errors here.
        reject(error)
      })
    })
  }

  logout () {
    return new Promise((resolve, reject) => {
      this.Firebase.auth().signOut().then(function() {
        resolve (this.Firebase)
      }).catch(function(error) {
        reject(error)
      })
    })
  }
}