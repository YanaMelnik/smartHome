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
    await axios.post(`${serverUrl}/devices`, device);
}

export async function removeDevice(deviceId) {
    await axios.delete(`${serverUrl}/devices/${deviceId}`);
}

export async function updateDevice(deviceId, data) {
   await axios.put(`${serverUrl}/devices/${deviceId}`, data);
}

export async function switchOn(deviceId) {
    await axios.put(`${serverUrl}/devices/${deviceId}/on`);
}

export async function switchOff(deviceId) {
    await axios.put(`${serverUrl}/devices/${deviceId}/off`);
}

export async function getDeviceLog(deviceId) {
    const response = await axios.get(`${serverUrl}/devices/${deviceId}/log`);
    return response.data;
}

export async function getGroups() {
    const response = await axios.get(`${serverUrl}/groups`);
    return response.data;
}

export async function addGroup(group) {
    await axios.post(`${serverUrl}/groups`, group)
}

export async function removeGroup(groupId) {
    await axios.delete(`${serverUrl}/groups/${groupId}`);
}

export async function getGroupById(groupId) {
    const response = await axios.get(`${serverUrl}/groups/${groupId}`);
    return response.data;
}

export async function updateGroup(groupId, data) {
    await axios.put(`${serverUrl}/groups/${groupId}`, data)
}

export async function switchOnGroup(groupId) {
    await axios.put(`${serverUrl}/groups/${groupId}/on`);
}

export async function switchOffGroup(groupId) {
    await axios.put(`${serverUrl}/groups/${groupId}/off`);
}