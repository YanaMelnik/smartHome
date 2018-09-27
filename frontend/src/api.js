import axios from 'axios';
const serverUrl = 'http://localhost:4000';

export async function getDevices() {
    const response = await axios.get(`${serverUrl}/devices`);
    return response.data;
}

export async function getDeviceById(deviceId) {
    const response = await axios.get(`${serverUrl}/devices/${deviceId}`);
    return response.data;
}

export async function addDevice(device) {
    const response = await  axios.post(`${serverUrl}/devices`, device);
    if (response.status !== 201) {
        throw new Error('Devices is not created');
    }
    return response.data;
}

export async function removeDevice(deviceId) {
    await axios.delete(`${serverUrl}/devices/${deviceId}`);
}

export async function updateDevice(deviceId, data) {
   await axios.put(`${serverUrl}/devices/${deviceId}`, data);
}

export async function switchOn(deviceId, data) {
    await axios.put(`${serverUrl}/devices/${deviceId}/on`, data)
}

export async function switchOff(deviceId, data) {
    await axios.put(`${serverUrl}/devices/${deviceId}/off`, data);
}

export async function getDeviceLog(deviceId) {
    return [
        {
            date: '2018-31-08 16:00:00',
            action: 'On'
        },
        {
            date: '2018-31-08 17:00:00',
            action: 'Off'
        }]
}