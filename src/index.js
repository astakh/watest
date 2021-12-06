import { Signer } from '@waves/signer';
import { ProviderWeb } from '@waves.exchange/provider-web';
import { nodeInteraction } from "@waves/waves-transactions";


const nodeUrl = 'https://nodes-testnet.wavesnodes.com';
const ballAddress = '3MuVEuhXaTvF3ELakZksUP77a4bT8gPJtm6';
document.getElementById("dappadress").innerHTML = ballAddress;

const signer = new Signer({NODE_URL: nodeUrl});
const provider = new ProviderWeb('https://testnet.waves.exchange/signer/')

signer.setProvider(provider);

document.querySelector(".js-invoke").addEventListener("click", async function () {
    try {
        let question = document.getElementById('questionInput').value;
        console.log('The question is '+ question);

        const user = await signer.login();
        document.querySelector(".address").innerHTML = `Your address is: ${user.address}`;

        // Call tellme function of wavesexplorer.com/tesnet/address/3MqDhjXwvCbFCpkA3o6BQkTWtD59267HhXA/script dApp
        // Generate an answer and write it to the dApp data storage

        try {
            await signer.invoke({
                dApp: ballAddress,
                call: {
                    function: "paint",
                    args:[{"type": "string", "value": question}]
                },
                payments: [{amount: 100000000, asset:null}]
            }).broadcast({confirmations: 1}).then(resp => console.log(resp));

        // Read an answer from dApp data storage

            let answer = await nodeInteraction.accountDataByKey('111',ballAddress,nodeUrl);
            document.querySelector(".answer").innerHTML = `Pixel 111 data: ${answer.value}`;
        } catch (e) {
            console.error('Question denied')
        }; 

    } catch (e) {
        console.error('Login rejected')
    };

});