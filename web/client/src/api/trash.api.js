import axios from 'axios';

const baseAxios = axios.create({
  baseURL: 'https://hackaton-trash-app.herokuapp.com/api',
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

  async getTrashContainerById(id) {
    const res = await baseAxios.get(`/container/${id}`);
    return res.data;
  },

  async getShortRoutes() {
    const res = await baseAxios.get(`/route`);
    return res.data;
  },
};
