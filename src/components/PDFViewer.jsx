import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFViewer = ({ path, scale }) => {
    console.log('path', path);

    const [numPages, setNumPages] = useState(0);

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
    };

    const onDocumentError = (error) => {
        console.error('pdf viewer error', error);
    };

    const onDocumentLocked = () => {
        console.error('pdf locked');
    };

    return (
        <div>
            <Document
                // className={styles.doc}
                file={path}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentError}
                onPassword={onDocumentLocked}
            >
                {Array.from(new Array(numPages), (_, index) => {
                    return (
                        <Page
                            key={`page_${index + 1}`}
                            // className={styles.page}
                            pageNumber={index + 1}
                            width={700}
                            renderAnnotationLayer={false}
                            scale={scale}
                            renderTextLayer={false}
                        />
                    );
                })}
            </Document>
        </div>
    );
};

export default PDFViewer;
