import { Router } from 'express';
import { HackCall } from '../models/hack_call.js';
import { garagePosition } from '../mockdata/mock-data.js';
import { ContainerDto } from '../dto/ContainerDto.js';

const router = Router();

router.get('/garage', (req, res) => {
  return res.json(garagePosition);
});

router.get('/container', async (req, res) => {
  const containers = await HackCall.find({});

  const containersToClient = containers.map((c) => new ContainerDto(c));
  return res.json(containersToClient);
});

router.get('/container/:id', async (req, res) => {
  const cam_id = parseInt(req.params.id);

  const container = await HackCall.findOne({ cam_id });
  return res.json(new ContainerDto(container));
});

export default router;
