import styled from 'styled-components'
import { shade } from 'polished'

export const Container = styled.div`
  flex: 1;

  h1 {
    font-size: 36px;
    margin-bottom: 20px;

    @media (max-width: 767px) {
      font-size: 30px;
    }
  }

  #listContainer {
    margin-top: 20px;
    color: #f4ede8;
    /* overflow: scroll;
    height: 400px; */
  }

  #listContainer div {
    display: flex;
    /* align-items: center; */
    background: #232129;

    /* justify-content: space-between; */
    border: 2px solid #232129;
    border-radius: 10px;
    padding: 4px 10px;

    @media (max-width: 767px) {
      padding: 4px 3px;
    }
  }

  #listContainer > div {
    margin-bottom: 8px;
  }

  #listContainer li {
    width: 100%;
    overflow: hidden;
    transition: color 0.2s;
  }

  #listContainer li input {
    background: transparent;
    border: 0;
    /* color: #2fd0d6; */
    color: #f4ede8;
    width: 100%;
  }

  #listContainer svg {
    cursor: pointer;
  }

  #listContainer svg:hover {
    color: ${shade(0.2, '#2fd0d6')};
  }
`

export const LoadingContainer = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const ItemContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;

  p {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    margin-left: 1rem;
  }

  ul {
    margin-left: 2rem;

    @media (max-width: 767px) {
      margin-left: 0.5rem;
    }
  }

  #taskContainer span {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
  }

  #taskContainer li {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-top: 1rem;
  }

  #taskContainer li input:first-child {
    width: 20px;
  }

  #taskContainer li input {
    width: 100%;
  }

  #subtaskContainer li {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-top: 1rem;
  }

  #subtaskContainer li input:first-child {
    width: 20px;
  }

  #subtaskContainer li input {
    width: 100%;
  }
`
