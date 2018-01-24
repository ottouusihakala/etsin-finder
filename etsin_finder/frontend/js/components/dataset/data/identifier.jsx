import React, { Component } from 'react';

export default class Identifier extends Component {
  constructor(props) {
    super(props)
    this.state = { url: '' }
    this.makeLink = this.makeLink.bind(this)
  }

  componentDidMount() {
    this.makeLink(this.props.idn)
  }

  makeLink(idn) {
    const sub3 = idn.substring(0, 3)
    const sub4 = idn.substring(0, 4)
    if (sub3 === 'urn' || sub3 === 'doi') {
      const page = sub3 === 'doi' ? 'https://doi.org' : 'https://urn.fi'
      this.setState({ url: `${page}/${idn}` })
    } else if (sub4 === 'http') {
      this.setState({ url: idn })
    }
  }

  render() {
    if (!this.state.url) {
      return <span className={this.props.classes}>{this.props.children}</span>
    }
    return (
      <a href={this.state.url} className={this.props.classes} title={this.state.url}>
        { this.props.children }
      </a>
    );
  }
}