const router = require('express').Router();

const Group = require('./models/group');
const Device = require('./models/device');
const groupUdapter = require('./utils');

router.get('/', async (req, res) => {
    const groups = await Group.find().exec();
    res.json(groups.map(groupUdapter));
});

router.post('/', async (req, res) => {
    const group = req.body;

    await Group.create({
        state: 'off',
        ...group
    });

    res.sendStatus(201);
});

router.get('/:id', async (req, res) => {
    const group = await Group.findById(req.params.id);

    if (group) {
        res.json(groupUdapter(group));
    } else {
        res.sendStatus(404);
    }
});

router.put('/:id', async (req, res) => {
    await Group.findByIdAndUpdate(req.params.id, req.body);

    res.sendStatus(201);
})

router.delete('/:id', async (req, res) => {
    await Group.findByIdAndRemove(req.params.id).exec();

    res.sendStatus(200);
});

router.put('/:id/:cmnd', async (req, res) => {
    const cmnd = req.params.cmnd;
    const group = await Group.findById(req.params.id).exec();

    group.state = cmnd;

    await updateDevices(group.devices, cmnd);

    await group.save();

    res.sendStatus(200);
});

async function updateDevices (devices, cmnd) {
    devices.map(async id => {
        const device = await Device.findById(id);
        if (device) {
            device.state = cmnd;
            await device.save();
        }
    });
}

module.exports = router;
