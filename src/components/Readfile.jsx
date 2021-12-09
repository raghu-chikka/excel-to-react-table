import Button from "react-bootstrap/Button";
import React, { useRef, useState } from "react";
import Table from "react-bootstrap/Table";
import XLSX from "xlsx";
import { PDFExport } from "@progress/kendo-react-pdf";

const Readfile = () => {
  const [sheetitems, setSheetitems] = useState([]);

  const readExcelFile = (file) => {
    const promise = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsArrayBuffer(file);
      fileReader.onload = (e) => {
        const bufferArray = e.target.result;
        const workBook = XLSX.read(bufferArray, { type: "buffer" });
        const worksheetname = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[worksheetname];
        const data = XLSX.utils.sheet_to_json(workSheet);
        resolve(data);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    promise.then((data) => {
      setSheetitems(data);
    });
  };

  const pdfExportComponent = useRef(null);
  const generatePDF = (event) => {
    pdfExportComponent.current.save();
  };

  return (
    <>
      <div className="container">
        <div className="inputFile">
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            readExcelFile(file);
          }}
        />
        </div>
      </div>
      <div id="tableContent">
        <PDFExport ref={pdfExportComponent} scale={0.4}
        paperSize="A4"
        margin="0.4cm">
          <Table className="tableStyle" striped bordered hover size="sx">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Invoice Date</th>
                <th>Product Name</th>
                <th>Packing</th>
                <th>Actual Rate</th>
                <th>Quantity</th>
                <th>Product Value</th>
              </tr>
            </thead>
            <tbody>
              {sheetitems.map((newitem, index) => {
                return (
                  <tr key={index}>
                    <td>{newitem.C}</td>
                    <td>{newitem.D}</td>
                    <td>{newitem.F}</td>
                    <td>{newitem.G}</td>
                    <td>{newitem.O}</td>
                    <td>{parseFloat(newitem.U)}</td>
                    <td>{parseFloat(newitem.U * newitem.O).toFixed(4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </PDFExport>
        <div className="button">
          <Button
            variant="outline-success"
            onClick={generatePDF}
            type="primary"
          >
            Save to PDF
          </Button>
        </div>
      </div>
    </>
  );
};

export default Readfile;
