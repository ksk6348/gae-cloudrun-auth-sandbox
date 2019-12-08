
import request from 'request-promise';
import decode from 'jwt-decode';
import NodeCache from 'node-cache';

import { REQUEST_URL } from './config';

const nodeCache = new NodeCache()

export const testRequest = async (req: any, res: any) => {
  console.log('send request')
  const url = 'https://qiita.com/toshihirock/items/b79b058937b873ec1925';

  const token = await getToken()

  const resSample = await request({
    method: "POST",
    url: REQUEST_URL,
    headers: {
      "content-type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ url })
  })

  res.send(resSample)
}

const getToken = async () => {
  let token: any = nodeCache.get('token')

  if (token) {
    console.log('token is valid')
    return token
  }

  console.log('token is expired')

  const metadataServerTokenURL = 'http://metadata/computeMetadata/v1/instance/service-accounts/default/identity?audience='
  token = await request({
    method: "POST",
    uri: metadataServerTokenURL + REQUEST_URL,
    headers: {
      'Metadata-Flavor': 'Google'
    }
  })

  const jwtParams: any = decode(token)
  const exp = jwtParams.exp
  const lifetime = exp - (Date.now() / 1000)
  console.log(lifetime)
  nodeCache.set('token', token, 60)
  return token
}
