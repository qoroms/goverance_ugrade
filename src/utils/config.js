import * as tokenAbi from './abis/tokenAbi.json';
import * as govAbi from './abis/govAbi.json';
import * as vestingAbi from './abis/vestingAbi.json';
import * as timelockAbi from './abis/timelockAbi.json';
import * as xanaAbi from './abis/xanaAbi.json';
import * as airdropAbi from './abis/airdropAbi.json';
export const config = {
    networkId: 42,
    zoraAbi: tokenAbi.default,
    zoraAddress: "0xa2B2A54ad0cD9286eD0D78CF949ED5273983e9F0",
    govAbi: govAbi.default,
    govAddress: "0xb14EbAd2F43EE65262071ae6d992fDA70A3decEf",
    vestingAbi: vestingAbi.default,
    vestingAddress: "0x10B62117932aC9B6D012269f071574922e464B83",
    timelockAbi: timelockAbi.default,
    timelockAddress: "0x183555C2cCD6c7dE867e3CB06d398fd932eAb17B",
    xanaAbi: xanaAbi.default,
    xanaAddress: "0x69599240b82D45Abe83efBB2693A6B6955b92F47",
    airdropAbi: airdropAbi.default,
    airdropAddress: "0x5CC52Db224cf4f5ca4627e05AF2Fd0283e772c62",
    etherscanLink: "https://kovan.etherscan.io",
};
