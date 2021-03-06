import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Link, Redirect } from 'react-router-dom';
import Badge from 'components/Badge/Badge';
import { registerUser } from 'actions/authActions';

const FormWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 500px;
  min-height: 700px;
  padding: 30px;
  background-color: ${({ theme }) => theme.colors.authForm};
  box-shadow: 0px 3px 6px #000000;
  border-radius: 5px;
`;

const FormTitle = styled.h1`
  font-size: 36px;
  text-shadow: 1px 3px 6px #000000;
  font-weight: 400;
  text-align: center;
  display: block;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;

  label {
    padding: 5px 0 10px;
    font-size: 23px;
  }

  .textInput {
    background-color: #1f2833;
    border: 1px solid #707070;
    border-radius: 3px;
    height: 48px;
    margin-bottom: 1rem;
    color: #fff;
    padding: 0 10px;
  }

  input[type='submit'] {
    background-color: #fff;
    border: 0;
    font-size: 23px;
    font-family: 'Exo 2', sans-serif;
    padding: 14px 0;
    cursor: pointer;
  }
`;

const StyledLink = styled(Link)`
  color: #fff;
  margin: 1.5rem 0;
  display: block;
  text-decoration: none;
  text-align: center;
`;

const StyledHr = styled.hr`
  border-color: #66fcf1;
  margin: 2rem 0;
`;

const RegisterPage = () => {
  const { register, handleSubmit, errors, watch } = useForm();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect to="/profile" />;
  }

  const onSubmit = data => {
    dispatch(registerUser(data));
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <FormWrapper>
        <div style={{ flex: '1' }}>
          <FormTitle>Create Account</FormTitle>
          <StyledForm onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="email">Email</label>
            <input
              className="textInput"
              name="email"
              type="text"
              ref={register({
                required: true,
                pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              })}
            />
            {errors.email && <Badge>Email address is required.</Badge>}
            <label htmlFor="password">Password</label>
            <input
              className="textInput"
              name="password"
              type="password"
              ref={register({ required: true, minLength: 5 })}
            />
            {errors.password && <Badge>Password needs to be at least 5 characters long.</Badge>}
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              className="textInput"
              name="confirmPassword"
              type="password"
              ref={register({ required: true, validate: value => value === watch('password') })}
            />
            {errors.confirmPassword && <Badge>Password does not match.</Badge>}
            <input type="submit" />
          </StyledForm>
          <StyledHr />
          <StyledLink to="/login">
            Already have an account? <strong>Log In</strong>
          </StyledLink>
        </div>
      </FormWrapper>
    </div>
  );
};

export default RegisterPage;
