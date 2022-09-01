import React from 'react';
import logo from '../images/header-logo.svg'

class Header extends React.Component {

  render() {
    return (
      <header className="page__element header">
        <img className="header__logo" src={logo} alt="логотип Место"/>
      </header>
    );
  }
}

export default Header;
