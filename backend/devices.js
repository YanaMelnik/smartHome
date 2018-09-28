const router = require('express').Router();
const Device = require('./models/device');
const http = require('http');
const Group = require('./models/group');
const deviceAdapter = require('./utils');

const logCommands = {
    create: 'Device was created',
    update: 'Device was update',
    off: 'Device was turned off',
    on: 'Device was turned on'
};

const deviceStates = {
    on: 'on',
    off: 'off'
};

const deviceCommands = {
    [deviceStates.on]: 'Power%20On',
    [deviceStates.off]: 'Power%20off'
};

function sendRequest(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            if (res.statusCode !== 200) {
                reject(res.statusCode);
            } else {
                resolve();
            }
        });
    });
}

router.get('/', async (req,res) => {
    const devices = await Device.find().exec();
    res.json(devices.map(deviceAdapter));
});

function writeLog(command, device) {
    device.log = [
        ...(Array.isArray(device.log) ? device.log : []),
        {
            action: logCommands[command],
            date: new Date().toLocaleString()
        }
    ];
}


router.get('/:id', async (req,res) => {
    const device = await Device.findById(req.params.id).exec();

    if (device) {
        res.json(deviceAdapter(device));
    } else {
        res.sendStatus(404);
    }
});

router.get('/:id/:log', async (req, res) => {
    const device = await Device.findById(req.params.id).exec();

    if (device) {
        res.send(deviceAdapter(device).log);
    } else {
        res.sendStatus(404);
    }
});

router.post('/', async (req,res) => {
    const device = req.body;

    writeLog('create', device);

    await Device.create({
        state: 'off',
        ...device
    });

    res.sendStatus(201);
});

router.put('/:id', async (req, res) => {
    const deviceId = req.params.id;
    const device = req.body;
    const groupId = req.body.group;

    writeLog('update', device);

    await Device.findByIdAndUpdate(deviceId, device).exec();

    const group = await Group.findById(groupId);
    if (group) {
        !group.devices.includes(deviceId) && group.devices.push(deviceId) && await group.save();
    } else {
        await removeDeviceFromGroups(deviceId);
    }

    res.sendStatus(200);
});

router.delete('/:id', async (req, res) => {
    const deviceId = req.params.id;

    await Device.findByIdAndRemove(deviceId).exec();

    res.sendStatus(200);
});

router.put('/:id/:cmnd', async (req, res) => {
    const deviceId = req.params.id;
    const command = deviceCommands[req.params.cmnd];
    const device = await Device.findById(deviceId).exec();
    const url = `http://${device.address}:${device.port}/cm?cmnd=${command}`;

    await sendRequest(url);

    device.state = req.params.cmnd;
    writeLog(req.params.cmnd, device);

    await device.save();

    await updateGroup(device.group, deviceId);

    res.sendStatus(200);
});

async function updateGroup(deviceGroup, deviceId) {
    const group = await Group.findById(deviceGroup).exec();
    if (!group) {
        await removeDeviceFromGroups(deviceId);
        return;
    }
    const deviceSteteArray = [];

    await group.devices.map(async id => {
        const deviceStateField = await Device.findById(id).select('state').exec();

        if (deviceStateField.state === deviceStates.off) {
            group.state = deviceStates.off;
            deviceSteteArray.push(deviceStates.off);

        } else if (!deviceSteteArray.includes(deviceStates.off)) {
            group.state = deviceStates.on;
        }
        try {
            await group.save();
        }
        catch (e) {
            console.log(e.message);
        }
    });
}

async function removeDeviceFromGroups(deviceId) {
    const groups = await Group.find().exec();

    groups.forEach(async group => {
        if (group.devices.includes(deviceId)) {
            group.devices = group.devices.filter(id => id !== deviceId);
            await group.save()
        }
    })
};

module.exports = router;
