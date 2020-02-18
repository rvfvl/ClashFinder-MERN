import styled from 'styled-components';
import device from 'theme/queries';
import { NavLink } from 'react-router-dom';

export const NavbarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.menuNav};
  height: 100%;
  overflow: hidden;
  width: ${({ menuIsOpen }) => (menuIsOpen ? '252px' : '0px')};
  transition: width 1s;
  position: absolute;
  z-index: 1;
  border-right: ${({ menuIsOpen }) => (menuIsOpen ? '2px solid #fff' : 'none')};

  @media ${device.tablet} {
    border-right: unset;
  }

  /* hr {
    width: 100%;
    display: block;
    margin-bottom: none !important;

    @media ${device.tablet} {
      display: none;
    }
  } */

  @media ${device.tablet} {
    display: flex !important;
    flex-direction: row;
    position: relative;
    justify-content: space-between;
    background-color: unset;
    height: unset;
    width: unset;
  }
`;

export const MobileWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  height: 55px;

  @media ${device.tablet} {
    display: block;
    padding: 35px;
    height: unset;
  }

  @media ${device.tablet} {
    .logo_desktop {
      display: none;
    }
  }
`;

export const LogoContainer = styled.div`
  @media ${device.tablet} {
    display: flex;
    align-items: center;
    margin-right: 1.5rem;
  }

  img {
    display: none;

    @media ${device.tablet} {
      margin: unset;
      display: block;
    }
  }
`;

export const NavbarLeft = styled.div`
  margin-top: 5rem;

  @media ${device.tablet} {
    display: flex;
    margin-top: unset;
  }
`;

export const StyledMenu = styled.div`
  @media ${device.tablet} {
    display: flex;
    min-width: 0;
  }

  height: 100%;
  font-size: ${({ theme }) => theme.fontSize.nav};
`;

export const StyledMenuItem = styled(NavLink)`
  padding: 0.6rem;
  text-align: center;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #fff;
  height: 50px;
  min-width: 250px;

  &.active {
    background-color: #1f2833;

    @media ${device.tablet} {
      background-color: transparent;
    }
  }

  @media ${device.tablet} {
    align-items: center;
    text-align: left;
    padding: 0 0.6rem;
    min-width: unset;
  }
`;

export const LogoutButton = styled.button`
  display: block;
  height: 50px;
  background-color: transparent;
  border: 0;
  padding: 0 0.6rem;
  cursor: pointer;
  color: #fff;
  font-family: 'Exo 2', sans-serif;
`;
