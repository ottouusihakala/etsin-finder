import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

class Loader extends Component {
  spinner = () => <Spinner color={this.props.color} size={this.props.size} />
  render() {
    if (this.props.left) {
      return (
        <HolderLeft
          size={this.props.size}
          margin={this.props.margin}
          className={`${this.props.active ? 'loader-active' : ''}`}
        >
          {this.spinner()}
        </HolderLeft>
      )
    }
    return (
      <Holder
        spinnerSize={this.props.spinnerSize}
        margin={this.props.margin}
        className={`${this.props.active ? 'loader-active' : ''}`}
      >
        {this.spinner()}
      </Holder>
    )
  }
}

export default Loader

const Holder = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  max-height: 0em;
  transition: all 0.2s ease;
  overflow: hidden;
  margin: ${props => props.margin};
  &.loader-active {
    max-height: 4em;
    div {
      border-width: ${p => p.spinnerSize};
    }
  }
`

const Spinner = styled.div`
  height: ${p => p.size};
  width: ${p => p.size};
  animation: spinner 0.8s infinite linear;
  border: 0px solid ${props => (props.color ? props.color : props.theme.color.primary)};
  border-right-color: transparent;
  border-radius: 50%;
  transition: all 0.3s ease;
  @keyframes spinner {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const HolderLeft = Holder.extend`
  justify-content: left;
  padding: 0 0 0 1em;
`

Loader.defaultProps = {
  left: false,
  margin: '0',
  color: '',
  size: '2.5em',
  spinnerSize: '6px',
}

Loader.propTypes = {
  left: PropTypes.bool,
  margin: PropTypes.string,
  active: PropTypes.bool.isRequired,
  color: PropTypes.string,
  size: PropTypes.string,
  spinnerSize: PropTypes.string,
}
