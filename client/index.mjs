import Web3 from 'web3';
import configuration from '../build/contracts/Controlled.json';
const {ethers}=require('ethers');



const CONTRACT_ADDRESS =
  configuration.networks['1337'].address;
const CONTRACT_ABI = configuration.abi;

// const web3 = new Web3(
//   Web3.givenProvider || 'http://127.0.0.1:7545'
// );
// const contract = new web3.eth.Contract(
//   CONTRACT_ABI,
//   CONTRACT_ADDRESS
// );


// window.addEventListener('load', async () => {
//   const accounts = await web3.eth.requestAccounts(); // get accounts from metamask
//   account = accounts[0];
//   console.log(contract);
// })

// provider is used for reading only
const provider = new ethers.providers.Web3Provider(window.ethereum);
var contract;
var account;
window.addEventListener('load', async () => {
  if (provider) {
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    });

    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
    });
    await provider.send("eth_requestAccounts", []);

    // signer is used for writing
    const signer = provider.getSigner();
    account = await signer.getAddress();

    contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      CONTRACT_ABI,
      signer
    );
  console.log(account);
  localStorage.setItem('account',account);
 
}
    else {
      console.error("Metamask is not installed");
    }})

    

export { contract, account };






