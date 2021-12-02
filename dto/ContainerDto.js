import { containersPositions } from '../mockdata/mock-data.js';

export class ContainerDto {
  constructor(mongoContainer) {
    this.imgSrc = `data:image/jpeg;base64,${mongoContainer.img_bytes}`;
    this.time = mongoContainer.time;
    this.cnt_bins = mongoContainer.cnt_bins;
    this.full_bins = mongoContainer.full_bins;
    this.address = containersPositions.find(
      (cp) => cp.id === mongoContainer.cam_id
    );
  }
}
