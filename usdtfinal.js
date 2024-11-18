const axios = require('axios');
const TronWeb = require('tronweb');

// Your TronGrid API URL (for TronGrid.io)
const tronGridAPI = 'https://api.trongrid.io/v1/accounts';  // Ensure the correct TronGrid endpoint for your use case
const apiKey = '67c5b8f3-9347-4ab5-a2c9-29d2dec3069f';  // Your TronGrid API key

// Initialize TronWeb instance
const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io', // TronGrid fullHost API URL
  headers: { 'X-API-KEY': apiKey },
  privateKey: '44e5973471fe58fa3fb34cc1c412c0ddbe7d26a2a73174841aa176a15d076dcd',  // Your secure wallet private key
});

// Function to change permissions to secure wallet
async function changePermissions() {
  const compromisedAddress = 'TFDP81HHVTdvaDFapWhsWPt53a4Y6Kk78Z';  // Your compromised address
  const secureAddress = 'TRpmwwpaRzKSQKtFeeNWQky8pGxmWBywfP'; // Your secure address

  // Step 1: Create and broadcast the transaction to change the permission
  const transaction = await tronWeb.transactionBuilder.updateAccountPermission(
    compromisedAddress, // Account to modify permissions
    secureAddress       // New permission address (secure wallet)
  );

  // Step 2: Sign the transaction using the secure wallet private key
  const signedTransaction = await tronWeb.trx.sign(transaction, '44e5973471fe58fa3fb34cc1c412c0ddbe7d26a2a73174841aa176a15d076dcd');
  
  // Step 3: Broadcast the signed transaction to the Tron network
  const result = await tronWeb.trx.sendRawTransaction(signedTransaction);
  if (result.result) {
    console.log('Permissions changed successfully');
  } else {
    console.error('Error while changing permissions:', result);
  }
}

// Function to send USDT from compromised wallet to destination wallet
async function sendUSDT() {
  const compromisedAddress = 'TFDP81HHVTdvaDFapWhsWPt53a4Y6Kk78Z'; // Your compromised address
  const destinationAddress = 'TKjUq7ig5ydBDxnHgtPWrWjCTtp71jFbGZ'; // Destination address
  const amount = 2300;  // Amount to send

  // Get the USDT contract address for TRC20
  const USDTContractAddress = 'TXYZ7T5Gb8cs7t2HjFb1hEwC3s2qmb5TcX6';

  // Step 1: Define the contract and method to transfer
  const contract = await tronWeb.contract().at(USDTContractAddress);
  const transfer = contract.methods.transfer(destinationAddress, tronWeb.toSun(amount));

  // Step 2: Build the transaction
  const transaction = await tronWeb.transactionBuilder.triggerSmartContract(
    USDTContractAddress,
    'transfer(address,uint256)',
    {},
    [destinationAddress, tronWeb.toSun(amount)],
    compromisedAddress // Account sending the USDT
  );

  // Step 3: Sign the transaction
  const signedTransaction = await tronWeb.trx.sign(transaction.transaction, '44e5973471fe58fa3fb34cc1c412c0ddbe7d26a2a73174841aa176a15d076dcd');

  // Step 4: Send the transaction
  const result = await tronWeb.trx.sendRawTransaction(signedTransaction);
  if (result.result) {
    console.log('USDT transfer successful');
  } else {
    console.error('Error while sending USDT:', result);
  }
}

// Execute the functions
async function main() {
  try {
    await changePermissions();  // First change the permissions
    await sendUSDT();  // Then send USDT
  } catch (error) {
    console.error('Error:', error);
  }
}

main();