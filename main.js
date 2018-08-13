const SHA256 = require('crypto-js/sha256');

class Block{
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateBlockHash();
    }

    calculateBlockHash(){ 
        //We cast to string, rather than the object SHA256 returns 
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {

    constructor() {
        this.chain = [this.createGenesisBlock()];
        //this.chain.push(this.createGenesisBlock());
    }

    createGenesisBlock() {
        //Previous hash doesn't matter, we typically set string to something that is verified to exist by the timestamp given.
        return new Block('0', '01/01/2017', 'Block string', '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(block) {
        block.previousHash = this.getLatestBlock().hash;
        block.hash = block.calculateBlockHash();

        this.chain.push(block);
    }

    isChainValid() {
        //We start at one because we're not checking the genesis block
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash != currentBlock.calculateBlockHash()) {
                return false;
            }

            if (currentBlock.previousHash != previousBlock.hash) {
                return false;
            }

            return true;
        }
    }
}

let nodeCoin = new Blockchain();
nodeCoin.addBlock(new Block(1, "01/01/2018", {amount: 4}));
nodeCoin.addBlock(new Block(2, "01/01/2018", { amount: 10 }));

console.log(JSON.stringify(nodeCoin, null, 4));