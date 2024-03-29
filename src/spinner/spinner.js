import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import styles from './spinner.css'

const Spinner1 = ({ color, className, style })  =>{
  const circles = [...Array(12)].map((_, index) => {
    return (
      <div key={index}>
        <div className={classNames(styles['div-after'])} style={{ background: color }}></div>
      </div>
    )
  })

  return (
    <div className={classNames(styles['lds-spinner'], className)} style={{ ...style }}>
      {circles}
    </div>
  )
}

Spinner1.propTypes = {
  /** hex color */
  color: PropTypes.string,
  /** class name  */
  className: PropTypes.string,
  /** style object */
  style: PropTypes.object,
}

Spinner1.defaultProps = {
  color: '#7f58af',
  className: '',
  style: {},
}


export default Spinner1;