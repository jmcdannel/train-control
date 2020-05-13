async function createTurnout() {
  throw new Error('Not implemented');
}

async function readTurnout(id = null) {
  try {
    const response = id !== null
      ? await fetch(`${apiHost}/turnouts/${id}`)
      : await fetch(`${apiHost}/turnouts`);
    return response.json();
  } catch (err) {
    console.error(err)
    throw new Error('Unable to read Turnout(s)', id);
  }
}

async function updateTurnout(data) {
  try {
    const response = await fetch(`${apiHost}/turnouts/${data.id}`, {
      method: 'PUT',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (err) {
    console.error(err)
    throw new Error('Unable to update Turnout', data);
  }
}

async function deleteTurnout(id) {
  throw new Error('Not implemented');
}

export const apiHost = 'http://192.168.86.25:5000';

export const api = {
  get: readTurnout,
  put: updateTurnout,
  post: createTurnout,
  delete: deleteTurnout
}

export default api;
