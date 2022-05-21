// import crypto package to ensure we can get the sha256 algorithm
const crypto = require('crypto'),
  SHA256 = (message) =>
    crypto.createHash('sha256').update(message).digest('hex')

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
}

// create a blockchain class
class Blockchain {
  constructor() {
    this.chain = [new Block(Date.now().toString())]
    // difficulty is how many zeros we want in the hash
    this.difficulty = 1
    this.blocktime = 3000 // 3 seconds
  }

  // get the last block in the chain
  getLastBlock() {
    return this.chain[this.chain.length - 1]
  }

  // add a new block to the chain
  addBlock(newBlock) {
    newBlock.prevHash = this.getLastBlock().hash
    newBlock.hash = newBlock.getHash()
    // mine the block
    newBlock.mine(this.difficulty)

    this.chain.push(newBlock)

    // adjust the difficulty
    this.difficulty +=
      Date.now() - parseInt(this.getLastBlock().timestamp) < this.blocktime
        ? 1
        : -1
  }

  // check if the chain is valid
  isChainValid(blockchain) {
    for (let i = 1; i < blockchain.length; i++) {
      const currentBlock = blockchain[i]
      const prevBlock = blockchain[i - 1]
      if (
        currentBlock.hash !== currentBlock.getHash() ||
        currentBlock.prevHash !== prevBlock.hash
      ) {
        return false
      }
    }
    return true
  }
}

module.exports = { Block, Blockchain }

// // create a new blockchain
// const TChain = new Blockchain()
// TChain.addBlock(new Block(Date.now().toString(), ['first block']))
// TChain.addBlock(new Block(Date.now().toString(), ['second block']))
// TChain.addBlock(new Block(Date.now().toString(), ['third block']))
// TChain.addBlock(new Block(Date.now().toString(), ['fourth block']))
// TChain.addBlock(new Block(Date.now().toString(), ['fifth block']))
// TChain.addBlock(new Block(Date.now().toString(), ['sixth block']))
// TChain.addBlock(new Block(Date.now().toString(), ['seventh block']))
// console.log(TChain)
// console.log('T chain', TChain.chain)
// // TChain.chain[1].data = ['second block'] //this will make it invalid
// console.log('Is chain valid?', TChain.isChainValid(TChain.chain))
