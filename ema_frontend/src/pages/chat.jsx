import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, Container, CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const newMessage = { type: 'sent', text: input };

    // Set loading to true while waiting for response
    setLoading(true);

    // Send the message to the backend
    try {
      const response = await fetch('http://localhost:6969/queryChatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query : input }),
      });
      const data = await response.json();
      console.log(data);


      // Update messages with the sent message and the response
      setMessages((prevMessages) => [...prevMessages, newMessage, { type: 'received', text: data.answer }]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      // Clear the input field and set loading to false
      setLoading(false);
      setInput('');
    }
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <>
    <Container sx={{ display: 'flex', flexDirection: 'column', height: '90vh', padding: '0' }}>
      <Alert severity="warning">The answers given by this chatbot may not be 100% accurate and it is the duty of the user to fact check all results from it.</Alert>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
        {messages.map((message, index) => (
          <Paper
            key={index}
            sx={{
              marginBottom: 2,
              padding: 1,
              maxWidth: '70%',
              alignSelf: message.type === 'sent' ? 'flex-end' : 'flex-start',
              backgroundColor: message.type === 'sent' ? 'primary.main' : 'grey.300',
              color: message.type === 'sent' ? 'primary.contrastText' : 'text.primary',
            }}
          >
            <Typography>
              {typeof message.text === 'string' ? (
                message.text.split('<br />').map((line, lineIndex) => (
                  <div key={lineIndex}>{line}</div>
                ))
              ) : (
                message.text
              )}
            </Typography>
          </Paper>
        ))}
        {/* Loading Indicator */}
        {loading && (
          <Paper
            sx={{
              marginBottom: 2,
              padding: 1,
              maxWidth: '70%',
              alignSelf: 'flex-start',
              backgroundColor: 'grey.300',
              color: 'text.primary',
            }}
          >
            <Typography>
              <CircularProgress size={20} thickness={5} sx={{ marginRight: 1 }} />
              ...
            </Typography>
          </Paper>
        )}
      </Box>
      <Box sx={{ display: 'flex', padding: 2, borderTop: '1px solid #ddd' }}>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
        />
        <Button variant="contained" color="primary" onClick={handleSend} sx={{ marginLeft: 1 }}>
          Send
        </Button>
      </Box>
    </Container>
    <div>

    <h2>Example Queries</h2>
      <br />
      <br />
      <Accordion sx={{width: "90%", borderRadius: "32px", overflow: 'hidden'}}>
        <AccordionSummary
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            backgroundColor: "lightgray"
          }}
        >
        <Typography>Example Queries (Cick Me)</Typography>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            backgroundColor: "lightgray"
          }}>
          <Typography>
            <b>Query for End of Support Life Dates</b>&nbsp;
            - &nbsp;What is the EOS date for ____?
            <br />
            <b>Query for Vendor Managing</b>&nbsp;
            - &nbsp;Who is the vendor for ____?
            <br />
            <b>Query for list of products, where EOS dates earlier than a certain date</b>&nbsp;
            - &nbsp;For EOS dates earlier than ____, give me the vendors in charge, or
            Give me the products with EOS dates later/earlier than ____.
            <br />
            <b>Query for external URLs for products</b>&nbsp;
            - &nbsp;Give me the link for ____.
            <br />
            <b>Query for link for product</b>&nbsp;
            - &nbsp;Give me the url for ____.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </div>
    </>
  );
}
