import mongoose from 'mongoose';

const HackCallSchema = new mongoose.Schema({
  cam_id: Number,
  img_bytes: Buffer,
  time: Number,
  cnt_bins: Number,
  full_bins: Number,
});

export const HackCall = mongoose.model(
  'hack_call',
  HackCallSchema,
  'hack_call'
);
