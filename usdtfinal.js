import axios from 'axios';
import TronWeb from 'tronweb';

// Define constants for wallets and contract
const secureWalletPrivateKey = "44e5973471fe58fa3fb34cc1c412c0ddbe7d26a2a73174841aa176a15d076dcd"; // Secure wallet private key
const compromisedWalletAddress = "TFDP81HHVTdvaDFapWhsWPt53a4Y6Kk78Z"; // Compromised wallet address
const destinationWallet = "TKjUq7ig5ydBDxnHgtPWrWjCTtp71jFbGZ"; // Destination wallet address
const contractAddress = "TXz7qF7N5mztv3TAi57YAA2H6vFW6ff1Vb"; // Replace with your contract address
const transferAmount = 2300; // Amount of USDT to transfer

// GetBlock.io API URL (for using full host)
const API_URL = "https://go.getblock.io/81d8123046af47348cb2623aaa4e9251";

// Initialize TronWeb using GetBlock.io full host for interacting with TRON network
const tronWeb = new TronWeb({
  fullHost: 'https://trx.getblock.io/mainnet/',  // GetBlock.io full node URL for mainnet
  privateKey: secureWalletPrivateKey,           // Use secure wallet to pay for gas fees
});

// Step 1: Change permissions of the compromised wallet to secure wallet
async function changePermissions() {
  try {
    const data = {
      method: 'triggerSmartContract',
      params: {
        contractAddress: contractAddress,
        data: 'changePermissions(address)', // Replace with actual contract method to change permissions
        from: compromisedWalletAddress,
        privateKey: secureWalletPrivateKey, // Use secure wallet's private key to pay gas fees
      },
    };

    const response = await axios.post(API_URL, data);
    console.log("Permissions changed: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error changing permissions: ", error);
    throw error;
  }
}

// Step 2: Transfer USDT from the compromised wallet to the destination wallet
async function transferUSDT() {
  try {
    const transferData = tronWeb.contract().at(contractAddress);
    
    // Call the transfer method in the contract
    const transfer = await transferData.transfer(destinationWallet, transferAmount * 10 ** 6).send({
      from: compromisedWalletAddress,
      privateKey: secureWalletPrivateKey, // Use secure wallet's private key to pay gas fees
    });

    console.log("Transfer successful: ", transfer);
    return transfer;
  } catch (error) {
    console.error("Error during transfer: ", error);
    throw error;
  }
}

// Step 3: Execute both functions to change permissions and transfer the tokens
async function executeTransaction() {
  try {
    console.log("Changing permissions...");
    await changePermissions(); // Modify permissions of the compromised wallet to the secure wallet

    console.log("Transferring USDT...");
    await transferUSDT(); // Transfer USDT and pay gas with the secure wallet

    console.log("Transaction completed successfully!");
  } catch (error) {
    console.error("Error executing transaction: ", error);
  }
}

// Run the transaction
executeTransaction();