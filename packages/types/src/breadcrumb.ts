/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Breadcrumb {
  category: BREADCRUMBTYPES
  message?: string
  data?: { [key: string]: any }
  timestamp?: number
}

export interface Breadcrumbs {
  addBreadcrumb: (breadcrumb: Breadcrumb) => void
  getStack: () => Breadcrumb[]
}

export type BREADCRUMBTYPES = 
'Route' |
'UI.Click' |
'Console' |
'Xhr' |
'Fetch' |
'Unhandledrejection' |
'Vue' |
'React' |
'Resource' |
'Code Error' |
'Customer'
