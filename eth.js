const { ethers } = require("ethers");

function createRandomPrivateKey() {
    const wallet = ethers.Wallet.createRandom();
    const privateKey = wallet.privateKey;
    const publicAddress = wallet.address;

    console.log("Private Key:", privateKey);
    console.log("Public Address:", publicAddress);
}
// createRandomPrivateKey();


async function invokeSmartContract() {
    // Connect to the Ethereum network (using Infura or any other provider)
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-amoy.polygon.technology");

    // Define your private key (NEVER hardcode it in production)
    const privateKey = "316aebafb298cd7ff29a947fd7b8b05ed9191820c79503acf95f948e4483b26a"; // Replace with your actual private key
    // 0x0E3710b3167eeE9D5E7E5430d99542A4e31636A7
    const signer = new ethers.Wallet(privateKey, provider);

    // Define the smart contract address and ABI
    const contractAddress = "0x2FB04845083596798A3993cd0079cf725360D0B9"; // Replace with your contract's address
    const abi = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "value",
				"type": "string"
			}
		],
		"name": "StringStored",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getString",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_value",
				"type": "string"
			}
		],
		"name": "storeString",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "storedStrings",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

    // Create a contract instance
    const contract = new ethers.Contract(contractAddress, abi, signer);

    // Call a smart contract function (e.g., transfer funds)
    const recipientAddress = "0x37D041281eBf650330336526297b343bC455F68C"; // Replace with the recipient address
    const amountToSend = ethers.utils.parseUnits("1", 18); // Sending 1 token (assuming it's an ERC-20 token with 18 decimals)
    // You can increase the gas price to ensure it's enough
    const gasPrice = await provider.getGasPrice();
    const adjustedGasPrice = gasPrice.mul(2); // Double the gas price (optional, depending on network)


    try {
        // Invoke the function (this sends a transaction)
        const tx = await contract.storeString("#HASH123#HASH", {
            gasPrice: adjustedGasPrice
        });

        // Wait for the transaction to be mined
        const receipt = await tx.wait();
        console.log("Transaction mined: ", receipt);
    } catch (err) {
        console.error("Error calling contract function:", err);
    }
}

invokeSmartContract();