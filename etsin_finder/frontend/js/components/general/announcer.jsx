import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

class Announcer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: props.Stores.Accessibility.navText,
    }
  }

  componentWillReceiveProps(newProps) {
    console.log(newProps)
    setTimeout(() => {
      this.setState({
        text: newProps.Stores.Accessibility.navText,
      })
    }, 50)
    setTimeout(() => {
      newProps.Stores.Accessibility.clearNavText()
    }, 500)
  }

  render() {
    if (this.state.text) {
      console.log('announce', this.state.text)
    }
    return (
      <div className="sr-only" aria-live="assertive">
        {this.state.text}
      </div>
    )
  }
}

export default inject('Stores')(observer(Announcer))
