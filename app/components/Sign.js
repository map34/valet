import d3 from 'd3';
import _ from 'lodash';
import toHuman from '../helpers/toHuman';
import jQuery from 'jquery';

const abbreviations = {
    'Monday': {
      2: 'M',
      3: 'Mon'
    },
    'Tuesday': {
      2: 'Tu',
      3: 'Tue'
    },
    'Wednesday': {
      2: 'W',
      3: 'Wed'
    },
    'Thursday': {
      2: 'Th',
      3: 'Thu'
    },
    'Friday': {
      2: 'F',
      3: 'Fri'
    },
    'Saturday': {
      2: 'Sa',
      3: 'Sat'
    },
    'Sunday': {
      2: 'Su',
      3: 'Sun'
    }
  }

const totalRows = 24;
const headerHeight = 100;
const margin = 100;
const boxBottomMargin = 10;

export default class Sign {
  constructor() {
    this.svg = d3.select('#sign');
  }

  _calculateBounds(data) {
    this.width = parseFloat(jQuery(window).width()) / 2;
    this.innerWidth = this.width - (margin * 2);
    this.height = parseFloat(jQuery(window).height());
    this.innerHeight = this.height - headerHeight - margin;
    this.timeHeight = 0;
    if (d3.select('text.dayheader').node()){
      this.timeHeight = d3.select('text.dayheader').node().getBBox().height + 20;
    }
    this.innerHeight -= this.timeHeight;

    this.colWidth = (this.innerWidth) / data.headers.length
    this.rowHeight = (this.innerHeight) / totalRows;
  };

  render(data) {
    this._calculateBounds(data);

    document.getElementById('svg').remove()
    this.svg = d3.select('#sign')
                 .append('svg')
                 .attr({
                    'id': 'svg',
                    'width': this.width,
                    'height': this.height
                  });

    this._mainHeader();
    this._dayHeaders(data);
    this._drawTimeRects(data);
    this._labelTimeSlots(data);
  }

  _mainHeader() {
    this.svg.append('rect')
       .attr({
        'fill': 'black',
        'x': 0,
        'y': 0,
        'width': this.width,
        'height': headerHeight
       })

    this.svg.append('text')
       .text('PARKING SCHEDULE')
       .attr('class', 'h1')
       .attr('x', 500)
       .attr('y', 72)
       .attr('fill', 'white')
  }


  _dayHeaders(data) {
    let headers = data.headers;

    headers = _.map( headers, (header) => {
      if (header.length === 1){
        return abbreviations[header[0]][3];
      } else {
        return abbreviations[header[0]][2] + ' - ' + abbreviations[header[header.length-1]][2];
      }
    });

    this.svg.selectAll('text.header')
       .data(headers)
       .enter()
       .append('text')
       .text(function(d){
        return d.toUpperCase();
       })
       .attr('y', () => { return headerHeight + 30} )
       .attr('x', (d, i) => {
        return (i * this.colWidth) + (this.colWidth * .5) + margin;
       })
       .attr('font-size', '18px')
       .attr('fill', 'black')
       .attr('class', 'dayheader');

    this._calculateBounds(data);
  }

  _getSortedTimes(col) {
    let keys = Object.keys(col);
    return keys.map((key) => {
      return parseFloat(key)
    }).sort((a,b) => { return a - b});
  }

  _createRectData(data) {
    let cols = data.cols;
    let rects = [];

    for (let i = 0; i < cols.length; i++) {
      let col = cols[i];
      let times = this._getSortedTimes(col);

      rects.push({
        col: i,
        row: 0,
        start: times[0],
        noParking: cols[i][times[0]]
      });

      let row = 1;
      for (let s = 1; s < times.length; s++) {
        if (cols[i][times[s]] === rects[rects.length-1].noParking){
          return;
        }
        rects[rects.length-1].end = times[s];
        rects.push({
          col: i,
          row: row,
          start: times[s],
          noParking: cols[i][times[s]]
        })
        row++;
      }
    }

    return rects;
  }

  _getRowHeightForCol(col, rects) {
    let numSpaces = _.filter(rects, (rect) => {
      return rect.col === col;
    }).length - 1;
    //return (this.innerHeight - (numSpaces * boxBottomMargin)) / totalRows;
    return (this.innerHeight / totalRows);
  }

  _drawTimeRects(data) {
    let rects = this._createRectData(data);
    this.svg.selectAll('rect.blocks')
            .data(rects)
            .enter()
            .append('rect')
            .attr('y', (d) => {
              let top = headerHeight + this.timeHeight;
              if (d.row > 0){
                let prev = _.find(rects, (rect) => {
                  return rect.row === d.row - 1 && rect.col === d.col;
                });
                top += (prev.end) * this._getRowHeightForCol(d.col, rects);
              }
              return top;
            })
            .attr('x', (d) => {
              return d.col * this.colWidth + margin
            })
            .attr('width', this.colWidth)
            .attr('height', (d) => {
              let end = 0;
              if (d.hasOwnProperty('end')){
                end = d.end;
              } else {
                end = 24;
              }
              let rows = end - d.start;
              return (this._getRowHeightForCol(d.col, rects) * rows) - boxBottomMargin;
            })
            .attr('fill', (d) => {
              if (d.noParking == 'noparking'){
                return '#ec1c24';
              } else {
                return '#00a651';
              }
            })
            .attr({
              'stroke-width': 2,
              'stroke': 'rgb(0,0,0)'
            });
  }

  _labelTimeSlots(data) {
    let rects = this._createRectData(data);
    let timeSlots = _.uniq(_.map(rects, (rect) => { return rect.start }));
    if (timeSlots[0] === 0){
      timeSlots.shift()
    }
    this.svg.selectAll('text.times')
            .data(timeSlots)
            .enter()
            .append('text')
            .text(function(d){
             return toHuman(d);
            })
            .attr('x', 60)
            .attr('y', (d) => {
             return (d * this.rowHeight) + headerHeight + 30;
            })
            .attr('font-size', '18px')
            .attr('fill', 'black')
  }
}