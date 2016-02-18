import React from 'react';

export default class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.kind == 'th'){
      return (
        <th onClick={this._headerClick}>{this.props.scope}</th>
      );
    } else {
      return (
        <td onClick={this._headerClick}>{this._toHuman(this.props.scope)}</td>
      );
    }
  }

  _toHuman = (timeInDecimal) => {
    let hour = '';
    let min = '';

    if (timeInDecimal >= 13){
      hour = (Math.floor(timeInDecimal) - 12).toString();
    } else {
      hour = (Math.floor(timeInDecimal)).toString();
    }

    if (timeInDecimal.toString().indexOf('.5') !== -1) {
      min = '30';
    } else {
      min = '00';
    }

    return hour + ':' + min;
  };

  _headerClick = () => {
    console.log('here');
    this.props.headerClick(this.props)
  };
}