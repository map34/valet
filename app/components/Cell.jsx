import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

export default class Cell extends React.Component {
  handler = (e) => {
    this.props.handler(this.props.day, this.props.hour, e);
  }

  render() {
    const classes = classnames('slot', this.props.active);
    let label = '';

    if (typeof this.props.active === 'string') {
      if (this.props.active.indexOf('onehour') !== -1) {
        label = `${this.props.active.replace('- onehour', '')} HR`;
      }
    }

    return (
      <div onMouseDown={this.handler} onMouseOver={this.handler} onMouseUp={this.handler} className={classes} onFocus={() => {}} role="presentation">
        {label}
      </div>
    );
  }
}

Cell.propTypes = {
  handler: PropTypes.func,
  day: PropTypes.string,
  hour: PropTypes.string,
  active: PropTypes.arrayOf(PropTypes.string)
};

Cell.defaultProps = {
  handler() { },
  day: '',
  hour: '',
  active: []
};
