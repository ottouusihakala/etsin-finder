import React, { Fragment } from 'react'
import { Provider } from 'mobx-react'
import { BrowserRouter as Router } from 'react-router-dom'
import styled, { ThemeProvider } from 'styled-components'
import { storiesOf, addDecorator } from '@storybook/react'

import Stores from '../js/stores'
import theme from '../js/theme'
import Hero from '../js/components/general/hero'
import Button, {
  InvertedButton,
  Link,
  TransparentButton,
  LinkButton,
} from '../js/components/general/button'
import Splash from '../js/components/general/splash'
import Pagination from '../js/components/search/pagination'
import SortResults from '../js/components/search/sortResults'
import ResultsAmount from '../js/components/search/resultsAmount'

/* eslint-disable */

const AppDecorator = storyFn => (
  <Provider Stores={Stores}>
    <Router history={Stores.history}>
      <ThemeProvider theme={theme}>{storyFn()}</ThemeProvider>
    </Router>
  </Provider>
)
addDecorator(AppDecorator)

const Container = styled.div`
  max-width: ${props => props.maxWidth};
  padding: 1em;
  margin: 1em;
`

storiesOf('Hero', module).add('Normal', () => (
  <Hero className="hero-primary">
    <h1>Basic Hero</h1>
  </Hero>
))

storiesOf('Button', module)
  .add('Primary buttons', () => (
    <Fragment>
      <Button>Primary</Button>
      <InvertedButton>Inverted</InvertedButton>
      <Link href="https://google.com">Link</Link>
      <TransparentButton>Transparent Button</TransparentButton>
      <LinkButton>LinkButton</LinkButton>
    </Fragment>
  ))
  .add('Color error', () => (
    <Fragment>
      <Button color={theme.color.error}>Primary</Button>
      <InvertedButton color={theme.color.error}>Inverted</InvertedButton>
      <Link href="https://google.com" color={theme.color.error}>
        Link
      </Link>
      <TransparentButton color={theme.color.error}>Transparent Button</TransparentButton>
      <LinkButton color={theme.color.error}>LinkButton</LinkButton>
    </Fragment>
  ))

storiesOf('Splash', module).add('Active', () => (
  <Splash visible="true">
    <h1>Hello</h1>
  </Splash>
))

storiesOf('Pagination', module).add('5 pages', () => (
  <div>
    <Pagination totalResults={50} perPage={10} currentPage={3} />
    <Pagination totalResults={60} perPage={3} currentPage={10} />
    <Pagination totalResults={100} perPage={3} currentPage={3} />
  </div>
))

storiesOf('Search sorting', module).add('Normal', () => (
  <Container maxWidth="500px">
    <SortResults />
  </Container>
))

storiesOf('Results amount', module).add('Normal', () => <ResultsAmount amount={50} />)
