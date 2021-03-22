import styled, { keyframes } from 'styled-components'
import { shade } from 'polished'

import signUpBackgroundImg from '../../assets/sign-up-background.png'

export const Container = styled.div`
  height: 100vh;

  display: flex;
  align-items: stretch;

  @media (max-width: 1024px) {
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 321px) {
    margin-top: 1rem;
  }
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  /* This is the same of justify-content: center */
  place-content: center;

  width: 100%;
  max-width: 700px;
`

const appearFromRight = keyframes`
    from {
        opacity: 0;
        transform: translateX(50px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
`

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${appearFromRight} 1s;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    @media (max-width: 321px) {
      padding: 0 1rem;
    }

    h1 {
      margin-bottom: 24px;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4ede8')};
      }
    }

    @media (max-width: 321px) {
      margin: 32px 0;
    }
  }

  > a {
    color: #2fd0d6;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    display: flex;
    align-items: center;

    svg {
      margin-right: 16px;
    }

    &:hover {
      color: ${shade(0.2, '#2fd0d6')};
    }

    @media (max-width: 376px) {
      margin-top: 0;
    }

    @media (max-width: 361px) {
      margin-bottom: 1rem;
    }
  }
`

export const Background = styled.div`
  flex: 1;
  background: url(${signUpBackgroundImg}) no-repeat center;
  background-size: cover;

  @media (max-width: 1024px) {
    display: none;
    visibility: hidden;
  }
`
