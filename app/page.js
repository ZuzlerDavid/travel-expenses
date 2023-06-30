"use client"



import { jsPDF } from "jspdf";

import './Home.css';
import React, { useReducer, useState, useRef } from 'react';


const formReducer = (state, event) => {
  return {
    ...state,
    [event.name]: event.value
  }

}
function Fieldset({ handleChange, counter = 1 }) {
  return (
    <fieldset className="expenses">
      <label className="expense-type-input">
        <p></p>
        <input className="input-expense-type" name={`expense-${counter}`} onChange={handleChange} />
      </label>
      <label className="expense-amount-input">
        <input className="input-money" type="number" name={`amount-${counter}`} onChange={handleChange} step="00.01" /> <strong>€</strong>
      </label>
    </fieldset>
  )
}
function Home() {
  const [formData, setFormData] = useReducer(formReducer, {});
  const [fullName, setFullName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const calculateTotalAmount = () => {
    const totalAmount = Object.entries(formData).reduce((sum, [key, value]) => {
      if (key.startsWith("amount-")) {
        return sum + parseFloat(value);
      }
      return sum;
    }, 0);

    return totalAmount.toFixed(2);
  }

  const handleSubmit = event => {
    event.preventDefault();
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
    }, 3000)

    // Default export is a4 paper, portrait, using millimeters for units
    const doc = new jsPDF();

    doc.setFont("monospace", "normal", 600);
    doc.setFontSize(20);
    doc.text("Travel Expenses", 10, 10);
    doc.setFontSize(14);
    doc.text(fullName, 200, 10, { align: "right" });


    doc.setFontSize(14);
    const rowsToPrint = new Array(Math.floor(Object.values(formData).length / 2)).fill('');

    let offset = 0;
    rowsToPrint.forEach((_, idx) => {
      offset = 10 * (idx + 1);
      const expenseValue = formData["expense-" + idx];
      const expenseAmount = formData["amount-" + idx];

      doc.text(`${expenseValue}`, 65, offset + 20)
      doc.text("Expense Type", 65, 23);
      doc.text(`${expenseAmount}` + '€', 145, offset + 20, { align: "right" });
      doc.text("Amount", 145, 23, { align: "right" });

      doc.line(65, offset + 21, 147, offset + 21);
      doc.line(105, 20, 105, offset + 21);

    })
    doc.line(68, 25, 147, 25);
    doc.text(`Total Amount: ${calculateTotalAmount()} €`, 145, offset + 26, {align: "right"});
    doc.line(65,offset + 27, 147,offset + 27);
    doc.save("Travel expenses.pdf");
  }



  const handleChange = event => {
    setFormData({
      name: event.target.name,
      value: event.target.value,
    });
  }
  const rows = new Array(1 + Math.floor(Object.values(formData).length / 2)).fill('');



  const inputRef = useRef(null);

  const handleInputResize = () => {
    if (inputRef.current) {
      inputRef.current.style.width = `${Math.max(5, inputRef.current.value.length)}ch`;
    }
  };

  const handleNameInput = () => {
    handleInputResize();
    if (inputRef.current) {
      setFullName(inputRef.current.value)
    }
  }

  return (

    <div className="wrapper">

      <h1 className="headline">Travel expenses</h1>


      <label>
        <input ref={inputRef} className="name-input" name={`name`} onChange={handleNameInput} />
      </label>

      {submitting &&
        <div>You spend something for the following:
          <ul>
            {Object.entries(formData).map(([name, value]) => (
              <li key={name}><strong>{name}</strong>:{value.toString()}</li>
            ))}
          </ul>
        </div>
      }
      <h2 className="subline">Money spent for:</h2>

      <form onSubmit={handleSubmit}>

        {/*
          <p>
            {formData["expense-" + counter]} - {formData["amount-" + counter]}
          </p>
        */}
        {rows.map((_, counter) => (
          <div key={counter}>
            <Fieldset handleChange={handleChange} counter={counter} />
          </div>
        ))}

        <button type="submit" className="send-button">PDF</button>
        <pre>{JSON.stringify({ formData, fullName, totalAmount: calculateTotalAmount() })}</pre>

      </form>
    </div>

  )
}

export default Home;