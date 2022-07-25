export function htmlTreeAsString(elm: unknown, keyAttrs?: string[]): string {
  type SimpleNode = {
    parentNode: SimpleNode
  } | null

  try {
    let currentElem = elm as SimpleNode
    let out: string[] = []
    const MAX_TRAVERSE_HEIGHT = 5
    const MAX_OUTPUT_LEN = 80
    let height = 0
    let len = 0
    const separator = ' > '
    const sepLength = separator.length

    while (currentElem && height++ < MAX_TRAVERSE_HEIGHT) {
      const nextStr = htmlElementAsString(currentElem, keyAttrs)
      if (nextStr === 'html' || (height > 1 && len + out.length * sepLength + nextStr.length >= MAX_OUTPUT_LEN)) {
        break
      }
      out.push(nextStr)
      len += nextStr.length
      currentElem = currentElem.parentNode
    }

    return out.reverse().join(separator)
  } catch(e) {
    return '<unknown>'
  }
}

function htmlElementAsString(el: unknown, keyAttrs: string[] = []): string {
  const elem = el as {
    tagName?: string
    id?: string
    className?: string
    getAttribute(key: string): string
  }

  if (!elem || !elem.tagName) {
    return ''
  }

  let out: string[] = []

  const keyAttrPairs =
    keyAttrs && keyAttrs.length ?
      keyAttrs
        .filter(keyAttr => elem.getAttribute(keyAttr))
        .map(keyAttr => [keyAttr, elem.getAttribute(keyAttr)]) :
      null

  if (keyAttrPairs && keyAttrPairs.length) {
    keyAttrPairs.forEach(keyAttrPair => {
      out.push(`[${keyAttrPair[0]}="${keyAttrPair[1]}"]`)
    })
  } else {
    if (elem.id) {
      out.push(`#${elem.id}`)
    }
    let className = elem.className
    if (className) {
      const clsArr = className.split(' ')
      clsArr.forEach(cls => out.push(`.${cls}`))
    }
  }
  return out.join('')
}
