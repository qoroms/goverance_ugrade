import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { initContracts } from "../../../utils/init";
import logo from "../../../assets/images/logo.svg"
import zora from "../../../assets/images/zora.png"
import metamask from "../../../assets/images/metamask.png"
import "../../../styles/header.css";
import { precision } from "../../../utils/precision";
import AlertModal from "../../Utils/AlertModal";
import history from "../../Utils/history";
import { Web3Context } from "../../../context/Web3Context";

const Header = () => {
    const [path, setPath] = useState("/");
    const [zoraBalance, setZoraBalance] = useState(null);
    const [showError, setShowError] = useState(false);
    const [isWrongNetwork, setIsWrongNetwork] = useState(false);
    const web3 = useContext(Web3Context);

    const handleConnectMetamask = () => {
        if (isMetamaskInstalled()) {
            initContracts(fetchBalance);
        } else {
            setShowError(true);
        }
    };

    const isMetamaskInstalled = () => {
        return (typeof window.ethereum !== 'undefined');
    }

    const fetchBalance = async () => {
        const balance = await window.zoraContract
            .methods
            .balanceOf(window.userAddress)
            .call();

        setZoraBalance(balance);

        const totalSupply = await window.zoraContract
            .methods
            .totalSupply()
            .call();

        const admin = await window.govContract
            .methods
            .guardian()
            .call();

        const currentVotes = await window.zoraContract.methods
            .getCurrentVotes(window.userAddress)
            .call();

        const userData = {
            address: window.userAddress,
            balance: balance,
            admin: admin,
            totalSupply: totalSupply,
            currentVotes: currentVotes,
        };
        web3.dispatch(userData);
    }

    const getNetworkName = (chainId) => {
        chainId = Number(chainId);

        if (chainId === 1) {
            return "Mainnet";
        } else if (chainId === 3) {
            return "Ropsten";
        } else if (chainId === 4) {
            return "Rinkeby";
        } else if (chainId === 42) {
            return "Kovan";
        } else {
            return "Unknown";
        }
    };

    useEffect(() => {
        history.listen(location => {
            setPath(location.pathname);
        });

        if (window.userAddress) {
            fetchBalance();
        }

        if (window.userAddress &&
            Number(window.chainId) !== Number(window.correctChainId)
        ) {
            setShowError(true);
            setIsWrongNetwork(true);
        }
    }, []);

    return (
        <header id="header" className="landing ">
            <div className="container-large">
                <div className="row align-middle">
                    <div className="col-sm-3 col-xs-10 logo">
                        <Link to="/" className="brand">
                        <img
                            alt="Zoracle Logo"
                            src={logo}
                            // height="30px"
                            style={{ marginLeft: "8px" }}
                        />
                        </Link>
                    </div>

                    <div className="mobile-hide col-xs-6 text-center links">
                        <Link className={path === "/leaderboard" ? "active" : null} to="/leaderboard">
                            Leaderboard
                        </Link>

                        <Link className={path === "/" ? "active" : null} to="/">
                            Dashboard
                        </Link>

                        <Link className={path === "/proposals" ? "active" : null} to="/proposals">
                            Proposals
                        </Link>
                        <Link className={path === "/airdrop" ? "active" : null} to="/airdrop">
                            Airdrop
                        </Link>
                    </div>

                    {window.userAddress ?
                        <div className="mobile-hide">
                            <div className="text-left zora-balance">
                                {zoraBalance ?
                                    precision.remove(zoraBalance).toFixed(4) :
                                    <div> – </div>
                                }
                                <img
                                    alt="Zoracle Logo"
                                    src={zora}
                                    width="30px"
                                    style={{ marginLeft: "8px" }}
                                />
                            </div>
                        </div>
                        : null
                    }

                    <div className={window.userAddress ?
                        "mobile-hide col-xs-1 text-right" :
                        "mobile-hide col-xs-2 text-right"
                    }>
                        <div
                            id="account"
                            className="dapp button hollow"
                            onClick={handleConnectMetamask}
                        >
                            {window.userAddress ?
                                <Link
                                    className="links"
                                    to={`/address/${window.userAddress.toLowerCase()}`}
                                >
                                    <div>
                                        {window.userAddress.substr(0, 5)}...
                                        {window.userAddress.substr(38, 42)}
                                    </div>
                                </Link>
                                :
                                <div>
                                    Connect
                                    <img
                                        alt="Metamask Icon"
                                        src={metamask}
                                        width="30px"
                                    />
                                </div>
                            }
                        </div>
                    </div>

                    <div className="mobile-only col-xs-2 hamburger ">
                        <span />
                        <span />
                        <span />
                    </div>
                </div>
            </div >

            <div className="mobile-header">
                <div className="links">
                    <ul>
                        <Link to="/leaderboard">
                            Leaderboard
                        </Link>

                        <Link className="active" to="/">
                            Dashboard
                        </Link>

                        <Link to="/proposals">
                            Proposals
                        </Link>
                        <Link to="/airdrop">
                            Airdrop
                        </Link>
                    </ul>
                </div>

                <a
                    className="dapp button hollow"
                    rel="external"
                    href="https://app.compound.finance/"
                >
                    App
                </a>
            </div>

            <AlertModal
                open={showError}
                toggle={() => setShowError(false)}
            >
                {isWrongNetwork ?
                    <div>
                        You have chosen incorrect network
                        <strong> {getNetworkName(window.chainId)} </strong>
                        in Metamask.
                        <br />
                        Please choose network as
                        <strong> {getNetworkName(window.correctChainId)}</strong> in
                        <img alt="Metamask Logo" width="50px" src={metamask} />
                    </div>
                    :
                    <div>
                        You don't have Metamask Wallet Installed.
                        <br />
                        Please install
                        <img alt="Metamask Logo" width="50px" src={metamask} />
                        first !!
                    </div>
                }
            </AlertModal>
        </header >
    );
};

export default Header;
