import React from "react";
import "../../../styles/footer.css";
import logo from "../../../assets/images/logo.svg";
import twitterIcon from "../../../assets/images/twitter.png";

import mediumIcon from "../../../assets/images/medium.svg";
const Footer = () => {
  return (
    <footer id="footer" className="landing">
      <div className="container-large">
        {/* <div className="row top">
                    <div className="col-sm-2 logo mobile-hide">
                        <a href="/" className="mark" />
                    </div>
                    <div className="col-xs-12 logo mobile-only">
                        <a href="/" className="brand" />
                    </div>
                    <div className="col-sm-8 col-xs-12 row links-holder">
                        <div className="col-sm-3 col-xs-6 links">
                            <p>Protocol</p>
                            <a href="/markets">Markets</a>
                            <a href="/prices">Prices</a>
                            <a href="/developers">Developers</a>
                            <a href="/docs">Docs</a>
                        </div>
                        <div className="col-sm-3 col-xs-6 links">
                            <p>Governance</p>
                            <a href="/governance">Overview</a>
                            <a href="/governance/zoracle">COMP</a>
                            <a href="/governance/leaderboard">Leaderboard</a>
                            <a rel="external" href="https://www.zoracle.xyz/">
                                Forums
                            </a>
                        </div>
                        <div className="col-sm-3 col-xs-6 links">
                            <p>Company</p>
                            <a href="/about">About</a>
                            <a href="/about#jobs">Careers</a>
                        </div>
                    </div>
                    <div className="mobile-hide col-xs-2 text-right">
                        <a
                            className="dapp button"
                            rel="external"
                            href="https://app.compound.finance/"
                        >
                            App
                        </a>
                    </div>
                </div> */}

        <div className="row" style={{ marginTop: "4%" }}>
          <div className="col-md-3">
            <div className="footer-widget">
              <h4 className="header">About</h4>
              <ul className="stack-link">
                <li>
                  <a href="https://defiprime.com/zoracles">DeFi Prime</a>
                </li>
                <li>
                  <a href="https://zoracles.com/whitepaper_v1.pdf">
                    Whitepaper
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-3">
            <div className="footer-widget">
              <h4 className="header">Social</h4>
              <ul className="stack-link">
                <li>
                  <a href="https://discord.com/invite/DSYQYAqEUX">Discord</a>
                </li>
                <li>
                  <a href="https://t.me/zoracles">Telegram</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-3" id="contact">
            <div className="footer-widget">
              <h4 className="header">Links</h4>
              <ul className="stack-link">
                <li>
                  <a href="https://github.com/zoracles">Github</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-3">
            <div className="footer-widget">
              <h4 className="header">FOLLOW US</h4>
              <ul className="social-link">
                <li style={{display: 'inline'}}>
                  <a href="https://twitter.com/zoralabs">
                    <img
                      alt="Twitter"
                      src={twitterIcon}
                      width="20px"
                    />
                  </a>
                </li>
                <li style={{display: 'inline'}}>
                  <a href="https://zoracles.medium.com/">
                    <img
                      alt="Twitter"
                      src={mediumIcon}
                      width="20px"
                      style={{
                        marginLeft: "20px",
                      }}
                    />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr />

        <div className="row copyright" style={{marginTop: '40px'}}>
          <div className="col-md-6">
            <div className="footer-widget">
              <p className="copyright info">
                <img
                  alt="Zoracle Logo"
                  src={logo}
                  height="40px"
                  style={{ marginLeft: "8px", marginRight: "20px" }}
                />
                {/* <span
                  style={{ fontSize: "20px", fontWeight: 500, color: "black" }}
                >
                  Zora Governance
                </span> */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
