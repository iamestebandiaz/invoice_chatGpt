import axios from 'axios';

export const sendQuery = async (data) => {

  const response = await axios.post('https://8735-193-178-210-10.ngrok-free.app/api/search',data);

  return response;
};

export const getFile = async (data) => {
  const response = await axios.post('https://8735-193-178-210-10.ngrok-free.app/api/search/file',data,{responseType: 'arraybuffer'});
  return response;
};