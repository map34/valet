import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

export default class ModePicker extends React.Component {
  constructor(props) {
    super(props);
    this.clickHandler = this.props.clickHandler.bind(this);
    this.selectHandler = this.props.selectHandler.bind(this);
  }

  render() {
    const onehrclasses = classNames('btn', 'btn-avail', {
      'btn-active': this.props.selected === 'onehour'
    });
    const freeclasses = classNames('btn', 'btn-avail', {
      'btn-active': this.props.selected === 'free'
    });
    const noparkingclasses = classNames('btn', 'btn-noparking', {
      'btn-active': this.props.selected === 'noparking'
    });

    return (
      <div className="mode-picker">
        <div className={onehrclasses} onClick={() => this.clickHandler('onehour')} role="presentation">
          <select ref={() => {}} onChange={this.selectHandler}>
            {[...Array(10).keys()].map((num) => {
              const realNum = num + 1;
              return <option val={`${realNum}`}>{realNum}</option>;
            })}
          </select>
          HOUR
        </div>
        <div className={freeclasses} onClick={() => this.clickHandler('free')} role="presentation">FREE</div>
        <div className={noparkingclasses} onClick={() => this.clickHandler('noparking')} role="presentation">NO PARKING</div>
      </div>
    );
  }
}

ModePicker.propTypes = {
  selected: PropTypes.string,
  clickHandler: PropTypes.func,
  selectHandler: PropTypes.func
};

ModePicker.defaultProps = {
  selected: '',
  clickHandler() { },
  selectHandler() { }
};
