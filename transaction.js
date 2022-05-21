const crypto = require('crypto'),
  SHA256 = (message) =>
    crypto.createHash('sha256').update(message).digest('hex')
const EC = require('elliptic').ec,
  ec = new EC('secp256k1')
const ZERO_KEY_PAIR = ec.genKeyPair()
const ZERO_ADDRESSS = ZERO_KEY_PAIR.getPublic('hex')

class Transaction {
  constructor(from, to, amount) {
    this.from = from
    this.to = to
    this.amount = amount
  }

  sign(key) {
    if (key.getPublic('hex') !== this.from) {
      throw new Error('You cannot sign transactions for other wallets!')
    } else {
      this.signature = key
        .sign(SHA256(this.from + this.to + this.amount), 'base64')
        .toDER('hex')
    }
  }

  isValid(tx, chain) {
    return (
      tx.from &&
      tx.to &&
      tx.amount &&
      // FROM VIDEO
      // (chain.getBalance(tx.from) >= tx.amount ||
      //   tx.from === ZERO_ADDRESSS && tx.amount === this.reward) &&
      // FROM BLOG
      (chain.getBalance(tx.from) >= tx.amount || tx.from === ZERO_ADDRESSS) &&
      ec
        .keyFromPublic(tx.from, 'hex')
        .verify(SHA256(tx.from + tx.to + tx.amount), tx.signature)
    )
  }
}

module.exports = Transaction
