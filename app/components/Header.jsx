import React from 'react';

const toHuman = (timeInDecimal) => {
  let hour = '';
  let min = '';

  if (timeInDecimal >= 13) {
    hour = (Math.floor(timeInDecimal) - 12).toString();
  } else {
    hour = (Math.floor(timeInDecimal)).toString();
  }

  if (timeInDecimal.toString().indexOf('.5') !== -1) {
    min = '30';
  } else {
    min = '00';
  }

  return `${hour}:${min}`;
};

export default class Header extends React.Component {

  headerClick = (event) => {
    event.preventDefault();
    this.props.headerClick(this.props);
  }

  render() {
    if (this.props.kind === 'th') {
      return (
        <th onClick={this.headerClick}>{this.props.scope}</th>
      );
    }
    return (
      <td onClick={this.headerClick} role="gridcell">{toHuman(this.props.scope)}</td>
    );
  }
}
