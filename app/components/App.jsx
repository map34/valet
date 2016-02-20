import React from 'react';
import ModePicker from './ModePicker.jsx';
import Header from './Header.jsx';
import Cell from './Cell.jsx';
import _ from 'lodash';
import Sign from './Sign';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let times = [];
    let cells = {};

    for (let i = 0; i <= 24; i += 0.5){
      times.push(i);
    }

    days.forEach( day => {
      if (!cells.hasOwnProperty(day)){
        cells[day] = {}
      }
      times.forEach( time =>
        cells[day][time] = false
      )
    });

    this.state = {
      days: days,
      times: times,
      cells: cells,
      mode: 'noparking'
    };

    this.Sign = new Sign();
  }

  _modeClickHandler = (e) => {
    this.setState({
      mode: e
    })
  };

  render() {
    let dayHeaders = this.state.days.map( day => <Header headerClick={this._selectRowCol} kind='th' scope={day}/> );
    let timeRows = this.state.times.map( time =>
        <tr>
          <Header headerClick={this._selectRowCol} kind='td' scope={time}/>
          <td><Cell day={this.state.days[0]} hour={time} active={this.state.cells[this.state.days[0]][time]} handler={this._handler} /></td>
          <td><Cell day={this.state.days[1]} hour={time} active={this.state.cells[this.state.days[1]][time]} handler={this._handler} /></td>
          <td><Cell day={this.state.days[2]} hour={time} active={this.state.cells[this.state.days[2]][time]} handler={this._handler} /></td>
          <td><Cell day={this.state.days[3]} hour={time} active={this.state.cells[this.state.days[3]][time]} handler={this._handler} /></td>
          <td><Cell day={this.state.days[4]} hour={time} active={this.state.cells[this.state.days[4]][time]} handler={this._handler} /></td>
          <td><Cell day={this.state.days[5]} hour={time} active={this.state.cells[this.state.days[5]][time]} handler={this._handler} /></td>
          <td><Cell day={this.state.days[6]} hour={time} active={this.state.cells[this.state.days[6]][time]} handler={this._handler} /></td>
        </tr>
    );

    if (this.state.hasOwnProperty('merged')){
      this.Sign.render(this.state.merged);
    }


    return (
      <div>
        <ModePicker selected={this.state.mode} clickHandler={this._modeClickHandler}/>
        <table>
          <thead>
            <tr>
              <th></th>
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

  _handler = (day, hour) => {
    let newCells = Object.assign({}, this.state.cells);
    newCells[day][hour] = this.state.mode;
    this.setState({
      cells: newCells
    });
    this._mergeSchedule();
  };

  _mergeRows = (col) => {
    let times = _.map(_.keys(col), (key) => {
      return parseFloat(key)
    }).sort((a,b) =>{ return a - b});

    let timeBlocks = [];
    let result = {};
    timeBlocks.push(times[0]);

    for (let i = 1; i < times.length; i++){
      if (!_.isEqual(col[times[i]], col[times[i-1]])){
        timeBlocks.push(times[i]);
      }
    }

    for (let i = 0; i < timeBlocks.length; i++){
      result[timeBlocks[i]] = col[timeBlocks[i]];
    }


    return result;
  };

  _mergeSchedule = () => {
    let newCells = Object.assign({}, this.state.cells);
    let days = this.state.days;
    let cols = [];
    let colsHeaders = [];
    cols.push(newCells[days[0]]);
    colsHeaders.push([ days[0] ])

    for (let i = 1; i < days.length; i++){
      if ( _.isEqual(newCells[days[i]], cols[cols.length-1]) ){
        colsHeaders[cols.length-1].push(days[i])
      } else {
        cols.push(newCells[days[i]]);
        colsHeaders.push([days[i]]);
      }
    }

    let colsMerged = [];

    for (let i = 0; i < cols.length; i++){
      colsMerged[i] = this._mergeRows(cols[i]);
    }

    this.setState({
      merged: {
        headers: colsHeaders,
        cols: colsMerged
      }
    });
  };

  _selectRowCol = (props) => {
    let scope = props.scope;
    let newCells = Object.assign({}, this.state.cells);
    if (props.kind === 'th') {
      let selected = _.filter(newCells[scope], (hour) => {
        return hour
      })
      if (selected.length === Object.keys(newCells[scope]).length){
        _.each(newCells[scope], (hour, key) => {
          newCells[scope][key] = this.state.mode;
        })
      } else {
        _.each(newCells[scope], (hour, key) => {
          newCells[scope][key] = this.state.mode;
        })
      }
    } else {

      let selected = [];

      _.each(newCells, (day, key) => {
        selected.push(day[scope]);
      });

      if (_.uniq(selected).length === 1){
        _.each(newCells, (day, key) => {
          day[scope] = this.state.mode;
        });
      } else {
        _.each(newCells, (day, key) => {
          day[scope] = this.state.mode;
        });
      }
    }

    this.setState({
      cells: newCells
    });
    this._mergeSchedule();
  };
}