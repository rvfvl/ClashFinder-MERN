import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import device from '../theme/queries';
import { useForm } from 'react-hook-form';
import { setAlert } from '../actions/alertActions';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';
import Badge from 'components/Badge/Badge';

const PageWrapper = styled.div`
  padding: 1rem;
  height: calc(100vh - 120px);
  position: relative;

  @media ${device.tablet} {
    padding: 2rem;
  }
`;

const FormWrapper = styled.form`
  background-color: #0b0c10;
  padding: 2rem;
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -45%);
`;

const StyledLabel = styled.label`
  font-size: 19px;
  margin-bottom: 1rem;
  display: block;
`;

const ForgotPasswordPage = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const { register, handleSubmit, watch, errors } = useForm();
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();

  const onSubmit = async data => {
    try {
      const response = await axios.post('/api/v1/auth/forgotpassword', JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });

      dispatch(setAlert('success', response.data.msg));
    } catch (error) {
      dispatch(setAlert('danger', error.response.data.errors.msg));
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/profile" />;
  }

  return (
    <PageWrapper>
      <FormWrapper onSubmit={handleSubmit(onSubmit)}>
        <StyledLabel htmlFor="email">Email:</StyledLabel>
        <Input
          type="text"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          ref={register({
            required: true,
            pattern: /^([\w\d._\-#])+@([\w\d._\-#]+[.][\w\d._\-#]+)+$/
          })}
        />
        {errors.email && (
          <Badge className="danger" style={{ display: 'block' }}>
            Please enter correct email address.
          </Badge>
        )}
        <Button type="submit" value="Request email change" />
      </FormWrapper>
    </PageWrapper>
  );
};

export default ForgotPasswordPage;
