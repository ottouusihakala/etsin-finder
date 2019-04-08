import React, { Component } from 'react'
import styled from 'styled-components'

import Description from './description';

class Qvain extends Component {
  render() {
    return (
      <QvainContainer>
        <SubHeader>
          <SubHeaderText>Publish Dataset</SubHeaderText>
        </SubHeader>
        <form className="container">
          <Description />
        </form>
      </QvainContainer>
    )
  }
}

const QvainContainer = styled.div`
  background-color: #fafafa;
  height: -webkit-fill-available;
`

const SubHeader = styled.div`
  height: 100px;
  background-color: #007fad;
  color: white;
  display: flex;
  align-items: center;
`

const SubHeaderText = styled.div`
  font-family: Lato;
  font-size: 32px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 0.81;
  letter-spacing: normal;
  color: #ffffff;
  margin-left: 47px;
`

export default Qvain
