import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import PaginationButtons from './paginationButtons'
import ElasticQuery from '../../../stores/view/elasticquery'

class Pagination extends Component {
  render() {
    return <PaginationButtons loading={ElasticQuery.loading} />
  }
}

export default inject('Stores')(observer(Pagination))