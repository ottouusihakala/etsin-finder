import React, { Component } from 'react'
import styled from 'styled-components'

import EtsinLogo from '../components/general/header/etsinLogo'
import Settings from '../components/general/navigation/settings'
import Navi from '../components/general/navigation/index'
import MobileNavi from '../components/general/navigation/mobileNavi'

export default class Header extends Component {
  state = {}
  render() {
    return (
      <HeaderBar>
        <Positioner className="container">
          <EtsinLogo />
          <NaviCont>
            <Navi />
          </NaviCont>
          <Right>
            <MobileNavi />
            <Settings />
          </Right>
        </Positioner>
      </HeaderBar>
    )
  }
}

const HeaderBar = styled.div`
  width: 100%;
  height: 4em;
  background-color: white;
  color: ${p => p.theme.color.dark};
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
`

const Positioner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const NaviCont = styled.div`
  display: none;
  justify-content: center;
  align-items: center;
  height: 100%;
  @media screen and (min-width: ${p => p.theme.breakpoints.lg}) {
    display: flex;
  }
`

const Right = styled.div`
  width: 12em;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
`
