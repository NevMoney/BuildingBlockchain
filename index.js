const Blockchain = require('./blockchain')
const Block = require('./block')
const Transaction = require('./transaction')
const EC = require('elliptic').ec,
  ec = new EC('secp256k1')

const TChain = new Blockchain()

console.log(TChain.chain)
console.log('genesis data', TChain.chain[0].data)

const myAddress = TChain.chain[0].data[0].to
const myBalance = TChain.getBalance(myAddress)
console.log('my address', myAddress)
console.log('my balance', myBalance)
const friend1Wallet = ec.genKeyPair()
const friend1Address = friend1Wallet.getPublic('hex')
const friend2Wallet = ec.genKeyPair()
const friend2Address = friend2Wallet.getPublic('hex')

// create a new transaction
const tx1 = new Transaction(myAddress, friend1Address, 260, 1)
const tx2 = new Transaction(myAddress, friend2Address, 125, 1)

// add a new block
TChain.addBlock(new Block(Date.now().toString(), [tx1, tx2]))
console.log(
  'Balances',
  TChain.getBalance(myAddress),
  TChain.getBalance(friend1Address),
  TChain.getBalance(friend2Address),
)
console.log('second block tx', TChain.chain[1].data)
console.log('second block tx first txHash', TChain.chain[1].data[0].tx_hash)
console.log(
  'second block tx first signature',
  TChain.chain[1].data[0].signature,
)
console.log('blockchain', TChain.chain)
