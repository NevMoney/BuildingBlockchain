const crypto = require('crypto'),
  SHA256 = (message) =>
    crypto.createHash('sha256').update(message).digest('hex')
const EC = require('elliptic').ec,
  ec = new EC('secp256k1')
const ZERO_KEY_PAIR = ec.genKeyPair()
const ZERO_ADDRESSS = ZERO_KEY_PAIR.getPublic('hex')

class Transaction {
  constructor(from, to, amount, gas = 0) {
    this.from = from
    this.to = to
    this.amount = amount
    this.gas = gas
    this.tx_hash = SHA256(this.from + this.to + this.amount + this.gas)
  }

  sign(key) {
    if (key.getPublic('hex') === this.from) {
      this.signature = key
        .sign(SHA256(this.from + this.to + this.amount, this.gas), 'base64')
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
      (chain.getBalance(tx.from) >= tx.amount + tx.gas ||
        tx.from === ZERO_ADDRESSS) &&
      ec
        .keyFromPublic(tx.from, 'hex')
        .verify(SHA256(tx.from + tx.to + tx.amount + tx.gas), tx.signature)
    )
  }
}

module.exports = Transaction
