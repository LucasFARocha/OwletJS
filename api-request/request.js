const axios = require('axios');

exports.request = async function(url, method, data = null) {
    try {
      const config = {
        method,
        url,
        validateStatus: false,
      };
  
      if (data) {
        config.data = data;
      }
  
      const response = await axios(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  
