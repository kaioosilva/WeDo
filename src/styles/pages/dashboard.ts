import styled from 'styled-components'

export const Container = styled.div``

export const Header = styled.header`
  padding: 32px 0;
  background: #28262e;
`

export const HeaderContent = styled.div`
  max-width: 1120px;
  display: flex;
  margin: 0 auto;
  align-items: center;

  > img {
    height: 80px;
    max-width: 80px;

    @media (max-width: 767px) {
      display: none;
      visibility: hidden;
    }
  }

  button {
    margin-left: auto;
    background: transparent;
    border: 0;

    @media (max-width: 767px) {
      margin-right: 1rem;
    }

    svg {
      color: #999591;
      width: 20px;
      height: 20px;
    }

    svg:hover {
      color: red;
    }
  }
`

export const Profile = styled.div`
  display: flex;
  align-items: center;

  margin-left: 80px;
  width: 100%;

  @media (max-width: 767px) {
    margin-left: 1rem;
  }

  img {
    width: 56px;
    height: 56px;
    border-radius: 50%;
  }

  div:first-child {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #999591;
  }

  div {
    display: flex;
    flex-direction: column;
    margin-left: 16px;
    line-height: 24px;

    span {
      color: #f4ede8;
    }

    strong {
      text-decoration: none;
      color: #2fd0d6;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }
    }
  }
`
export const Content = styled.main`
  max-width: 1120px;

  margin: 64px auto;
  display: flex;

  @media (max-width: 1024px) {
    padding: 0 1rem;
  }
`
