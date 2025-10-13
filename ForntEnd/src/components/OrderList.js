import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import moment from 'moment';

const OrderList = ({ userId }) => {
  // const [orders, setOrders] = useState([]);
  const [checkoutDetails, setCheckoutDetails] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCheckoutDetails = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          navigate('/'); 
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser._id;

        setLoading(true);
        const response = await axios.get(`https://pharmacy-management-7t8g.onrender.com/checkout/${userId}`);
        setCheckoutDetails(response.data);

        const fetchUserData = () => {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            navigate('/'); 
          }
        };

        fetchUserData();
        setLoading(false);
      } catch (error) {
        console.error('Error fetching checkout details:', error);
        setError('Failed to fetch checkout details.');
        setLoading(false);
      }
    };

    fetchCheckoutDetails();
  }, [navigate]);

  const generateInvoice = (order) => {
    const doc = new jsPDF();

    const storeName = "Medical Store";
    const storeAddress = "123 Pharmacy Lane, City, Country";
    const storePhone = "(123) 456-7890";

    const userName = user.username;
    const userEmail = user.email;
    const userPhone = user.phone;

    const { invoiceNumber, items, totalPrice, createdAt } = order;
    const checkoutDate = moment(createdAt).format("MMMM Do YYYY, h:mm:ss a");

    doc.setFontSize(16);
    doc.text(storeName, 105, 20, null, null, 'center');
    doc.setFontSize(12);
    doc.text(storeAddress, 105, 30, null, null, 'center');
    doc.text(storePhone, 105, 35, null, null, 'center');
    doc.text(`Invoice Number: #${invoiceNumber}`, 105, 45, null, null, 'center');
    doc.text(`Date: ${checkoutDate}`, 105, 50, null, null, 'center');

    doc.setFontSize(12);
    doc.text(`Customer Name: ${userName}`, 20, 65);
    doc.text(`Customer Email: ${userEmail}`, 20, 75);
    doc.text(`Customer Phone: ${userPhone}`, 20, 85);

    doc.setLineWidth(0.5);
    doc.line(20, 90, 190, 90);

    doc.setFontSize(12);
    doc.text("Item", 20, 100);
    doc.text("Price", 140, 100);
    doc.text("Qty", 100, 100);
    doc.text("Total", 180, 100);

    let yOffset = 110;
    items.forEach(item => {
      doc.text(item.name, 20, yOffset);
      doc.text(item.quantity.toString(), 100, yOffset);
      doc.text(`$${item.price.toFixed(2)}`, 140, yOffset);
      doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 180, yOffset); 
      yOffset += 10;
    });

    doc.setLineWidth(0.5);
    doc.line(20, yOffset + 5, 190, yOffset + 5);

    doc.setFontSize(14);
    doc.text(`Total Amount: $${totalPrice.toFixed(2)}`, 105, yOffset + 15, null, null, 'center');

    doc.setFontSize(10);
    doc.text("Thank you for your purchase!", 105, yOffset + 30, null, null, 'center');

    const pdfDataUrl = doc.output('datauristring');
    const newTab = window.open();
    newTab.document.write(`<iframe src="${pdfDataUrl}" width="100%" height="100%" style="border: none;"></iframe>`);
    newTab.document.title = `Invoice #${invoiceNumber}`;

    const downloadButton = newTab.document.createElement('button');
    downloadButton.innerText = 'Download Invoice';
    downloadButton.style.position = 'absolute';
    downloadButton.style.top = '20px';
    downloadButton.style.left = '20px';
    downloadButton.onclick = () => {
      doc.save(`Invoice_${invoiceNumber}.pdf`);
    };
    newTab.document.body.appendChild(downloadButton);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Your Orders</Typography>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice Number</TableCell>
                <TableCell>Items Count</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {checkoutDetails.map((order) => (
                <TableRow key={order.invoiceNumber}>
                  <TableCell>{order.invoiceNumber}</TableCell>
                  <TableCell>{order.items.length}</TableCell>
                  <TableCell>${order.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button 
                      onClick={() => generateInvoice(order)} 
                      variant="outlined"
                      color="primary"
                    >
                      View Invoice
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default OrderList;
