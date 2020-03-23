
import JWT from 'expo-jwt'

const generateQRCodeKey = (name, VID, type = 'individual', key) => {
  return JWT.encode({ VID, name, type }, key, { algorithm: 'HS512' });
}

const decode = (token, key) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(JWT.decode(token, key))
    } catch(e) {
      reject (e)
    }
  })
  
}

export { generateQRCodeKey, decode }
