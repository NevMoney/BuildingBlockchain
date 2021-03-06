const crypto = require('crypto'),
  SHA256 = (message) =>
    crypto.createHash('sha256').update(message).digest('hex')
const Block = require('./block')
const Transaction = require('./transaction')
const EC = require('elliptic').ec,
  ec = new EC('secp256k1')
const ZERO_KEY_PAIR = ec.genKeyPair()
const ZERO_ADDRESSS = ZERO_KEY_PAIR.getPublic('hex')
const holderKeyPair = ec.genKeyPair()
const holderAddress = holderKeyPair.getPublic('hex')

// create a blockchain class
class Blockchain {
  constructor() {
    const initialCoinRelease = new Transaction(
      ZERO_ADDRESSS,
      holderAddress,
      1000000,
    )
    this.chain = [new Block(Date.now().toString(), [initialCoinRelease])]
    this.difficulty = 1
    this.blocktime = 5000 // 5 seconds
    this.transactions = []
    this.reward = 100

    console.log('public addr', holderAddress)
    console.log('pvt key', holderKeyPair.getPrivate('hex'))
  }

  // get the last block in the chain
  getLastBlock() {
    return this.chain[this.chain.length - 1]
  }

  // get the balance of a wallet
  getBalance(address) {
    let balance = 0
    this.chain.forEach((block) => {
      block.data.forEach((transaction) => {
        if (transaction.from == address) {
          balance -= transaction.amount + transaction.gas
        }
        if (transaction.to == address) {
          balance += transaction.amount
        }
      })
    })
    return balance
  }

  // add a new block to the chain
  addBlock(newBlock) {
    newBlock.prevHash = this.getLastBlock().hash
    newBlock.hash = newBlock.getHash()
    newBlock.mine(this.difficulty)

    this.chain.push(newBlock)

    // adjust the difficulty
    this.difficulty +=
      Date.now() - parseInt(this.getLastBlock().timestamp) < this.blocktime
        ? 1
        : -1
  }

  addTransaction(transaction) {
    if (transaction.isValid(transaction, this)) {
      this.transactions.push(transaction)
    }
    console.log('Tx Hash @ addTx', this.transaction.hash)
  }

  mineTransactions(rewardAddress) {
    let gas

    this.transactions.forEach((transaction) => {
      gas += transaction.gas
    })

    const rewardTransaction = new Transaction(
      ZERO_ADDRESSS,
      rewardAddress,
      this.reward + gas,
    )
    rewardTransaction.sign(ZERO_KEY_PAIR)

    if (this.transactions.length > 0) {
      this.addBlock(
        new Block(Date.now().toString(), [
          rewardTransaction,
          ...this.transactions,
        ]),
      )
    }

    // reset the transactions
    this.transactions = []
  }

  // check if the chain is valid
  isChainValid(blockchain) {
    for (let i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i]
      const prevBlock = blockchain[i - 1]
      if (
        currentBlock.hash !== currentBlock.getHash() ||
        currentBlock.prevHash !== prevBlock.hash ||
        !currentBlock.hasValidTransactions(blockchain)
      ) {
        return false
      }
    }
    return true
  }
}

module.exports = Blockchain
