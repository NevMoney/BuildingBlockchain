const Blockchain = require('./blockchain')
const Block = require('./block')
const Transaction = require('./transaction')

const TChain = new Blockchain()

// create a new transaction
const tx1 = new Transaction('me', 'you', 100)
const tx2 = new Transaction('you', 'Bob', 50)
const tx3 = new Transaction('Bob', 'me', 25)

// add a new block
TChain.addBlock(new Block(Date.now().toString(), [tx1, tx2, tx3]))

console.log(TChain.chain)
console.log('data 1', TChain.chain[1].data)
