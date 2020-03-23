import * as SQLite from 'expo-sqlite'
import DB from './db'

export default class {
  __init () { 
    this.db = new DB ().__init() 
  }

  __createAccountSessionTable() { 
    // create account table once
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql('CREATE table IF NOT EXISTS account_session (id integer not null primary key, status integer, email varchar(100), created_at DATETIME DEFAULT (datetime(CURRENT_TIMESTAMP, "localtime"))')
      }, 
      (() => {
        resolve ()
      }), ((err) => {
        reject(err)
      }))
    })

  }

  async insertAccountSession (param = []) {
    this.__init ()
      return await new Promise(async (resolve, reject) => {
        // create table if exists and insert new record
        await this.__createAccountSessionTable ().catch(()=>{}).finally(() => {
          this.db.transaction(tx => {
            tx.executeSql('INSERT into account_session (email, status) values (?, ?)', [param.email, param.status] ,
            ((trans, res) => {
              resolve(res)
              }),
              (trans, error) => {
                reject(error)
              })
          })
        })
      }).catch(e => console.log(e))
  }

  async getAccountSessionByEmail (email) {
    this.__init ()
      return await new Promise(async (resolve, reject) => {
        // create table if exists and insert new record
        await this.__createAccountSessionTable ().catch(()=>{}).finally(() => {
          this.db.transaction(tx => {
            tx.executeSql('SELECT * from account_session where email = ? and status IS NULL ORDER BY id DESC LIMIT 1', [email] ,
            ((trans, res) => {
              resolve(res)
              }),
              (trans, error) => {
                reject(error)
              })
          })
        })
      }).catch(e => console.log(e))
  }


  async clearAccountSessions () {
    this.__init ()
      return await new Promise(async (resolve, reject) => {
        // create table if exists and insert new record
        await this.__createAccountTable ().catch(()=>{}).finally(() => {
          this.db.transaction(tx => {
            tx.executeSql('DELETE FROM account_session WHERE 1', [] ,
            ((trans, res) => {
              resolve(res)
              }),
              (trans, error) => {
                reject(error)
              })
          })
        })
      }).catch(e => console.log(e))
  }


}
