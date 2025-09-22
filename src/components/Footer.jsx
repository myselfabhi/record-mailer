import React from 'react'
import npstLogo from '../npstlogo.svg'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <p>Made by Abhinav Verma (Associate Developer)</p>
        </div>
        <div className="footer-right">
          <img src={npstLogo} alt="NPST" className="npst-logo" />
        </div>
      </div>
    </footer>
  )
}

export default Footer
