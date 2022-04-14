import Web3 from 'web3';
import { config } from './config';

// Initialize contract & set global variables
export async function initContracts(callback) {
    window.correctChainId = config.networkId;
    window.web3 = new Web3(window.ethereum);

    await window.ethereum
        .request({ method: 'eth_requestAccounts' })

    window.userAddress = (
        await window.web3.eth.getAccounts()
    )[0];

    window.zoraContract = new window.web3.eth.Contract(
        config.zoraAbi,
        config.zoraAddress,
        { from: window.userAddress }
    );

    window.govContract = new window.web3.eth.Contract(
        config.govAbi,
        config.govAddress,
        { from: window.userAddress }
    );

    window.vestingContract = new window.web3.eth.Contract(
        config.vestingAbi,
        config.vestingAddress,
        { from: window.userAddress }
    );

    window.timelockContract = new window.web3.eth.Contract(
        config.timelockAbi,
        config.timelockAddress,
        { from: window.userAddress }
    );
    window.xanaContract = new window.web3.eth.Contract(
        config.xanaAbi,
        config.xanaAddress,
        { from: window.userAddress }
    );
    window.airdropContract = new window.web3.eth.Contract(
        config.airdropAbi,
        config.airdropAddress,
        { from: window.userAddress }
    );

    window.ethInitialized = true;
    window.chainId = window.ethereum.chainId;
    window.ethereum.autoRefreshOnNetworkChange = false;

    window.ethereum.on('accountsChanged', () => {
        window.location.reload();
    });

    window.ethereum.on('chainChanged', () => {
        window.location.reload();
    });

    if (callback) {
        callback();
    }
}

export async function initConnected() {
    const accounts = await window.ethereum
        .request({ method: 'eth_accounts' });

    if (
        typeof window.ethereum !== 'undefined'
        && accounts > 0
    ) {
        await initContracts();
    }
}
