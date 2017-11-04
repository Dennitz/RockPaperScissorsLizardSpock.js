import * as React from 'react';
import './styles/Header.css';

export default function Header() {
  return (
    <div className="Header">
      <h1 className="Header-title" />
      <a href="https://github.com/Dennitz/RockPaperScissorsLizardSpock.js">
        <img
          className="Header-github"
          src={require('./images/github-icon-white.svg')}
          alt="github"
          width={28}
          height={28}
        />
      </a>
    </div>
  );
}
