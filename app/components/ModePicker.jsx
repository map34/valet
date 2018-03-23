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
        <div className={onehrclasses} onClick={this.props.clickHandler.bind(this, 'onehour')}>
          <select ref="slotduration" onChange={this.props.selectHandler.bind(this)}>
            <option val="1">1</option>
            <option val="2">2</option>
            <option val="3">3</option>
            <option val="4">4</option>
            <option val="5">5</option>
            <option val="6">6</option>
            <option val="7">7</option>
            <option val="8">8</option>
            <option val="9">9</option>
          </select>
          HOUR
        </div>
        <div className={freeclasses} onClick={this.props.clickHandler.bind(this, 'free')}>FREE</div>
        <div className={noparkingclasses} onClick={this.props.clickHandler.bind(this, 'noparking')}>NO PARKING</div>
      </div>
    )
  }

}