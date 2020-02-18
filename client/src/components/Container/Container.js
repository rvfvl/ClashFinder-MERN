import React from 'react';
import PropTypes from 'prop-types';
import { ContainerWrapper } from './ContainerStyle';

const Container = ({ children }) => {
  return <ContainerWrapper>{children}</ContainerWrapper>;
};

Container.propTypes = {
  children: PropTypes.element.isRequired
};

export default Container;
