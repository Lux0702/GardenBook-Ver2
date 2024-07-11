import React from "react";
import "../assets/css/footer.css";
import logo from "../assets/images/logo.png";
import facebook from "../assets/images/facebook.png";
import linkedin from "../assets/images/linkedin.png";
import twitter from "../assets/images/twitter.png";
import youtube from "../assets/images/youtube.png";
import 'bootstrap/dist/css/bootstrap.min.css';
const Footer = () => {
  return (
      <footer  className="footer-container" >
        <div className="footer-column col 3">
          <h3 className="column-title">
          <img src={logo} alt='Logo'></img>
          <h6>
                Chào mừng bạn đến với Garden Book nơi những tri thức đầy màu sắc
            </h6>
          </h3>
          <div className="social">
                <ul className="d-flex flex-wrap list-unstyled gap-2">
                  <li className="icon-li">
                    <a href=" " >
                      <img src={facebook} alt='facebook'/>
                      </a>
                  </li>
                  <li className="icon-li">
                    <a href=" " >
                      <img src={linkedin} alt='LinkedIn' />
                    </a>
                  </li>
                  <li className="icon-li">
                    <a href=" " >
                      <img src={twitter} alt='Twitter' />
                    </a>
                  </li>
                  <li className="icon-li">
                    <a href=" " >
                      <img src={youtube} alt='Youtube' />
                    </a>
                  </li>
                </ul>
              </div>
              <p>&copy; {new Date().getFullYear()} GardenBook. All rights reserved.</p>
        </div>
        <div className="footer-column ">
          <h6 className="column-title">
            COMPANY
          </h6>
          <ul className="column-links">
            <li><a href=" ">HOME</a></li>
            <li><a href=" ">ABOUT US</a></li>
            <li><a href=" ">BOOKS</a></li>
            <li><a href=" ">NEW RELEASE</a></li>
            <li><a href=" ">BLOG</a></li>
          </ul>
        </div>
        <div class="footer-column ">
          <h3 class="column-title">IMPORTANT LINKS</h3>
          <ul class="column-links">
            <li><a href=" ">Privacy policy</a></li>
            <li><a href=" ">FAQs</a></li>
            <li><a href=" ">Term of Service</a></li>
          </ul>
          <p>Privacy | Term of Service</p>
      </div>

  </footer>
  );
};

export default Footer;