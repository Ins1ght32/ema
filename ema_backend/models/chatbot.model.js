const axios = require('axios');

const Chatbot = () => {
    ;
};

Chatbot.queryFlask = async (data, result) => {
    try {
        const flaskResponse = await axios.post('http://localhost:5000/query', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        
        console.log(flaskResponse.data);
        // const answer = flaskResponse.data.answer;

        // console.log(answer);
        //res.json(flaskResponse.data);
        result(null, flaskResponse.data);
    }
    catch (error) {
        console.error('Error', error);
        //res.status(500).json({ error: 'An error occurred while processing the request.' });
        result(error, null);
    }

};

module.exports = Chatbot;