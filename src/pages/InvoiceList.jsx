import React, { useState } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { BiSolidPencil, BiTrash } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import InvoiceModal from "../components/InvoiceModal";
import { useNavigate } from "react-router-dom";
import { useInvoiceListData } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { deleteInvoice } from "../redux/invoicesSlice";
import InputGroup from 'react-bootstrap/InputGroup';

const InvoiceList = () => {
  const dispatch = useDispatch();
  const { invoiceList, getOneInvoice, getMultipleInvoices } = useInvoiceListData();
  const isListEmpty = invoiceList.length === 0;
  const [copyId, setCopyId] = useState("");
  const navigate = useNavigate();
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [checkAll, setCheckAll] = useState(false);


  const handleCopyClick = () => {
    const invoice = getOneInvoice(copyId);
    if (!invoice) {
      alert("Please enter the valid invoice id.");
    } else {
      navigate(`/create/${copyId}`);
    }
  };
  const handleMultiEdit = () => {
  if (selectedInvoices.length <2) {
    alert("Please select at least two invoice for bulk edit. 😓");
  } else {
    const invoices = getMultipleInvoices(selectedInvoices);
    //console.log(invoices);

      if(!invoices){
        alert("Unknown error")
      }
      else{
        const invoiceIds = invoices.map((invoice) => invoice.id);
        const idsString = invoiceIds.join(",");
        navigate(`/multiEdit/${idsString}`);
      }
    console.log("Selected Invoices for Multi-Edit:", selectedInvoices.length);
  }  
  };
  
  const handleCheckAll = () => {
    setCheckAll(prev => !prev);
    invoiceList.forEach(invoice => {
      handleCheckboxChange(!checkAll, invoice.id);
    });
  };
  

  const handleDeleteAll = () => {
    invoiceList.forEach((invoice) => {
      if (selectedInvoices.includes(invoice.id)) {
        dispatch(deleteInvoice(invoice.id));
      }
    });
  };
  

  const handleCheckboxChange  = (e,invoiceId) => {
    let isSelected = e;

    if(isSelected){
      setSelectedInvoices(prev => {
        if (!prev.includes(invoiceId)) {
          return [...prev, invoiceId];
        }
        else return prev;
      });
    }
    else{    
    setSelectedInvoices(prev => {
        return prev.filter(id => id !== invoiceId);  
      } 
      )}

      console.log(selectedInvoices);
  };

  return (
    <Row>
      <Col className="mx-auto" xs={12} md={8} lg={9}>
        <h3 className="fw-bold pb-2 pb-md-4 text-center">Swipe Assignment</h3>
        <Card className="d-flex p-3 p-md-4 my-3 my-md-4 ">
          {isListEmpty ? (
            <div className="d-flex flex-column align-items-center">
              <h3 className="fw-bold pb-2 pb-md-4">No invoices present</h3>
              <Link to="/create">
                <Button variant="primary">Create Invoice</Button>
              </Link>
            </div>
          ) : (
            <div className="d-flex flex-column">
              <div className="d-flex flex-row align-items-center justify-content-between">
                <h3 className="fw-bold pb-2 pb-md-4">Invoice List</h3>
                <Link to="/create">
                  <Button variant="primary mb-2 mb-md-4">Create Invoice</Button>
                </Link>

                <div className="d-flex gap-2">
                  <Button
                    variant="primary mb-2 mb-md-4"
                    onClick={handleMultiEdit}
                  >
                    Mult-Edit
                  </Button>
                  <h6 className=" pt-3 " style={{ color: "gray" }}>
                    {" "}
                    {selectedInvoices.length} selected
                  </h6>
                </div>

                <div className="d-flex gap-2">
                  <Button variant="dark mb-2 mb-md-4" onClick={handleCopyClick}>
                    Copy Invoice
                  </Button>

                  <input
                    type="text"
                    value={copyId}
                    onChange={(e) => setCopyId(e.target.value)}
                    placeholder="Enter Invoice ID to copy"
                    className="bg-white border"
                    style={{
                      height: "50px",
                    }}
                  />
                </div>
              </div>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Invoice No.</th>
                    <th>Bill To</th>
                    <th>Due Date</th>
                    <th>Total Amt.</th>
                    <th>Actions</th>
                    <th style={{ width: "5%",  }}>
                      <Button
                        variant="primary"
                        onClick={handleCheckAll}
                        style={{marginLeft:10}}
                      >
                        <div className="d-flex align-items-center justify-content-center gap-2">SelectAll</div>
                      </Button>
                    </th>
                    <th style={{ width: "5%" }}>
                      <Button
                        variant="danger"
                        onClick={handleDeleteAll}
                      >
                        <div className="d-flex align-items-center justify-content-center gap-2">DeleteSelected</div>
                      </Button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceList.map((invoice) => (
                    <InvoiceRow
                      key={invoice.id}
                      invoice={invoice}
                      navigate={navigate}
                      onCheckboxChange={handleCheckboxChange}
                      selectedInvoices={selectedInvoices}
                      checkAll ={checkAll}
                      invoiceList={invoiceList}
                    />
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card>
      </Col>
    </Row>
  );
};

const InvoiceRow = ({ invoice, navigate, onCheckboxChange, selectedInvoices, }) => {
  const [isOpen, setIsOpen] = useState(false);

  function handleChange(e) {
    
    onCheckboxChange(e.target.checked, invoice.id) 
  }
  const dispatch = useDispatch();

  const handleDeleteClick = (invoiceId) => {
    dispatch(deleteInvoice(invoiceId));
  };


  const handleEditClick = () => {
    navigate(`/edit/${invoice.id}`);
  };

  const openModal = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <tr>
      <td>{invoice.invoiceNumber}</td>
      <td className="fw-normal">{invoice.billTo}</td>
      <td className="fw-normal">{invoice.dateOfIssue}</td>
      <td className="fw-normal">
        {invoice.currency}
        {invoice.total}
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="outline-primary" onClick={handleEditClick}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiSolidPencil />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="danger" onClick={() => handleDeleteClick(invoice.id)}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiTrash />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="secondary" onClick={openModal}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BsEyeFill />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        
      <InputGroup className="mb-2">
        <InputGroup.Checkbox 
        aria-label="Checkbox for invoice"
        checked={selectedInvoices.includes(invoice.id)}
        onChange={handleChange}
        id = {invoice.id} />
      </InputGroup>
      </td>
      <InvoiceModal
        showModal={isOpen}
        closeModal={closeModal}
        info={{
          isOpen,
          id: invoice.id,
          currency: invoice.currency,
          currentDate: invoice.currentDate,
          invoiceNumber: invoice.invoiceNumber,
          dateOfIssue: invoice.dateOfIssue,
          billTo: invoice.billTo,
          billToEmail: invoice.billToEmail,
          billToAddress: invoice.billToAddress,
          billFrom: invoice.billFrom,
          billFromEmail: invoice.billFromEmail,
          billFromAddress: invoice.billFromAddress,
          notes: invoice.notes,
          total: invoice.total,
          subTotal: invoice.subTotal,
          taxRate: invoice.taxRate,
          taxAmount: invoice.taxAmount,
          discountRate: invoice.discountRate,
          discountAmount: invoice.discountAmount,
        }}
        items={invoice.items}
        currency={invoice.currency}
        subTotal={invoice.subTotal}
        taxAmount={invoice.taxAmount}
        discountAmount={invoice.discountAmount}
        total={invoice.total}
      />
    </tr>
  );
};

export default InvoiceList;
