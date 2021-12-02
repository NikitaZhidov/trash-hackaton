import axios from 'axios';

const baseAxios = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const trashApi = {
  async getGarage() {
    const res = await baseAxios.get('/garage');
    return res.data;
  },

  async getTrashContainers() {
    const res = await baseAxios.get('/container');
    return res.data;
  },
};
