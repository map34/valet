import blobStream from 'blob-stream';
import classNames from 'classnames';
import React from 'react';
import PDFKit from 'pdfkit';
import PropTypes from 'prop-types';
import SVGtoPDF from 'svg-to-pdfkit';
import computedToInline from 'computed-style-to-inline-style';

// export default class PdfExporter extends React.Component {

// }
const savePdf = (blobUrl, fileName) => {
  // Create artificial a tag
  const aElement = document.createElement('a');
  document.body.appendChild(aElement);
  aElement.style = 'display: none';
  aElement.href = blobUrl;
  aElement.download = fileName;
  aElement.click();
  window.URL.revokeObjectURL(blobUrl);
  aElement.parentNode.removeChild(aElement);
};

const createPdf = (svg, fileName) => {
  const getdefs = document.getElementById('defssvg');
  // const pattern = document.getElementById('pattern-stripe');
  // const mask = document.getElementById('mask-stripe');
  // const fonts = document.getElementById('fonts');
  // getdefs.appendChild(pattern);
  // getdefs.appendChild(mask);
  // getdefs.appendChild(fonts);
  console.log(getdefs);
  debugger;

  svg.appendChild(getdefs);
  computedToInline(svg, { recursive: true });

  const pdfDoc = new PDFKit({ compress: true });
  SVGtoPDF(pdfDoc, svg.outerHTML, 0, 0);

  const stream = pdfDoc.pipe(blobStream());
  stream.on('finish', () => {
    const blobUrl = stream.toBlobURL('application/pdf');
    savePdf(blobUrl, fileName);
  });
  pdfDoc.end();
};

const clickHandler = (event, svg, fileName) => {
  event.preventDefault();
  createPdf(svg, fileName);
};

const PdfExporter = (props) => {
  const { fileName } = props;
  const { svg } = props;

  const buttonClass = classNames('btnpdf', 'btn-active', 'btn-avail');

  return (
    <button
      className={buttonClass}
      onClick={event => clickHandler(event, svg, fileName)} >
    Download<br/>.PDF
    </button>
  );
};

PdfExporter.propTypes = {
  fileName: PropTypes.string,
  svg: PropTypes.element
};

// Same approach for defaultProps too
PdfExporter.defaultProps = {
  fileName: '',
  svg: null
};

export default PdfExporter;



