import mongoose from 'mongoose';

const HackRouteSchema = new mongoose.Schema({
  path: [[[Number, Number]]],
});

export const HackRoute = mongoose.model(
  'hack_route',
  HackRouteSchema,
  'hack_route'
);
