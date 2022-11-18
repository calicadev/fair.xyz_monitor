const ethers = require('ethers');
const log = require('./utils/log');
const webhook = require('./utils/webhook');

const config = require('../config.json');
require('dotenv').config();

async function main() {
    try {
        console.log('Starting Monitor...');

        const websocketProvider = new ethers.providers.WebSocketProvider(
            process.env.ALCHEMY_WEBSOCKET
        );

        const contract = new ethers.Contract(
            config.clonerContract.address,
            config.clonerContract.ABI,
            websocketProvider
        );

        contract.on('NewClone', async (cloneAddress, creator) => {
            log('Found new fair.xyz NFT collection!', 2);

            console.log(
                `Creator address: ${creator}\nCollection address: ${cloneAddress}`
            );

            const collection = await getCollectionInfo(cloneAddress);

            log('Sending webhook...', 2);
            await webhook(
                cloneAddress,
                collection.name,
                collection.supply,
                collection.price,
                collection.mintsPerWallet
            );
        });
    } catch (err) {
        console.log(err);
    }
}

async function getCollectionInfo(contractAddress) {
    try {
        const provider = new ethers.providers.JsonRpcProvider(
            process.env.ALCHEMY_URL
        );

        const contract = new ethers.Contract(
            contractAddress,
            config.clonedContract.ABI,
            provider
        );

        const name = await contract.name();
        const supply = await contract.maxTokens();
        const price = await contract.price();
        const mintsPerWallet = await contract.maxMintsPerWallet();

        const collectionStats = {
            name,
            supply: supply.toString(),
            price: ethers.utils.formatEther(price),
            mintsPerWallet: mintsPerWallet.toString(),
        };

        return collectionStats;
    } catch (err) {
        log('Failed getting collection info', 1);
        console.log(err);
    }
}

main();
