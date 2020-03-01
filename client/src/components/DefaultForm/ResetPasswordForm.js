import React from 'react';
import styled from 'styled-components';
import device from 'theme/queries';

const StyledFormWrapper = styled.div`
  background-color: #0b0c10;
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -45%);
  width: 100%;

  @media ${device.tablet} {
    min-width: 600px;
    width: unset;
  }
`;

const StyledTitle = styled.h1`
  border-bottom: 1px solid #00ffee;
  padding: 0 1rem 1rem;
`;

const StyledForm = styled.form`
  padding: 1rem 2rem 2rem;

  label {
    font-size: 19px;
    margin-bottom: 1rem;
    display: block;
  }

  span {
    display: block;
    margin-bottom: 1rem;
  }
`;

const ResetPasswordForm = props => {
  return (
    <StyledFormWrapper>
      <StyledTitle>{props.title}</StyledTitle>
      <StyledForm {...props}>{props.children}</StyledForm>
    </StyledFormWrapper>
  );
};

export default ResetPasswordForm;
