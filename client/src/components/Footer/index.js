import React from 'react';
import logoImg from '../../assets/img/moonstartoken-logo.png';
import footerImg from '../../assets/img/footer-bg.png';
import JoinUs from './join';

const Footer = () => (
  <>
    <JoinUs />
    <footer
      className="site-footer"
      style={{background: `url(${footerImg}) no-repeat center/cover`}}
    >
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-3 text-center text-md-left my-3">
            <a href="/">
              {/* <img src={logoImg} alt="Logo" style={{width: '270px'}}/> */}
              <h3 style={{ margin: 0, margin: '0px', fontStyle: 'italic' }}>Teenage Superhero</h3>
            </a>
          </div>
          <div className="col-lg-6 text-center my-5 my-md-3">
            <ul className="list-inline footer-nav">
              <li className="list-inline-item">
                <a href="/">HOME</a>
              </li>
              {/* <li className="list-inline-item">
                <a href="/profile">ACCOUNT</a>
              </li> */}
              {/* <li className="list-inline-item">
                <a href="/marketplace">EXPLORE</a>
              </li> */}
              <li className="list-inline-item">
                <a href="/create">GET STARTED</a>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 text-center">
            <ul className="list-inline social-nav">
              <li className="list-inline-item">
                <a href="https://twitter.com/digital_hero?s=09" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter"></i>
                </a>
              </li>
              <li className="list-inline-item">
                <a href="https://discord.gg/B8j5R5VCtR" target="_blank"  rel="noopener noreferrer">
                  <i className="fab fa-discord"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-12 text-center">
            <p className="copy-right-text">
              Copyright 2021 © Teenage Superheroes. All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  </>  
);

export default Footer;
