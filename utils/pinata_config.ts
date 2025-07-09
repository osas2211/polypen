"server only"

import { PinataSDK } from "pinata"
import { PinataSDK as PinataWeb3 } from "pinata-web3"

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
})

export const pinataWeb3 = new PinataWeb3({
  pinataJwt: `${process.env.NEXT_PUBLIC_PINATA_JWT}`,
  // pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`,
})
