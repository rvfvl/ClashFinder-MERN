import styled from 'styled-components';
import device from 'theme/queries';

export const HamburgerIcon = styled.div`
  width: 45px;
  height: 25px;
  position: relative;
  z-index: 2;
  top: 10px;
  left: 10px;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
  cursor: pointer;

  @media ${device.tablet} {
    display: none;
  }

  span {
    display: block;
    position: absolute;
    height: 7px;
    width: 100%;
    background: #fff;
    border-radius: 9px;
    opacity: 1;
    left: 0;
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;
  }

  span:nth-child(1) {
    top: 0px;
  }

  span:nth-child(2),
  span:nth-child(3) {
    top: 15px;
  }

  span:nth-child(4) {
    top: 30px;
  }

  &.open span:nth-child(1) {
    top: 18px;
    width: 0%;
    left: 50%;
  }

  &.open span:nth-child(2) {
    transform: rotate(45deg);
  }

  &.open span:nth-child(3) {
    transform: rotate(-45deg);
  }

  &.open span:nth-child(4) {
    top: 18px;
    width: 0%;
    left: 50%;
  }
`;
