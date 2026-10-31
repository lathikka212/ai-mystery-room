import axios from 'axios';

const API_URL = 'http://localhost:5000';

export const checkBackend = async () => {
  try {
    const response = await axios.get(API_URL + '/');
    return response.data;
  } catch (error) {
    console.error('Backend connection error:', error);
    return null;
  }
};

export const sendGameAction = async (action, roomState, chatHistory) => {
  try {
    const response = await axios.post(API_URL + '/api/game/action', {
      action,
      roomState,
      chatHistory
    });
    return response.data.response;
  } catch (error) {
    console.error('Game action error:', error);
    return 'The connection to the Game Master flickered and died.';
  }
};
