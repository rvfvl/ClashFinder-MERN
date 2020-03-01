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
import ResetPasswordForm from 'components/DefaultForm/ResetPasswordForm';

const PageWrapper = styled.div`
  padding: 1rem;
  height: calc(100vh - 120px);
  position: relative;

  @media ${device.tablet} {
    padding: 2rem;
  }
`;

const ForgotPasswordPage = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const { register, handleSubmit, watch, errors } = useForm();
  const [passwordChangeState, setPasswordChangeState] = useState({ state: null, msg: '' });

  const dispatch = useDispatch();

  const onSubmit = async data => {
    try {
      const response = await axios.post('/api/v1/auth/forgotpassword', JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });

      setPasswordChangeState({ state: true, msg: response.data.msg });
      //dispatch(setAlert('success', response.data.msg));
    } catch (error) {
      setPasswordChangeState({ state: false, msg: error.response.data.errors.msg });
      //dispatch(setAlert('danger', error.response.data.errors.msg));
    }
  };

  if (isAuthenticated) {
    return <Redirect to="/profile" />;
  }

  return (
    <PageWrapper>
      <ResetPasswordForm title="Forgot password" onSubmit={handleSubmit(onSubmit)}>
        <span>
          <label htmlFor="email">Email:</label>
          <Input
            type="text"
            name="email"
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
          <p>
            Please enter your email. After submitting the request, an email will be sent with a link
            to complete password change process.
          </p>
        </span>
        {passwordChangeState.state && (
          <Badge className="success" style={{ display: 'block' }}>
            {passwordChangeState.msg}
          </Badge>
        )}
        {passwordChangeState.state !== null && !passwordChangeState.state && (
          <Badge className="danger" style={{ display: 'block' }}>
            {passwordChangeState.msg}
          </Badge>
        )}
        <Button type="submit" value="Request email change" />
      </ResetPasswordForm>
    </PageWrapper>
  );
};

export default ForgotPasswordPage;
