import * as SQLite from 'expo-sqlite'
import DB from './db'

export default class {
  __init () { 
    this.db = new DB ().__init() 
  }

  __createAccountTable () { 
    // create account table once
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql('CREATE table IF NOT EXISTS account (id integer not null primary key, name varchar (150), oid varchar(100), email varchar(100), created_at DATETIME DEFAULT (datetime(CURRENT_TIMESTAMP, "localtime"))')
      }, 
      (() => {
        resolve ()
      }), ((err) => {
        reject(err)
      }))
    })

  }

  __createAccountSessionTable() { 
    // create account table once
    return new Promise((resolve, reject) => {
      this.db.transaction(tx => {
        tx.executeSql('CREATE table IF NOT EXISTS account_session (id integer not null primary key, account_id integer, status integer, email varchar(100))')
      }, 
      (() => {
        resolve ()
      }), ((err) => {
        reject(err)
      }))
    })

  }


  async getAllAccounts () {
    this.__init ()
      return await new Promise(async (resolve, reject) => {
        // create table if exists and insert new record
        await this.__createAccountTable ().catch(()=>{}).finally(() => {
          this.db.transaction(tx => {
            tx.executeSql(`SELECT * FROM account`, [],
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

  async getAccountByID (id) {
    this.__init ()
      return await new Promise(async (resolve, reject) => {
        // create table if exists and insert new record
        await this.__createAccountTable ().catch(()=>{}).finally(() => {
          this.db.transaction(tx => {
            tx.executeSql(`SELECT * FROM account where id = ?`, [id],
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

  async getAccountByEmail (email) {
    this.__init ()
      return await new Promise(async (resolve, reject) => {
        // create table if exists and insert new record
        await this.__createAccountTable ().catch(()=>{}).finally(() => {
          this.db.transaction(tx => {
            tx.executeSql(`SELECT * FROM account where email= ? ORDER BY id DESC LIMIT 1`, [email],
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

  async insertAccount (param = []) {
      this.__init ()
      return await new Promise(async (resolve, reject) => {
        // create table if exists and insert new record
        await this.__createAccountTable ().catch(()=>{}).finally(() => {
          this.db.transaction(tx => {
            tx.executeSql(`INSERT into account (name, oid, email) values (?, ?, ?)`, param ,
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

  async updateAccount (param = []) {
    this.__init ()
      return await new Promise(async (resolve, reject) => {
        // create table if exists and insert new record
        await this.__createAccountTable ().catch(()=>{}).finally(() => {
          this.db.transaction(tx => {
            tx.executeSql('UPDATE account set name = ? WHERE email = ?', [param.name, param.email] ,
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

  async clearAccounts () {
    this.__init ()
      return await new Promise(async (resolve, reject) => {
        // create table if exists and insert new record
        await this.__createAccountTable ().catch(()=>{}).finally(() => {
          this.db.transaction(tx => {
            tx.executeSql('DELETE FROM account  WHERE 1', [] ,
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
