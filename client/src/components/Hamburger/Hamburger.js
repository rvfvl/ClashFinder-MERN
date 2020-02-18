import React from 'react';
import PropTypes from 'prop-types';
import { HamburgerIcon } from './HamburgerStyle';

const Hamburger = ({ menuIsOpen, setmenuIsOpen }) => {
  return (
    <HamburgerIcon onClick={() => setmenuIsOpen(!menuIsOpen)} className={menuIsOpen && 'open'}>
      <span />
      <span />
      <span />
      <span />
    </HamburgerIcon>
  );
};

Hamburger.propTypes = {
  menuIsOpen: PropTypes.bool.isRequired,
  setmenuIsOpen: PropTypes.func.isRequired
};

export default Hamburger;
