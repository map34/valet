import blobStream from 'blob-stream';
import classNames from 'classnames';
import React from 'react';
import PDFKit from 'pdfkit';
import PropTypes from 'prop-types';
import SVGtoPDF from 'svg-to-pdfkit';
import computedToInline from 'computed-style-to-inline-style';

// fonts
import leagueGothicRegular from '../public/fonts/leaguegothic-regular-webfont.ttf';
import overpassBold from '../public/fonts/overpass_bold-webfont.ttf';

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

const registerFont = (doc, fontName, fontPath) => new Promise((resolve, reject) => {
  /*
    Register all the fonts needed in the PDF
    Converts all the font contents asynchronously
    to array buffers to be used by PDFKits registration tool.
  */
  const oReq = new XMLHttpRequest();
  oReq.open('GET', fontPath, true);
  oReq.responseType = 'arraybuffer';

  oReq.onload = () => {
    const arrayBuffer = oReq.response; // Note: not oReq.responseText

    if (arrayBuffer) {
      doc.registerFont(fontName, arrayBuffer);
    }
    resolve();
  };

  if (typeof oReq.onerror === 'function') {
    oReq.onerror(err => reject(err));
  }

  oReq.send(null);
});

const registerFonts = doc => [
  registerFont(doc, 'league_gothicregular', leagueGothicRegular),
  registerFont(doc, 'overpassbold', overpassBold)
];

const prepareSvgForPdfExport = (svg) => {
  /*
    Appends necessary styling information to the svg.
    Computes the CSS properties to in-line styles recursively.
    Note: the bottleneck of this function is the recursive
    computation.
  */
  const getdefs = document.getElementById('defssvg').cloneNode([true]);
  svg.appendChild(getdefs);
  computedToInline(svg, { recursive: true });
};

const createPdf = (svg, fileName) => {
  const pdfDoc = new PDFKit({ compress: true });

  Promise.all(registerFonts(pdfDoc)).then(() => {
    prepareSvgForPdfExport(svg);
    const svgAsText = new XMLSerializer().serializeToString(svg);

    SVGtoPDF(pdfDoc, svgAsText, 0, 0, {
      fontCallback: (...args) => {
        const fontFamilies = args[0].split(',');
        return fontFamilies[0].trim();
      }
    });

    const stream = pdfDoc.pipe(blobStream());
    stream.on('finish', () => {
      const blobUrl = stream.toBlobURL('application/pdf');
      savePdf(blobUrl, fileName);
    });
    pdfDoc.end();
  }).catch(err => console.error(err));
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
    <button className={buttonClass} onClick={event => clickHandler(event, svg, fileName)}>
    Download<br />.PDF
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
