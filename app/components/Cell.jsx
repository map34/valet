import React from 'react';
import classnames from 'classnames';

export default class Cell extends React.Component {
  _handler = (e) => {
    this.props.handler(this.props.day, this.props.hour, e);
  }

  render() {
    const classes = classnames('slot', this.props.active);
    let label = '';

    if (typeof this.props.active === 'string') {
      if (this.props.active.indexOf('onehour') !== -1) {
        label = this.props.active.replace('-onehour','') + ' HR';
      }
    }

    return (
      <div onMouseDown={this._handler} onMouseOver={this._handler} onMouseUp={this._handler} className={classes}>
        {label}
      </div>
    );
  }
}
