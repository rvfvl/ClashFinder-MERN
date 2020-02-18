import styled from 'styled-components';
import device from 'theme/queries';

export const FormWrapper = styled.div`
  display: block;
  width: 100%;
  background-color: #1f2833;
  padding: 1rem;
  margin: 1rem 0;

  form {
    overflow-x: scroll;

    * input,
    * select {
      width: 160px;
    }

    img {
      height: 30px;
      width: 30px;
      margin: 0;

      @media ${device.tablet} {
        height: 45px;
        width: 45px;
        margin: 0 0.5rem;
      }
    }

    @media ${device.tablet} {
      overflow-x: unset;

      * input,
      * select {
        width: 100%;
      }
    }
  }
`;

export const FormTopSection = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #30726e;
  padding: 0 1rem 1rem;

  .title {
    display: flex;
    align-items: center;
    font-size: 12px;

    @media ${device.tablet} {
      font-size: 16px;
    }

    span {
      font-weight: 700;
      margin-left: 5px;
    }
  }

  .edit {
    display: flex;
    align-items: center;
    cursor: pointer;
    font-size: 12px;

    @media ${device.tablet} {
      font-size: 16px;
    }

    span {
      font-weight: 700;
      margin-left: 5px;
    }
  }
`;

export const FormBottonSection = styled.div`
  table {
    tr {
      padding: 0;

      td {
        height: 55px;
        padding: 0;
        font-size: 12px;

        @media ${device.tablet} {
          padding: 0 1rem;
          font-size: 1rem;
        }
      }
    }
  }
`;
