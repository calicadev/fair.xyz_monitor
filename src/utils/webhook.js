const axios = require('axios');
const log = require('./log');
require('dotenv').config();

module.exports = async function webhook(
    contractAddress,
    name,
    supply,
    price,
    mintsPerWallet
) {
    try {
        const response = await axios.post(process.env.DISCORD_WEBHOOK, {
            content: '',
            embeds: [
                {
                    title: `Found new fair.xyz collection`,
                    url: `https://etherscan.io/address/${contractAddress}`,
                    footer: {
                        text: `Built by calica <3`,
                    },
                    timestamp: new Date(),
                    color: 15001324,
                    fields: [
                        {
                            name: 'Name',
                            value: name,
                            inline: true,
                        },
                        {
                            name: 'Supply',
                            value: supply,
                            inline: true,
                        },
                        {
                            name: 'Price',
                            value: price,
                            inline: true,
                        },
                        {
                            name: 'Mints Per Wallet',
                            value: mintsPerWallet,
                            inline: true,
                        },
                    ],
                },
            ],
        });

        log(`${response.status} Successfully sent webhook!`, 2);
    } catch (err) {
        log('Error sending webhook!', 1);
        console.log(err);
    }
};
