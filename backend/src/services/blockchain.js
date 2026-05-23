const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
require('dotenv').config();

const providerUrl = process.env.RPC_URL || 'http://127.0.0.1:8545';
const provider = new ethers.JsonRpcProvider(providerUrl, { cacheTimeout: -1 });

// Addresses from deployment
const CARBON_CREDIT_ADDRESS = process.env.CARBON_CREDIT_ADDRESS;
const MARKETPLACE_ADDRESS = process.env.MARKETPLACE_ADDRESS;

// Load ABIs
let carbonCreditAbi, marketplaceAbi;
try {
  const ccArtifact = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../../../blockchain/artifacts/contracts/CarbonCredit.sol/CarbonCredit.json'),
      'utf8'
    )
  );
  carbonCreditAbi = ccArtifact.abi;

  const mpArtifact = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../../../blockchain/artifacts/contracts/CarbonMarketplace.sol/CarbonMarketplace.json'),
      'utf8'
    )
  );
  marketplaceAbi = mpArtifact.abi;
} catch (error) {
  console.warn("Artifacts not found yet. Make sure to compile smart contracts first!");
}

// Admin/Minter wallet
const getMinterWallet = () => {
  const privateKey = process.env.MINTER_PRIVATE_KEY;
  if (!privateKey) throw new Error("MINTER_PRIVATE_KEY not configured");
  return new ethers.Wallet(privateKey, provider);
};

// Generic wallet helper
const getWallet = (privateKey) => {
  return new ethers.Wallet(privateKey, provider);
};

// Core Functions
async function mintCarbonCredit(toAddress, farmCoordinatesHash, carbonAmount, ndviMean, verificationProof, uri) {
  const minter = getMinterWallet();
  const contract = new ethers.Contract(CARBON_CREDIT_ADDRESS, carbonCreditAbi, minter);

  // Convert carbonAmount (tCO2e) to a 18-decimal big integer representation
  const amountWei = ethers.parseEther(carbonAmount.toString());

  const nonce = await provider.getTransactionCount(minter.address, "pending");

  console.log(`Minting carbon credit to ${toAddress} with nonce ${nonce}...`);
  const tx = await contract.mint(
    toAddress,
    farmCoordinatesHash,
    amountWei,
    ndviMean,
    verificationProof,
    uri,
    { nonce }
  );
  const receipt = await tx.wait();
  
  // Extract tokenId from event
  // event CarbonCreditMinted(uint256 indexed tokenId, ...)
  const log = receipt.logs.find(x => x.fragment && x.fragment.name === 'CarbonCreditMinted');
  const tokenId = log ? log.args[0].toString() : null;

  return {
    txHash: tx.hash,
    tokenId
  };
}

async function listCreditOnMarketplace(tokenId, price, sellerPrivateKey) {
  const seller = getWallet(sellerPrivateKey);
  const creditContract = new ethers.Contract(CARBON_CREDIT_ADDRESS, carbonCreditAbi, seller);
  const mpContract = new ethers.Contract(MARKETPLACE_ADDRESS, marketplaceAbi, seller);

  const priceWei = ethers.parseEther(price.toString());

  // Get current nonce to prevent race conditions during back-to-back calls
  let nonce = await provider.getTransactionCount(seller.address, "pending");

  // Step 1: Approve marketplace to escrow the token
  console.log(`Approving marketplace to escrow token ID ${tokenId} with nonce ${nonce}...`);
  const approveTx = await creditContract.approve(MARKETPLACE_ADDRESS, tokenId, { nonce: nonce++ });
  await approveTx.wait();

  // Step 2: List on marketplace
  console.log(`Listing token ID ${tokenId} on marketplace for ${price} ETH with nonce ${nonce}...`);
  const listTx = await mpContract.listCredit(tokenId, priceWei, { nonce: nonce++ });
  await listTx.wait();

  return {
    txHash: listTx.hash,
    tokenId,
    price
  };
}

async function purchaseCredit(tokenId, value, buyerPrivateKey) {
  const buyer = getWallet(buyerPrivateKey);
  const mpContract = new ethers.Contract(MARKETPLACE_ADDRESS, marketplaceAbi, buyer);

  const paymentWei = ethers.parseEther(value.toString());

  const nonce = await provider.getTransactionCount(buyer.address, "pending");

  console.log(`Purchasing token ID ${tokenId} on marketplace with nonce ${nonce}...`);
  const tx = await mpContract.buyCredit(tokenId, { value: paymentWei, nonce });
  await tx.wait();

  return {
    txHash: tx.hash,
    tokenId
  };
}

async function retireCredit(tokenId, ownerPrivateKey) {
  const owner = getWallet(ownerPrivateKey);
  const contract = new ethers.Contract(CARBON_CREDIT_ADDRESS, carbonCreditAbi, owner);

  const nonce = await provider.getTransactionCount(owner.address, "pending");
  console.log(`Retiring carbon credit token ID ${tokenId} with nonce ${nonce}...`);
  const tx = await contract.retire(tokenId, { nonce });
  await tx.wait();
  return {
    txHash: tx.hash,
    tokenId
  };
}

async function getCreditData(tokenId) {
  const contract = new ethers.Contract(CARBON_CREDIT_ADDRESS, carbonCreditAbi, provider);
  const data = await contract.getCreditData(tokenId);
  
  return {
    tokenId: tokenId.toString(),
    farmCoordinatesHash: data.farmCoordinatesHash,
    carbonAmount: ethers.formatEther(data.carbonAmount),
    ndviMean: data.ndviMean.toString(),
    timestamp: new Date(Number(data.timestamp) * 1000).toISOString(),
    verificationProof: data.verificationProof,
    retired: data.retired,
    retiredBy: data.retiredBy
  };
}

async function getListing(tokenId) {
  const contract = new ethers.Contract(MARKETPLACE_ADDRESS, marketplaceAbi, provider);
  const listing = await contract.getListing(tokenId);
  
  return {
    tokenId: tokenId.toString(),
    seller: listing.seller,
    price: ethers.formatEther(listing.price),
    active: listing.active
  };
}

module.exports = {
  provider,
  mintCarbonCredit,
  listCreditOnMarketplace,
  purchaseCredit,
  retireCredit,
  getCreditData,
  getListing
};
