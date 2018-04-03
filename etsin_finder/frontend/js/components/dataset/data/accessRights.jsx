import React, { Component } from 'react'
import Translate from 'react-translate-component'
import { inject, observer } from 'mobx-react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faLock from '@fortawesome/fontawesome-free-solid/faLock'
import faUnlock from '@fortawesome/fontawesome-free-solid/faUnlock'
import styled from 'styled-components'

import checkNested from 'Utils/checkNested'
import checkDataLang from 'Utils/checkDataLang'
import Tooltip from '../../general/tooltip'

const Access = styled.div`
  background-color: ${props => props.theme.color.lightgray};
  padding: 0.2em 0.9em;
  border-radius: 1em;
  width: max-content;
  height: max-content;
  div {
    width: max-content;
  }
`

export const accessRightsBool = accessRights => {
  console.log('accessRights', accessRights)
  const openValues = [
    'http://purl.org/att/es/reference_data/access_type/access_type_open_access',
    'open_access',
    'http://www.opensource.org/licenses/Apache-2.0',
  ]

  // function to compare string to possible open values
  const checkOpen = string => {
    if (openValues.filter(open => open === string)[0]) {
      return true
    }
    return false
  }

  if (accessRights !== undefined && accessRights !== null) {
    // check access_type
    if (checkNested(accessRights, 'access_type')) {
      if (checkOpen(accessRights.access_type.identifier)) {
        return true
      }
    }
    // check license
    if (checkNested(accessRights, 'license')) {
      if (accessRights.license.filter(item => checkOpen(item.identifier))[0]) {
        return true
      }
    }
  }
  return false
}

class AccessRights extends Component {
  constructor(props) {
    super(props)
    console.log('access rights', props.access_rights)
    let title = { en: 'Restricted Access' }
    if (props.access_rights !== undefined && props.access_rights !== null) {
      title = props.access_rights.type
        ? props.access_rights.type.map(item => item.identifier)
        : props.access_rights.license.map(item => item.identifier)
    }
    this.lang = props.Stores.Locale.currentLang
    this.state = {
      title,
    }
  }

  restricted() {
    return (
      <Tooltip title={checkDataLang(this.state.title, this.lang)}>
        <div className="access-symbol" title={checkDataLang(this.state.title, this.lang)}>
          <FontAwesomeIcon icon={faLock} />
          <Translate content="dataset.access_locked" fallback="Restricted Access" />
        </div>
      </Tooltip>
    )
  }

  openAccess() {
    return (
      <div className="access-symbol" title={checkDataLang(this.state.title, this.lang)}>
        <FontAwesomeIcon icon={faUnlock} />
        <Translate content="dataset.access_open" fallback="Open Access" />
      </div>
    )
  }
  render() {
    this.lang = this.props.Stores.Locale
    return (
      <Access {...this.props}>
        {accessRightsBool(this.props.access_rights) ? this.openAccess() : this.restricted()}
      </Access>
    )
  }
}

export default inject('Stores')(observer(AccessRights))
export const undecorated = AccessRights
