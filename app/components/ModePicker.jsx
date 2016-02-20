import React from 'react';
import classNames from 'classnames';

export default class ModePicker extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {

    let onehrclasses = classNames('btn', 'btn-avail', {
      'btn-active': this.props.selected == 'onehour'
    });
    let freeclasses = classNames('btn', 'btn-avail', {
      'btn-active': this.props.selected == 'free'
    });
    let noparkingclasses = classNames('btn', 'btn-noparking', {
      'btn-active': this.props.selected == 'noparking'
    });



    return (
      <div className="mode-picker">
        <div className={onehrclasses} onClick={this.props.clickHandler.bind(this, 'onehour')}>1 HOUR</div>
        <div className={freeclasses} onClick={this.props.clickHandler.bind(this, 'free')}>FREE</div>
        <div className={noparkingclasses} onClick={this.props.clickHandler.bind(this, 'noparking')}>NO PARKING</div>
      </div>
    )
  }

}