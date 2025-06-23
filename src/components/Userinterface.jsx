
import React, { useState } from 'react';
import './CreditCardForm.css';

const getCardType = (number) => {
  const cleaned = number.replace(/\s+/g, '');
  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'MasterCard';
  if (/^3[47]/.test(cleaned)) return 'Amex';
  return 'Unknown';
};

const formatCardNumber = (value) => {
  return value.replace(/[^0-9]/g, '').replace(/(.{4})/g, '$1 ').trim();
};

const CreditCardForm = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardType, setCardType] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    const num = cardNumber.replace(/\s/g, '');
    if (!/^\d{16}$/.test(num)) newErrors.cardNumber = 'Card number must be 16 digits';

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) newErrors.expiry = 'Invalid expiry format';
    else {
      const [month, year] = expiry.split('/');
      const now = new Date();
      const expDate = new Date(`20${year}`, month);
      if (expDate < now) newErrors.expiry = 'Card expired';
    }

    const cvvLen = cardType === 'Amex' ? 4 : 3;
    if (!new RegExp(`^\\d{${cvvLen}}$`).test(cvv)) newErrors.cvv = `CVV must be ${cvvLen} digits`;

    if (!/^[A-Za-z ]+$/.test(name)) newErrors.name = 'Name must contain only letters and spaces';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      alert('Payment Submitted!');
    }
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    setCardType(getCardType(formatted));
  };

  return (
    <form className="card-form" onSubmit={handleSubmit}>
      <h2>Credit Card Details</h2>

      <div className="form-group">
        <label>Card Number</label>
        <input
          type="text"
          value={cardNumber}
          onChange={handleCardNumberChange}
          placeholder="#### #### #### ####"
        />
        <span className="card-type">{cardType}</span>
        {errors.cardNumber && <p className="error">{errors.cardNumber}</p>}
      </div>

      <div className="form-group">
        <label>Expiry Date (MM/YY)</label>
        <input
          type="text"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          placeholder="MM/YY"
        />
        {errors.expiry && <p className="error">{errors.expiry}</p>}
      </div>

      <div className="form-group">
        <label>CVV</label>
        <input
          type="text"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          placeholder="CVV"
        />
        {errors.cvv && <p className="error">{errors.cvv}</p>}
      </div>

      <div className="form-group">
        <label>Cardholder Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="enter your name.."
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      <button type="submit">Proceed</button>
    </form>
  );
};

export default CreditCardForm;