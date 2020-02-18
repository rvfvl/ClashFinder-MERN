import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from 'assets/logo.png';
import Hamburger from 'components/Hamburger/Hamburger';
import { logoutUser } from 'actions/authActions';
import {
  NavbarWrapper,
  StyledMenu,
  StyledMenuItem,
  LogoContainer,
  NavbarLeft,
  MobileWrapper,
  LogoutButton
} from './NavbarStyle';

const Navbar = () => {
  const [menuIsOpen, setmenuIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  return (
    <MobileWrapper>
      <NavbarWrapper menuIsOpen={menuIsOpen}>
        <NavbarLeft>
          <LogoContainer>
            <Link to="/">
              <img src={logo} alt="Website Logo" />
            </Link>
          </LogoContainer>
          <StyledMenu>
            <StyledMenuItem to="/players">Find Player</StyledMenuItem>
          </StyledMenu>
        </NavbarLeft>
        <div>
          <StyledMenu>
            {!loading && !isAuthenticated ? (
              <>
                <StyledMenuItem to="/login">Login</StyledMenuItem>
                <StyledMenuItem to="/register">
                  <strong>Register</strong>
                </StyledMenuItem>
              </>
            ) : (
              <>
                <StyledMenuItem to="/profile">Profile</StyledMenuItem>
                <LogoutButton onClick={() => dispatch(logoutUser)} type="button">
                  Logout
                </LogoutButton>
              </>
            )}
          </StyledMenu>
        </div>
      </NavbarWrapper>
      <Hamburger setmenuIsOpen={setmenuIsOpen} menuIsOpen={menuIsOpen} />
      <Link to="/">
        <img src={logo} alt="Website Logo" className="logo_desktop" />
      </Link>
    </MobileWrapper>
  );
};

export default Navbar;
