const express = require('express');
const router = express.Router();
const blockchain = require('../services/blockchain');

// Mint a carbon credit NFT
router.post('/mint', async (req, res) => {
  try {
    const { farmerAddress, farmCoordinatesHash, carbonAmount, ndviMean, verificationProof, uri } = req.body;
    
    if (!farmerAddress || !farmCoordinatesHash || !carbonAmount || !ndviMean || !verificationProof || !uri) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await blockchain.mintCarbonCredit(
      farmerAddress,
      farmCoordinatesHash,
      carbonAmount,
      ndviMean,
      verificationProof,
      uri
    );

    res.status(201).json({
      message: "Carbon credit minted successfully",
      tokenId: result.tokenId,
      txHash: result.txHash
    });
  } catch (error) {
    console.error("Minting error:", error);
    res.status(500).json({ error: error.message || "Failed to mint carbon credit" });
  }
});

// List credit on marketplace
router.post('/list', async (req, res) => {
  try {
    const { tokenId, price, sellerPrivateKey } = req.body;

    if (tokenId === undefined || !price || !sellerPrivateKey) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await blockchain.listCreditOnMarketplace(tokenId, price, sellerPrivateKey);

    res.status(200).json({
      message: "Carbon credit listed successfully",
      tokenId: result.tokenId,
      price: result.price,
      txHash: result.txHash
    });
  } catch (error) {
    console.error("Listing error:", error);
    res.status(500).json({ error: error.message || "Failed to list carbon credit" });
  }
});

// Buy credit from marketplace
router.post('/buy', async (req, res) => {
  try {
    const { tokenId, price, buyerPrivateKey } = req.body;

    if (tokenId === undefined || !price || !buyerPrivateKey) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await blockchain.purchaseCredit(tokenId, price, buyerPrivateKey);

    res.status(200).json({
      message: "Carbon credit purchased successfully",
      tokenId: result.tokenId,
      txHash: result.txHash
    });
  } catch (error) {
    console.error("Purchase error:", error);
    res.status(500).json({ error: error.message || "Failed to purchase carbon credit" });
  }
});

// Retire carbon credit
router.post('/retire', async (req, res) => {
  try {
    const { tokenId, ownerPrivateKey } = req.body;

    if (tokenId === undefined || !ownerPrivateKey) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await blockchain.retireCredit(tokenId, ownerPrivateKey);

    res.status(200).json({
      message: "Carbon credit retired successfully",
      tokenId: result.tokenId,
      txHash: result.txHash
    });
  } catch (error) {
    console.error("Retirement error:", error);
    res.status(500).json({ error: error.message || "Failed to retire carbon credit" });
  }
});

// Get carbon credit data
router.get('/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;
    const data = await blockchain.getCreditData(tokenId);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching credit data:", error);
    res.status(500).json({ error: error.message || "Failed to fetch carbon credit data" });
  }
});

// Get listing data
router.get('/:tokenId/listing', async (req, res) => {
  try {
    const { tokenId } = req.params;
    const listing = await blockchain.getListing(tokenId);
    res.status(200).json(listing);
  } catch (error) {
    console.error("Error fetching listing data:", error);
    res.status(500).json({ error: error.message || "Failed to fetch listing data" });
  }
});

module.exports = router;
