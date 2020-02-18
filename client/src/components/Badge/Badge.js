import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const StyledBadge = styled.div`
  width: 100%;
  padding: 15px;
  margin: 1rem 0 0;

  &.danger {
    background-color: red;
  }

  &.success {
    background-color: green;
  }
`;

const Badge = props => {
  return <StyledBadge {...props}>{props.children}</StyledBadge>;
};

Badge.propTypes = {
  children: PropTypes.string.isRequired
};

export default Badge;
