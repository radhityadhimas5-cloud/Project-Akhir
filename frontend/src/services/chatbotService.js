import api from './api';

export const chatbotAPI = {
  /**
   * Send a chat message to the backend AI assistant.
   * @param {string} message - User message text
   * @param {Array} history - Previous conversation items [{ sender: 'user'|'assistant', text: '...' }]
   */
  sendMessage: (message, history = []) => {
    return api.post('/chatbot/message', {
      message,
      history,
    });
  },

  /**
   * Get default suggested questions & bot metadata.
   */
  getSuggestions: () => {
    return api.get('/chatbot/suggestions');
  },
};

export default chatbotAPI;

