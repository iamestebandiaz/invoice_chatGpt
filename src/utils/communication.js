import axios from 'axios';

export const sendQuery = async (data) => {

  const response = await axios.post('http://193.178.210.10:5000/api/search',data);

  return response;
};

export const getFile = async (data) => {
  const response = await axios.post('http://193.178.210.10:5000/api/search/file',data,{responseType: 'arraybuffer'});
  return response;
};