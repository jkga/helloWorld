import * as firebase from 'firebase';
import env from '../../firebase.json'

// Initialize Firebase
const firebaseConfig = {
  apiKey: env.apiKey,
  authDomain: env.authDomain,
  databaseURL: env.databaseURL,
}

firebase.initializeApp(firebaseConfig);

export default firebase