import { getPageInfo } from '../utils'

const subtype = {
  pi: 'page-info',
  rcr: 'router-change-record',
  cbr: 'click-behavior-record',
  cdr: 'custom-define-record',
  hr: 'custom-define-record'
}

const reportBehaviorHandle = function(behaviorReportData, callBlack) {
  const reportData = {
    ...behaviorReportData,
    type: 'behavior'
  }
  if (typeof callBlack === 'function') {
    callBlack(reportData)
  }
}

export function initPageInfo (websdk) {
  reportBehaviorHandle(
    { subtype: subtype.pi, ...getPageInfo()},
    (reportData) => {
      websdk.report(reportData)
    }
  )
}