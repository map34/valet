import React from 'react';
import _ from 'lodash';

import ModePicker from './ModePicker';
import Header from './Header';
import Cell from './Cell';
import Sign from './Sign';
import PdfExporter from './PdfExporter';

const mergeRows = (col) => {
  const times = _.map(_.keys(col), (key) => {
    return parseFloat(key)
  }).sort((a, b) => a - b);

  const timeBlocks = [];
  const result = {};
  timeBlocks.push(times[0]);

  for (let i = 1; i < times.length; i += 1) {
    if (!_.isEqual(col[times[i]], col[times[i - 1]])) {
      timeBlocks.push(times[i]);
    }
  }

  for (let i = 0; i < timeBlocks.length; i += 1) {
    result[timeBlocks[i]] = col[timeBlocks[i]];
  }

  return result;
};

export default class App extends React.Component {
  constructor(props) {
    super(props);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const times = [];
    const cells = {};

    for (let i = 0; i <= 24; i += 0.5) {
      times.push(i);
    }

    days.forEach((day) => {
      if (!cells[day]) {
        cells[day] = {};
      }
      times.forEach((time) => {
        cells[day][time] = false;
      });
    });

    this.state = {
      days,
      times,
      cells,
      mode: 'noparking',
      update: false,
      timelength: '1'
    };

    this.Sign = new Sign();
  }

  componentDidMount() {
    window.addEventListener('resize', this._handleResize);
    window.addEventListener('blur', () => {
      this.setState({
        down: false
      });
    });
  }

  _modeClickHandler = (e) => {
    this.setState({
      mode: e
    });
  }

  _selectHandler = (e) => {
    this.setState({
      timelength: e.target.value
    });
  }

  _handleResize = () => {
    this.setState({
      update: !this.state.update
    });
  }

  _handler = (day, hour, e) => {
    if (e.type === 'mousedown') {
      this.setState({
        down: true
      });
    }

    if (e.type === 'mouseup') {
      this.setState({
        down: false
      });
    }

    if (this.state.down || e.type === 'mousedown') {
      const newCells = Object.assign({}, this.state.cells);
      if (this.state.mode === 'onehour') {
        newCells[day][hour] = `${this.state.timelength} - ${this.state.mode}`;
      } else if (this.state.mode === 'free') {
        newCells[day][hour] = false;
      } else {
        newCells[day][hour] = 'noparking';
      }

      this.setState({
        cells: newCells
      });
      this._mergeSchedule();
    }
  };

  _mergeSchedule  = () => {
    const newCells = Object.assign({}, this.state.cells);
    const { days } = this.state;
    const cols = [];
    const colsHeaders = [];
    cols.push(newCells[days[0]]);
    colsHeaders.push([days[0]]);

    for (let i = 1; i < days.length; i += 1) {
      if ( _.isEqual(newCells[days[i]], cols[cols.length - 1])) {
        colsHeaders[cols.length - 1].push(days[i]);
      } else {
        cols.push(newCells[days[i]]);
        colsHeaders.push([days[i]]);
      }
    }

    const colsMerged = [];

    for (let i = 0; i < cols.length; i += 1) {
      colsMerged[i] = mergeRows(cols[i]);
    }

    this.setState({
      merged: {
        headers: colsHeaders,
        cols: colsMerged
      }
    });
  }

  _selectRowCol = (props) => {
    const scope = { props };
    const newCells = Object.assign({}, this.state.cells);
    if (props.kind === 'th') {
      const selected = _.filter(newCells[scope], hour => hour);
      if (selected.length === Object.keys(newCells[scope]).length) {
        _.each(newCells[scope], (hour, key) => {
          newCells[scope][key] = this.state.mode;
        });
      } else {
        _.each(newCells[scope], (hour, key) => {
          newCells[scope][key] = this.state.mode;
        });
      }
    } else {
      const selected = [];

      _.each(newCells, (day) => {
        selected.push(day[scope]);
      });

      if (_.uniq(selected).length === 1) {
        _.each(newCells, (__, i) => {
          newCells[i][scope] = this.state.mode;
        });
      } else {
        _.each(newCells, (__, i) => {
          newCells[i][scope] = this.state.mode;
        });
      }
    }

    this.setState({
      cells: newCells
    });
    this._mergeSchedule();
  }

  render() {
    const dayHeaders = this.state.days.map(day => (
      <Header
        headerClick={this._selectRowCol}
        kind="th"
        scope={day}
      />
    ));
    const timeDays = time => (this.state.days.map(day => (
      <td>
        <Cell
          day={day}
          hour={time}
          active={this.state.cells[day][time]}
          handler={this._handler}
        />
      </td>
    )));
    const timeRows = this.state.times.map(time => (
      <tr>
        <Header headerClick={this._selectRowCol} kind='td' scope={time} />
        {timeDays(time)}
      </tr>
    ));

    if (this.state.hasOwnProperty('merged')) {
      this.Sign.render(this.state.merged);
    }

    return (
      <div>
        <ModePicker selected={this.state.mode} clickHandler={this._modeClickHandler} selectHandler={this._selectHandler}/>
        <table>
          <thead>
            <tr>
              <th />
              {dayHeaders}
            </tr>
          </thead>
          <tbody>
            {timeRows}
          </tbody>
        </table>
      </div>
    );
  }
}
