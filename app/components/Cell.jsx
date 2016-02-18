import React from 'react';
import classnames from 'classnames';

export default class Cell extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    let classes = classnames('slot', {
      active: this.props.active
    });

    return (
      <div onClick={this._handler} className={classes}></div>
    );
  }

  _handler = (e) => {
    this.props.handler(this.props.day, this.props.hour);
  };
}