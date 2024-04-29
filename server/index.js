const express = require('express');
const verifyProof = require('../utils/verifyProof');
const MerkleTree = require('../utils/MerkleTree');
const niceList = require('../utils/niceList');

const port = 1225;

const app = express();
app.use(express.json());

// TODO: hardcode a merkle root here representing the whole nice list
const merkleTree = new MerkleTree(niceList);
const merkleRoot = merkleTree.getRoot();

//home page
app.get('/',(req,res) => {
  res.send(merkleRoot);
});

// paste the hex string in here, without the 0x prefix
const MERKLE_ROOT = 'ddd59a2ffccddd60ff47993312821cd57cf30f7f14fb82937ebe2c4dc78375aa';


app.post('/gift', (req, res) => {
  // TODO: prove that a name is in the list 
  const name = req.body.name;
  const index = niceList.findIndex(n => n === name);
  const proof = merkleTree.getProof(index);
  const isInTheList = verifyProof(proof,name,MERKLE_ROOT);
  if(isInTheList) {
    res.send("You got a toy robot!");
  }
  else {
    res.send(`You are not on the list :( ${name}`);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
