import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { thegraph } from "../../../utils/thegraph";
import AlertModal from "../../Utils/AlertModal";
import { Web3Context } from "../../../context/Web3Context";
import "../../../styles/recentProposal.css";

const RecentProposals = () => {
    const [proposals, setProposals] = useState([]);

    const [errorModal, setErrorModal] = useState({
        msg: "",
        open: false
    });

    const userData = useContext(Web3Context);
    const userBalance = userData.state.balance;
    const totalSupply = userData.state.totalSupply;

    const fetchData = () => {
        thegraph.fetchProposals()
            .then((data) => {
                setProposals(data.slice(0, 3));
            })
            .catch((error) => {
                setErrorModal({
                    open: true,
                    msg: error.message,
                });
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="important-proposals-pane">
            <div className="governance-panel">
                <div className="governance-panel__header">
                    <h4>Recent Proposals</h4>
                    {userBalance && userBalance * 100 / totalSupply > 1 ?
                        <Link to="/create-proposal">Create Proposal</Link>
                        : null
                    }
                </div>
                <div className="proposals">
                    {proposals.length > 0 ?
                        (proposals.map((proposal, key) => (
                            proposal.status !== "CANCELLED" ?
                                <Link key={key} className="proposal" to={`/proposals/${proposal.id}`}>
                                    <div className="proposal__content">
                                        <div className="proposal__content__description">
                                            <div className="proposal__content__description__title">
                                                <span className="mr-3">{proposal.id}</span>
                                                <span className="mr-3">•</span>
                                                <span className="mr-3 proposal__content__description__details__tag--passed">
                                                    {proposal.status === "ACTIVE" ? "Active" : (
                                                        proposal.status === "QUEUED"
                                                    ) ? "In Queue" : "Created"}
                                                </span>
                                                {proposal.description.split("/#")[0]}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="proposal__current-state-view">
                                        <div className="proposal__current-state-view__state proposal__current-state-view__state--active">
                                            <p className="proposal__current-state-view__state__text">
                                                {proposal.status}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                                :
                                <Link key={key} className="proposal" to={`/proposals/${proposal.id}`}>
                                    <div className="proposal__content">
                                        <div className="proposal__content__description">
                                            <div className="proposal__content__description__title">
                                                <span className="mr-3">{proposal.id}</span>
                                                <span className="mr-3">•</span>
                                                <span className="mr-3 proposal__content__description__details__tag--not-passed">
                                                    Failed
                                            </span>{" "}
                                                {proposal.description.split("/#")[0]}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="proposal__current-state-view">
                                        <div className="proposal__current-state-view__state proposal__current-state-view__state--failed">
                                            <p className="proposal__current-state-view__state__text">
                                                {proposal.status}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                        ))) :
                        <div className="proposals">
                            <div className="no-proposal">
                                No Proposal
                            </div>
                        </div>
                    }
                </div>
                {proposals.length > 0 ?
                    <Link className="governance-panel__footer" to="/proposals">
                        View All Proposals
                    </Link>
                    : null
                }
            </div>

            <AlertModal
                open={errorModal.open}
                toggle={() => setErrorModal({
                    ...errorModal, open: false
                })}
            >
                {errorModal.msg}
            </AlertModal>
        </div >
    );
};

export default RecentProposals;
