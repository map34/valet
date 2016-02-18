/* converts float time, ex. 13.5 to human time, ex. 1:30pm */
export default (timeInDecimal) => {
  let hour = '';
  let min = '';
  let marker = 'am';

  if (timeInDecimal >= 13){
    hour = (Math.floor(timeInDecimal) - 12).toString();
    marker = 'pm';
  } else if (timeInDecimal < 1){
    hour = 12;
  } else {
    hour = (Math.floor(timeInDecimal)).toString();
  }


  if (timeInDecimal.toString().indexOf('.5') !== -1) {
    min = '30';
  } else {
    min = '00';
  }
  return hour + ':' + min + ' ' + marker;
};
