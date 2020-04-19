/* eslint-disable comma-dangle */
import React from 'react'
import { ReactComponentLike } from 'prop-types'
import { RouteConfig } from 'react-router-config'
import Loadable from '@/components/loadable'
import PageFailed from '@/components/page-failed'
import PageLoading from '@/components/page-loading'
import { AjaxError } from '@/components/loadable/Loadable'

function PageNotFound() {
  return <PageFailed code={404} message="ERR_NOT_FOUND" />
}

interface RouteInitOpts {
  filePath?: string
  Loading?: ReactComponentLike
  title?: string
}

function createRoute(path: string, options: RouteInitOpts = {}) {
  const { filePath = path, Loading = PageLoading, title } = options
  const Failed = PageFailed
  const onError = (err: AjaxError) => {
    console.error(err)
  }

  if (__DEV__) {
    console.log(`@/pages/${filePath.slice(1)}/page`)
    const component = Loadable.loadWithInitialProps(
      require(`@/pages/${filePath.slice(1)}/page`),
      { codeSplitting: false, Failed, onError, Loading },
    )

    return {
      path,
      component,
      title: title || path,
    }
  }

  const component = Loadable.loadWithInitialProps(
    () =>
      import(
        /* webpackChunkName: "[request]" */
        `@/pages/${filePath.slice(1)}/page`
      ),
    { Failed, onError, Loading },
  )

  return {
    path,
    component,
    filePath,
    title: title || path,
  }
}

let routes: RouteConfig[] = [
  createRoute('/upload', { filePath: '/upload/index', title: '上传页面' }),
  createRoute('/upload/board'),
  createRoute('/playground'),
]

if (__DEV__) {
  routes = [
    ...routes,
    {
      path: '/',
      filePath: '/page',
      component: () =>
        React.createElement(
          Loadable.resolveChunk(require('@/pages/index/page')),
        ),
      exact: true,
    },
  ]
}

routes = [
  ...routes,
  {
    component: PageNotFound,
  },
]

export default routes
