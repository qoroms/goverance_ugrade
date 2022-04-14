import React, { useEffect, useState } from "react";
import { thegraph } from "../../utils/thegraph";
import AlertModal from "../Utils/AlertModal";
import { precision } from "../../utils/precision";
import { Link } from "react-router-dom";
import axios from "axios";

const Airdrop = () => {
  const [xanaAmount, setXanaamount] = useState(0);
  const [zoraHolders, setZoraholder] = useState(0);
  const [zoraClaimFlg, setZoraclaimflg] = useState(false);
  const [xanatoClaim, setXanatoclaim] = useState(0);
  const [claimButton, setClaimButton] = useState("Claim now");
  const [activeButton, setActive] = useState(true);
  const [claimed, setClaimed] = useState(false);
  const [startTime, setStarttime] = useState();
  const [period, setPeriod] = useState(0);
  const [validated, setValidated] = useState(true);
  const [timeLeft, setTimeLeft] = useState({});
  const [errorModal, setErrorModal] = useState({
    msg: "",
    open: false,
  });

  const fetchData = async () => {
    const XanaBalance = await window.airdropContract.methods
      .numberOfXana()
      .call();
    const Xanatoclaim = await window.airdropContract.methods
      .getXanaForUser(window.userAddress)
      .call();
    const period_contract = await window.airdropContract.methods
      .period()
      .call();
    const startAt_contract = await window.airdropContract.methods
      .startAt()
      .call();
    const validator = await window.airdropContract.methods
      .validator(window.userAddress)
      .call();
    setXanaamount(XanaBalance);
    setXanatoclaim(Xanatoclaim);
    setStarttime(startAt_contract);
    setPeriod(period_contract);
    setValidated(validator);
    axios
      .post("http://localhost:5000/getHolders", {
        userAddress: window.userAddress,
      })
      .then((res) => {
        console.log(res.data);
        setZoraholder(res.data.holders);
        setZoraclaimflg(res.data.flgClaim);
      });
  };
  const calculateTimeLeft = () => {
    let difference =
      +new Date((Number(startTime) + Number(period)) * 1000) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
      setActive(true);
    } else {
      setActive(false);
    }
    return timeLeft;
  };
  const getCurrentAirdropEvent = () => {
    window.airdropContract.events.setNextAirdropEvent((err, events) => {
      if (err) {
        console.log("Can't reset airdrop now.");
      } else {
        try {
          thegraph
            .fetchHolders()
            .then(async (data) => {
              console.log(data);
              axios
                .post("http://localhost:5000/setHolders", data)
                .then((res) => {
                  console.log(res);
                });
              setZoraholder(data.length);
            })
            .catch((error) => {
              setErrorModal({
                open: true,
                msg: error.message,
              });
            });
        } catch (err) {
          console.log(err);
        }
      }
    });
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      getCurrentAirdropEvent();
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });
  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval, index) => {
    if (!timeLeft[interval]) {
      return;
    }
    timerComponents.push(
      <span key={index} style={{ fontSize: "2.4rem", fontWeight: 500 }}>
        {timeLeft[interval] ? ("0" + timeLeft[interval]).slice(-2) : "00"}{" "}
        {interval}{" "}
      </span>
    );
  });
  const handleClaim = async () => {
    try {
      await window.airdropContract.methods
        .claim()
        .send()
        .on("transactionHash", async () => {
          console.log("claiming");
          setClaimButton("Claiming ...");
        })
        .on("receipt", async () => {
          // setClaimButton("Claimed");
          setClaimed(true);
        });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="page-header">
            <div className="page-header__main-section">
              <Link className="page-header__main-section__back" to="/">
                <p
                  className="page-header__main-section__back__text"
                  style={{ marginBottom: "0px !important" }}
                >
                  &#x2B05; Dashboard
                </p>
              </Link>
              <div className="page-header__main-section__title">
                <div>Airdrop</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="hero">
        <div className="container">
          <div id="dashboard-overview" className="row">
            <div className="col-sm-4 col-xs-12">
              <div className="panel dark">
                <div className="content">
                  <div>
                    <div className="headline">
                      {xanaAmount ? precision.remove(xanaAmount, 18) : "-"} XANA
                    </div>
                    <label
                      className={
                        xanaAmount
                          ? "panel__label"
                          : "panel__label panel__label--loading"
                      }
                    >
                      XANA To Airdrop
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-4 col-xs-6">
              <div className="panel dark">
                <div className="content">
                  <div
                    className={
                      zoraHolders ? "headline" : "headline headline--loading"
                    }
                  >
                    {zoraHolders ? Number(zoraHolders).toFixed(0) : "-"}
                  </div>
                  <label
                    className={
                      zoraHolders
                        ? "panel__label"
                        : "panel__label panel__label--loading"
                    }
                  >
                    Zora holders
                  </label>
                </div>
              </div>
            </div>
            <div className="col-sm-4 col-xs-6">
              <div className="panel dark">
                <div className="content">
                  <div className="content">
                    <div>
                      <div className="headline">
                        {xanatoClaim
                          ? activeButton
                            ? precision.remove(xanatoClaim, 18)
                            : "-"
                          : "-"}{" "}
                        XANA
                      </div>
                      <label
                        className={
                          xanatoClaim
                            ? "panel__label"
                            : "panel__label panel__label--loading"
                        }
                      >
                        XANA To Claim
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {window.userAddress ? (
            <div className="panel dark" style={{ marginTop: "2rem" }}>
              <div
                className="content"
                style={{
                  textAlign: "center",
                  marginTop: "2.2rem",
                  marginBottom: "2rem",
                }}
              >
                {timerComponents.length ? timerComponents : <span></span>}
                <div
                  className="description"
                  style={{
                    fontSize: 24,
                    marginTop: "3rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  We are going to airdrop some Xana token to Zora token holders.
                  <br />
                  If you have zora tokens, you can receive xana tokens before
                  the airdrop end time.
                </div>
                {zoraClaimFlg === false ? (
                  <span style={{ marginBottom: "30px", fontSize: 24 }}>
                    You aren't in whitelist for this chance.
                  </span>
                ) : validated ? (
                  <span style={{ marginBottom: "30px", fontSize: 24 }}>
                    You have already claimed.
                  </span>
                ) : activeButton ? (
                  claimed ? (
                    <span style={{ marginBottom: "30px", fontSize: 24 }}>
                      You claimed xana token.
                    </span>
                  ) : (
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
                      onClick={handleClaim}
                    >
                      {claimButton}
                    </button>
                  )
                ) : (
                  <span style={{ marginBottom: "30px", fontSize: 24 }}>
                    Airdrop finished.
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="panel dark" style={{ marginTop: "2rem" }}>
              <div
                className="content"
                style={{
                  textAlign: "center",
                  marginTop: "2.2rem",
                  marginBottom: "2rem",
                }}
              >
                <span style={{ marginBottom: "30px", fontSize: 24 }}>
                  Please connect metamask to claim.
                </span>
              </div>
            </div>
          )}
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
    </>
  );
};

export default Airdrop;
