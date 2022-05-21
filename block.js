// import crypto package to ensure we can get the sha256 algorithm
const crypto = require('crypto'),
  SHA256 = (message) =>
    crypto.createHash('sha256').update(message).digest('hex')
const Transaction = require('./transaction')

// creating a block -- we'll be using classes
class Block {
  // you can leave data empty array but you can send a genesis data into it
  constructor(timestamp = '', data = ['genesis']) {
    this.timestamp = timestamp
    this.data = data
    this.hash = this.getHash()
    this.prevHash = ''
    this.nonce = 0
  }

  // now we need to calculate the hash
  getHash() {
    return SHA256(
      JSON.stringify(this.data) + this.timestamp + this.prevHash + this.nonce,
    )
  }

  // now we need to mine the block
  mine(difficulty) {
    // while (!this.hash.startsWith(Array(difficulty + 1).join('0'))) {
    const zeros = Array(difficulty + 1).join('0')
    while (this.hash.substring(0, difficulty) !== zeros) {
      this.nonce++
      this.hash = this.getHash()
    }
    console.log(`Block mined: ${this.hash}`)
  }

  // check if valid transactions
  hasValidTransactions(chain) {
    return this.data.every((transaction) =>
      transaction.isValid(transaction, chain),
    )
  }
}

module.exports = Block
