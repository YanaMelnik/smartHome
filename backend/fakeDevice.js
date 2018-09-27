const express = require('express');

const port = parseInt(process.argv[2]);

if (!port) {
    console.error('Fake device port is not defined');
    process.exit();
}

const app = express();
let isOn = false;

app.get('/cm', (req, res) => {
    const command = req.query.cmnd;
    console.log(`Comand ${command}`);

    if (command === 'Power On') {
        isOn = true;
    } else if (command === 'Power off') {
        isOn = false;
    } else if (command === 'Power TOGGLE') {
        isOn = !isOn;
    }

    res.send(`Current status is ${isOn ? 'On' : 'Off'}`);
});

app.listen(port, () => {
    console.log(`Fake device is listening on http://127.0.0.1:${port}`);
});