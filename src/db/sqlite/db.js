import * as SQLite from 'expo-sqlite'

export default class {
  __init () { 
    return SQLite.openDatabase('helloWorldDB', '1.0') 
  }
}