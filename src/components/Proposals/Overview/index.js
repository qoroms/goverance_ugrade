import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { thegraph } from "../../../utils/thegraph";
import AlertModal from "../../Utils/AlertModal";
import "../../../styles/proposalsOverview.css";

const ProposalsOverview = () => {
    const [data, setData] = useState({});

    const [errorModal, setErrorModal] = useState({
        msg: "",
        open: false
    });

    const fetchData = () => {
        thegraph.fetchAggregatedData()
            .then((data) => {
                setData(data);
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
        <section className="hero">
            <div className="container">
                <div className="page-header">
                    <div className="page-header__main-section">
                        <Link className="page-header__main-section__back" to="/">
                            <p className="page-header__main-section__back__text" style={{marginBottom: '0px !important'}}>
                            &#x2B05; Dashboard
                            </p>
                        </Link>

                        <div className="page-header__main-section__title">
                            <div className="proposal-overview">
                                <div className="proposal-overview__header">
                                    Governance Proposals
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="page-header__detail-section">
                        <div className="proposals-pie-view">
                            <div className="proposal-pie-wrapper">
                                <div className="proposals-pie-chart">
                                </div>
                                <div className="proposal-pie-description">
                                    <div className="headline">
                                        {data.proposals ? data.proposals :
                                            <span> — </span>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="proposal-pie-labels">
                                <label className="active">Active</label>
                                <label className="passed">Passed</label>
                                <label className="failed">Failed</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AlertModal
                open={errorModal.open}
                toggle={() => setErrorModal({
                    ...errorModal, open: false
                })}
            >
                {errorModal.msg}
            </AlertModal>
        </section>
    );
};

export default ProposalsOverview;
