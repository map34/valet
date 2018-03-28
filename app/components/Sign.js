import d3 from 'd3';
import jQuery from 'jquery';
import _ from 'lodash';
import toHuman from '../helpers/toHuman';

const abbreviations = {
    'Mon': {
      2: 'M',
      3: 'Mon'
    },
    'Tue': {
      2: 'Tu',
      3: 'Tue'
    },
    'Wed': {
      2: 'W',
      3: 'Wed'
    },
    'Thu': {
      2: 'Th',
      3: 'Thu'
    },
    'Fri': {
      2: 'F',
      3: 'Fri'
    },
    'Sat': {
      2: 'Sa',
      3: 'Sat'
    },
    'Sun': {
      2: 'Su',
      3: 'Sun'
    }
  };

const totalRows = 24;
const headerHeight = 100;
const margin = 100;
const actual_margin = 15;
const actual_border = 7;
const boxBottomMargin = 10;
const width = 400;
// const height = 570;

export default class Sign {
  constructor() {
    this.svg = d3.select('#sign');
  }

  getSvg() {
    return this.svg ? this.svg[0][0] : null;
  }

  _calculateBounds(data) {
    //this.width = parseFloat(jQuery(window).width()) / 2  - 20;
    this.width = width;
    this.innerWidth = this.width - (actual_margin * 2) - (actual_border * 2);
    // this.innerWidth = this.width - (margin * 1.5);
    //this.height = parseFloat(jQuery(window).height());
    var parentDiv = document.getElementById("signcontainer");
    this.height = parentDiv.clientHeight - (actual_margin * 2) - (actual_border * 2) - 4;
    // this.height = height;
    this.innerHeight = this.height - headerHeight - actual_margin;
    this.timeHeight = 0;
    if (d3.select('text.dayheader').node()) {
      this.timeHeight = d3.select('text.dayheader').node().getBBox().height + 20;
    }
    this.innerHeight -= this.timeHeight;

    this.colWidth = ((this.innerWidth) - (actual_margin * 2) - (actual_border * 2) - 4) / (data.headers.length + 1.25);
    this.rowHeight = (this.innerHeight) / totalRows;
  }

  render(data) {
    this._calculateBounds(data);

    document.getElementById('svg').remove();
    this.svg = d3.select('#sign')
      .append('svg')
      .attr({
        id: 'svg',
        width: this.width,
        height: this.height
      });

    this.mainHeader();
    this.dayHeaders(data);
    this.drawTimeRects(data);
    this.drawTimeRectLabels(data);
    this.labelTimeSlots(data);
  }

  mainHeader() {
    this.svg.append('rect')
       .attr({
        'fill': 'black',
        'x': 0,
        'y': 0,
        'rx': 20,
        'ry': 20,
        'width': this.innerWidth,
        'height': headerHeight
       });
    this.svg.append('rect')
      .attr({
        'fill': 'black',
        'x': 0,
        'y': headerHeight / 2,
        'width': this.innerWidth,
        'height': headerHeight / 2
      });
    this.svg.append('text')
       .text('PARKING SCHEDULE')
       .attr('class', 'h1')
       .attr('x', (d) => {
        return this.innerWidth / 2
       })
       .attr('y', 72)
       .attr('fill', 'white')
  }


  dayHeaders(data) {
    let { headers } = data;

    headers = _.map(headers, (header) => {
      if (header.length === 1) {
        return abbreviations[header[0]][3];
      } else {
        return abbreviations[header[0]][2] + '-' + abbreviations[header[header.length-1]][2];
      }
      return `${abbreviations[header[0]][2]} - ${abbreviations[header[header.length - 1]][2]}`;
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
        return (i * this.colWidth) + (this.colWidth * .5) + margin - 3;
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

  drawTimeRects(data) {
    let rects = this._createRectData(data);
    let rectNodes = this.svg.selectAll('rect.blocks')
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
              if (d.noParking === 'noparking'){
                top += 2;
              }
              return top;
            })
            .attr('x', (d) => {
              if (d.noParking === 'noparking'){
                return d.col * this.colWidth + margin + 2;
              } else {
                return d.col * this.colWidth + margin;
              }
            })
            .attr('width', (d) => {
              if (d.noParking === 'noparking'){
                return this.colWidth - 5 - 5;
              } else {
                return this.colWidth - 5;
              }
            })
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
                return '#a6192e';
              } else {
                return '#006747';
              }
            })
            .attr('class', (d) => {
              if (d.noParking == 'noparking'){
                return 'noparking';
              }
            })
            .attr('stroke-width', (d) => {
              if (d.noParking == 'noparking'){
                return 6;
              } else {
                return 0;
              }
            })
            .attr('stroke', (d) => {
              if (d.noParking == 'noparking'){
                return '#a6192e';
                //return '#ec1c24';
              } else {
                return 'transparent';
              }
            })

      _.each(rectNodes, this._drawP);
  }

  // _drawP(elem) {
  //   console.log('elem', elem);
  //   debugger;
  //   elem.append('circle')
  //       .attr({
  //         cx: 50,
  //         cy: 50,
  //         r: 45,
  //         fill: none,
  //         stroke: '#ffffff',
  //         'stroke-width': 10
  //       });
  //   elem.append('line')
  //       .attr({
  //         x1: 20,
  //         y1: 20,
  //         x2: 80,
  //         y2: 80,
  //         stroke: '#ffffff',
  //         'stroke-width': 10
  //       })
  //       // <text x="53" y="80" text-anchor="middle" fill="#000" style="font-size: 80px">P</text>
  // }

  drawTimeRectLabels(data) {
    let rects = this._createRectData(data);
    this.svg.selectAll('text.block-label')
        .data(rects)
        .enter()
        .append('text')
        .attr('class', 'block-label')
        .attr('y', (d) => {
          let top = headerHeight + this.timeHeight;
          if (d.row > 0){
            let prev = _.find(rects, (rect) => {
              return rect.row === d.row - 1 && rect.col === d.col;
            });
            top += (prev.end) * this._getRowHeightForCol(d.col, rects);
          }
          return top + 30;
        })
        .attr('x', (d) => {
          return (d.col * this.colWidth) + margin + (this.colWidth / 2) - 3
        })
        .text((d) => {
          let label = '';
          if (!d.noParking){
            label = 'FREE';
          } else if (d.noParking.indexOf('onehour') !== -1) {
            label = d.noParking.replace('-onehour','') + ' HR';
          }
          return label;
        })
  }

  labelTimeSlots(data) {
    let rects = this._createRectData(data);
    let timeSlots = _.uniq(_.map(rects, (rect) => { return rect.start }));
    if (timeSlots[0] === 0){
      timeSlots.shift()
    }
    // this.svg.append('text').text('12 am').attr({
    //   x: 60,
    //   y: headerHeight + this.rowHeight + 10,
    //   'font-size': '18px',
    //   fill: 'black'
    // });
    this.svg.selectAll('text.times')
            .data(timeSlots)
            .enter()
            .append('text')
            .text((d) => {
             return toHuman(d);
            })
            .attr('x', 60)
            .attr('y', (d) => {
             return (d * this.rowHeight) + headerHeight + 45;
            })
            .attr('font-size', '18px')
            .attr('fill', 'black');
  }
}
