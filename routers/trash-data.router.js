import { Router } from 'express';
import { HackCall } from '../models/hack_call.js';
import { garagePosition } from '../mockdata/mock-data.js';
import { ContainerDto } from '../dto/ContainerDto.js';
import { fileTypeFromBuffer } from 'file-type';

const router = Router();

router.get('/garage', (req, res) => {
  return res.json(garagePosition);
});

router.get('/container', async (req, res) => {
  const containers = await HackCall.find({});

  const containersToClient = containers.map((c) => new ContainerDto(c));
  return res.json(containersToClient);
});

router.get('/image/:id', async (req, res) => {
  const cam_id = req.params.id;

  const containerWithImage = await HackCall.findOne({ cam_id });

  console.log(containerWithImage.img_bytes);
  return res.contentType('text/plain').send(containerWithImage.img_bytes);
});

export default router;
