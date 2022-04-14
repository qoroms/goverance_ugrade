import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import userLogo from "../../../assets/images/user.png";
import { Web3Context } from "../../../context/Web3Context";
import AlertModal from "../../Utils/AlertModal";
import { Proposals } from "../../../utils/constant";

const ProposalHeader = ({ proposal }) => {
  const [processing, setProcessing] = useState(false);
  const [queueing, setQueueing] = useState(false);
  const [proposalState, setProposalState] = useState("");
  const getLocalDate = (unixTimestamp) => {
    const data = new Date(1000 * unixTimestamp);
    const date = data.toDateString();
    return date;
  };
  const getProposalState = async () => {
    const proposalState = await window.govContract.methods
      .state(proposal.id)
      .call();
    setProposalState(Proposals(proposalState));
  };

  const [errorModal, setErrorModal] = useState({
    msg: "",
    open: false,
  });

  const handleCancel = async () => {
    window.govContract.methods
      .cancel(proposal.id)
      .send({ from: window.address })
      .on("transactionHash", () => {
        setProcessing(true);
      })
      .then(() => {
        setProcessing(false);
      })
      .catch((error) => {
        console.error();
        setProcessing(false);
        setErrorModal({
          open: true,
          msg: error.message,
        });
      });
  };

  const handleQueue = async () => {
    window.govContract.methods
      .queue(proposal.id)
      .send({ from: window.address })
      .on("transactionHash", () => {
        setQueueing(true);
      })
      .then(() => {
        setQueueing(false);
      })
      .catch((error) => {
        console.error();
        setQueueing(false);
        setErrorModal({
          open: true,
          msg: error.message,
        });
      });
  };

  const handleExecute = async () => {
    window.govContract.methods
      .execute(proposal.id)
      .send({ from: window.address })
      .on("transactionHash", () => {
        setQueueing(true);
      })
      .then(() => {
        setQueueing(false);
      })
      .catch((error) => {
        console.error();
        setQueueing(false);
        setErrorModal({
          open: true,
          msg: error.message,
        });
      });
  };

  useEffect(() => {
    if(proposal.id) getProposalState();
  }, [proposal.id])

  const userData = useContext(Web3Context);
  const userAddress = userData.state.address;
  const userBalance = userData.state.balance;
  const admin = userData.state.admin;

  return (
    <section className="hero">
      <div className="container">
        <div className="page-header">
          <div className="page-header__main-section">
            <Link className="page-header__main-section__back" to="/proposals">
              <p
                className="page-header__main-section__back__text"
                style={{ marginBottom: "0px !important" }}
              >
                &#x2B05; Proposals
              </p>
            </Link>

            <div className="page-header__main-section__title">
              <div className="proposal__content proposal__content--header">
                <div className="proposal__content__description">
                  <div
                    className={
                      proposal.id
                        ? "proposal__content__description__title proposal__content__description__title--header"
                        : "proposal__content__description__title proposal__content__description__title--header--loading"
                    }
                  >
                    {proposal.id ? (
                      <div>{String(proposal.description).split("/#")[0]}</div>
                    ) : null}
                  </div>

                  {proposal.id ? (
                    <div className="proposal__content__description__details proposal__content__description__details--large">
                      {proposal.status === "EXECUTED" ? (
                        <div className="proposal__content__description__details__tag proposal__content__description__details__tag--passed">
                          Passed
                        </div>
                      ) : proposal.status === "CANCELLED" ? (
                        <div className="proposal__content__description__details__tag proposal__content__description__details__tag--not-passed">
                          Failed
                        </div>
                      ) : (
                        <div className="proposal__content__description__details__tag proposal__content__description__details__tag--passed">
                          Active
                        </div>
                      )}
                      <div className="proposal__content__description__details__text proposal__content__description__details__text">
                        <span>{proposal.id}</span>
                        <span>•</span>
                        {proposal.status === "EXECUTED" ? (
                          <span>{getLocalDate(proposal.endTime + 172800)}</span>
                        ) : proposal.status === "ACTIVE" ||
                          proposal.status === "PENDING" ? (
                          <span>{getLocalDate(proposal.startTime)}</span>
                        ) : proposal.status === "QUEUED" ? (
                          <span>{getLocalDate(proposal.endTime)}</span>
                        ) : proposal.status === "CANCELLED" ? (
                          <span>{getLocalDate(proposal.endTime)}</span>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {admin === userAddress && admin && proposal.endTime && proposalState == "Succeeded" ? (
            <div className="p-1">
              <button className="cancel-button" onClick={handleQueue}>
                {/* {queueing? "Queueing": "Queue"} */}
                {queueing ? (
                  <div className="d-flex align-items-center">
                    Queueing
                    <span className="loading ml-2"></span>
                  </div>
                ) : (
                  <div>Queue</div>
                )}
              </button>
            </div>
          ) : admin === userAddress && admin && proposal.endTime && proposalState == "Queued" ?
            <div className="p-1">
                <button className="cancel-button" onClick={handleExecute}>
                    {queueing ? (
                    <div className="d-flex align-items-center">
                        Executing
                        <span className="loading ml-2"></span>
                    </div>
                    ) : (
                    <div>Execute</div>
                    )}
                </button>
            </div>
            : null
          }

          {admin === userAddress && admin && proposalState !== "Canceled" ? (
            <div className="p-1">
              <button className="cancel-button" onClick={handleCancel}>
                {processing ? (
                  <div className="d-flex align-items-center">
                    Canceling
                    <span className="loading ml-2"></span>
                  </div>
                ) : (
                  <div>Cancel</div>
                )}
              </button>
            </div>
          ) : null}

          <div className="page-header__detail-section">
            <Link
              className="proposer-pane"
              to={`/address/${proposal.proposer ? proposal.proposer.id : null}`}
            >
              <div className="gov-profile-image">
                <img
                  id="img-0x54a37d93e57c5da659f508069cf65a381b61e189"
                  alt="User Wallet"
                  className="gov-profile-image__raw-image"
                  src={userLogo}
                />
                <div className="gov-profile-image__proposer-icon" />
              </div>

              <div className="proposer-pane__details">
                <div className="proposer-pane__details__address">
                  {proposal.proposer ? (
                    <div>
                      {proposal.proposer.id.substr(0, 5)}...
                      {proposal.proposer.id.substr(38, 42)}
                    </div>
                  ) : null}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
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
    </section>
  );
};

export default ProposalHeader;
