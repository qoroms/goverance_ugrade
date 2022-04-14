import React, { useEffect, useState, useContext } from "react";
import "../../styles/addressInfo.css";
import AlertModal from "../Utils/AlertModal";
import ActionModal from "../Utils/ActionModal";
import { config } from "../../utils/config";
import { Web3Context } from "../../context/Web3Context";

const CreateProposal = () => {
  const [state, setState] = useState({
    timelockBalance: "",
  });

  const [details, setDetails] = useState({
    receiverAddress: "",
    releaseAmount: "",
    title: "",
    detail: "",
  });

  const [processing, setProcessing] = useState(false);
  const [metamaskError, showMetamaskError] = useState(false);
  const [errorModal, setErrorModal] = useState({
    msg: "",
    open: false,
  });
  const [actionModal, setActionModal] = useState({
    msg: "",
    open: false,
  });

  // Action part
  const [targetContract, setTargetContract] = useState({
    name:"",
    address:"",
    function:""
  });
  const userData = useContext(Web3Context);
  const userAddress = userData.state.address;
  const userBalance = userData.state.balance;

  const getState = async () => {
    const timelockBalance = await window.zoraContract.methods
      .balanceOf(config.timelockAddress)
      .call();

    setState({ timelockBalance });
  };
  const handleActionModal = () => {
    // alert("warning", "You need to add it for you.");
    setActionModal({
      open: true,
      msg: "action",
    });    
  }
  const handleVerifyAndSubmit = async () => {
    let message = null;
    console.log(userAddress);

    // if (!details.receiverAddress || !details.releaseAmount) {
    //   message = "Both fields are mandatory !!";
    // } else if (details.receiverAddress.length !== 42) {
    //   message = "receiverAddress must be an ethereum address !!";
    // } else if (details.title === '' && details.detail === '') {
    //   message = "Please type title or overview !!";
    // } else if (
    //   Number(state.timelockBalance) <=
    //   Number(precision.add(details.releaseAmount))
    // ) {
    //   message = "Release amount must be less than locked balance !!";
    // }
    console.log(state.timelockBalance);
    // console.log(precision.add(userBalance));

    if (!userAddress || !userBalance) {
      message = "Both fields are mandatory !!";
    } else if (userAddress.length !== 42) {
      message = "receiverAddress must be an ethereum address !!";
    } else if (details.title === '' && details.detail === '') {
      message = "Please type title or overview !!";
    } 
    if (!targetContract.name) {
      message = "Please select action type and function.";
    }
    // else if (
    //   Number(state.timelockBalance) <=
    //   Number(userBalance)
    // ) {
    //   message = "Release amount must be less than locked balance !!";
    //   console.log(userBalance);
    // }

    if (message) {
      setErrorModal({
        open: true,
        msg: message,
      });
    } else {
      createProposal();
    }
  };

  const createProposal = () => {
    const description = details.title + "/#" + details.detail;
    console.log(description);
    window.govContract.methods
      .propose(
        [targetContract.address],
        ["0"],
        [targetContract.function],
        [
          encodeParameters(
            ["address", "uint256"],
            [userAddress, userBalance]
          ),
        ],
        description
      )
      .send({ from: window.userAddress })
      .on("transactionHash", () => {
        setProcessing(true);
      })
      .then(() => {
        setProcessing(false);
        getState();
      })
      .catch((error) => {
        console.log(error);
        setProcessing(false);
        setErrorModal({
          open: true,
          msg: error.message,
        });
      });
  };

  const encodeParameters = (types, values) => {
    console.log(window.web3.eth.abi.encodeParameters(types, values));
    return window.web3.eth.abi.encodeParameters(types, values);
  };

  useEffect(() => {
    if (
      typeof window.ethereum === "undefined" ||
      !window.ethereum.isConnected() ||
      !window.ethereum.selectedAddress ||
      config.networkId !== Number(window.chainId)
    ) {
      showMetamaskError(true);
    } else {
      getState();
    }
  }, []);
  const handleSetAction = (target, targetAddress, selectedFunction) => {
    setTargetContract({
      name: target,
      address: targetAddress,
      function: selectedFunction
    })
  }
  return (
    <div id="Account-Profile" style={{ paddingBottom: "0px" }}>
      <section className="hero">
        <div className="container">
          <div className="page-header">
            <h3 style={{ marginLeft: "10px" }}>Create Proposal</h3>
          </div>
        </div>
      </section>

      <section className="account-details">
        <div className="container governance-panel">
          <div className="row ">
            <div className="col-sm-8 holdings-panel">
              <div className="governance-panel">
                <div className="governance-panel__header">
                  <h4>Proposal Description</h4>
                </div>
                <div className="holdings-panel__holdings">
                  <div className="holdings-panel__holdings__row">
                    <label className="holdings-panel__holdings__row__label">
                      Title
                    </label>
                    <input
                      className="vote-button mb-3"
                      placeholder="Proposal title"
                      type="text"
                      onChange={(e) =>
                        setDetails({
                          ...details,
                          title: e.target.value,
                        })
                      }
                      value={details.title}
                    />
                  </div>

                  <div className="holdings-panel__holdings__row">
                    <div className="holdings-panel__holdings__row__votes-label">
                      <label className="holdings-panel__holdings__row__label">
                        Overview
                      </label>
                    </div>

                    <textarea
                      className="vote-button mb-3"
                      placeholder="overview"
                      type="text"
                      rows={5}
                      onChange={(e) =>
                        setDetails({
                          ...details,
                          detail: e.target.value,
                        })
                      }
                      value={details.detail}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-4 transactions-panel">
              <div className="governance-panel">
                <div>
                  <div className="governance-panel__header votes-panel__header">
                    <div className="votes-panel__header__title-bar">
                      <h4 style={{ color: "#00d395" }}>Actions</h4>
                    </div>
                    <div className="votes-panel__header__vote-bar">
                      <div
                        className="votes-panel__header__vote-bar__fill"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>

                  {!metamaskError ? (
                    <div className="p-1">
                      {targetContract.name?
                      <div className="proposal">
                        <div style={{fontSize: 18}}>{targetContract.name} / {targetContract.function}</div>
                      </div>:
                      <button
                        style={{
                          width: "80%",
                          marginLeft: "10%",
                          marginBottom: "10px",
                          textAlign: "center",
                          color: "white",
                        }}
                        className="submit-button"
                        onClick={handleActionModal}
                      >
                        Add Actions{" "}
                        <span style={{ float: "right" }}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="22"
                            height="22"
                            fill="currentColor"
                            className="bi bi-plus-circle"
                            viewBox="0 0 16 16"
                          >
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                          </svg>
                        </span>
                      </button>}
                    </div>
                  ) : (
                    <div style={{ marginTop: "18%", paddingBottom: "18%" }}>
                      <p
                        style={{
                          textAlign: "center",
                          fontSize: "large",
                          color: "orange",
                        }}
                      >
                        You have not connected to metamask or You don't have
                        Metamask.
                        <br />
                        Please connect first !!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <button
              style={{
                width: "20%",
                marginLeft: "auto",
                marginRight: "auto",
                marginBottom: "30px",
                textAlign: "center",
                color: "white",
              }}
              className="submit-button"
              onClick={handleVerifyAndSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </section>

      <AlertModal
        open={errorModal.open}
        toggle={() =>
          setErrorModal({
            ...errorModal,
            open: false,
          })
        }
      >
        {errorModal.msg}
      </AlertModal>

      <ActionModal
        open={actionModal.open}
        toggle={() =>
          setActionModal({
            ...actionModal,
            open: false,
          })
        }
        handleSetAction = {handleSetAction}
      >
        {actionModal.msg}
      </ActionModal>
    </div>
  );
};

export default CreateProposal;
