import React from 'react'
import _isEmpty from 'lodash/isEmpty'

const ShowControl = (props) => {
  const { visible, children } = props

  if (!visible) {
    return null
  } else {
    return <>{children}</>
  }
}

export default ShowControl
