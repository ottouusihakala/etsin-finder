import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

export default class PopUp extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    popUp: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onRequestClose: PropTypes.func.isRequired,
    align: PropTypes.oneOf(['left', 'right', 'center', 'sidebar']),
  }

  static defaultProps = {
    align: 'left',
  }

  constructor(props) {
    super(props)
    this.state = {
      isFocused: false,
    }

    this.onBlur = this.onBlur.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.popRef = React.createRef()
    this.timeoutID = undefined
  }

  componentDidUpdate() {
    // This fixes issues with opening and closing
    // when there are multiple popups
    if (this.props.isOpen === true) {
      setTimeout(() => {
        if (this.popRef.current) {
          this.popRef.current.focus()
        }
      }, 50)
    }
  }

  onBlur() {
    this.timeoutID = setTimeout(() => {
      if (this.state.isFocused) {
        this.setState(
          {
            isFocused: false,
          },
          () => {
            this.props.onRequestClose()
          }
        )
      }
    }, 0)
  }

  onFocus() {
    clearTimeout(this.timeoutID)
    if (!this.state.isFocused) {
      this.setState({
        isFocused: true,
      })
    }
  }

  render() {
    return (
      <Relative>
        {this.props.isOpen && (
          <React.Fragment>
            <PopContainer>
              <Pop
                innerRef={this.popRef}
                tabIndex="-1"
                autofocus
                onBlur={this.onBlur}
                onFocus={this.onFocus}
                align={this.props.align}
              >
                {this.props.popUp}
              </Pop>
              <Svg width="40px" height="20px" viewBox="0 0 20 20">
                <defs>
                  <filter id="dropshadow" height="200%" width="200%">
                    <feOffset dx="0" dy="3" result="offsetblur" />
                    <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                    <feComponentTransfer>
                      <feFuncA type="linear" slope="0.6" />
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <polygon
                  fill="white"
                  points="0,0 10,10 20,0"
                  style={{ filter: 'url(#dropshadow)' }}
                />
              </Svg>
            </PopContainer>
          </React.Fragment>
        )}
        {this.props.children}
      </Relative>
    )
  }
}

const Relative = styled.span`
  position: initial;
  display: inline-block;
  @media screen and (min-width: ${p => p.theme.breakpoints.sm}) {
    position: relative;
  }
`

const PopContainer = styled.div`
  position: initial;
  height: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  @media screen and (min-width: ${p => p.theme.breakpoints.sm}) {
    position: relative;
    height: initial;
  }
`

const alignment = align => {
  let value
  switch (align) {
    case 'left':
      value = css`
        left: 0;
        margin-left: -10px;
      `
      break
    case 'right':
      value = css`
        right: 0;
      `
      break
    case 'sidebar':
      value = css`
        right: auto;
        left: auto;
        @media screen and (min-width: ${p => p.theme.breakpoints.lg}) {
          right: 0;
          margin-right: -30px;
        }
      `
      break
    case 'center':
      value = css`
        left: auto;
      `
      break
    // goes here only if an unvalid value is given
    default:
      value = ''
  }
  return value
}

const Pop = styled.div`
  position: absolute;
  top: initial;
  left: 15px;
  background-color: white;
  width: calc(100vw - 30px);
  padding: 1em 1.7em;
  box-shadow: 0px 2px 4px 1px rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  transform: translateY(calc(-100% - 10px));
  @media screen and (min-width: ${p => p.theme.breakpoints.sm}) {
    top: 1px;
    left: initial;
    ${p => alignment(p.align)};
    position: absolute;
    width: max-content;
  }
`

const Svg = styled.svg`
  top: initial;
  position: absolute;
  margin-top: -10px;
  @media screen and (min-width: ${p => p.theme.breakpoints.sm}) {
    top: -10px;
    position: absolute;
    margin-top: 0;
  }
`

// mobile aligment
// - don't go outside 15px content margin
// - stay over arrow always
// - maxwidth 100vw-2xMargin
//
// desktop alignment
// - stay over arrow
// - option to align right, left or center
