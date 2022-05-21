const { Block, Blockchain } = require('./tchain.js')

const TChain = new Blockchain()

// add a new block
TChain.addBlock(
  new Block(Date.now().toString(), { from: 'me', to: 'you', amount: 100 }),
)

console.log(TChain.chain)
