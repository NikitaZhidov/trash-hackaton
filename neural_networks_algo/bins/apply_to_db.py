# import tensorflow
import copy
import os
import shutil
import time

import cv2
from IPython.display import display
from PIL import Image
# from deepface import DeepFace
import torch
import gc
import albumentations
from albumentations import pytorch as AT
import torch
import torch.nn as nn
import numpy as np
import random
from efficientnet_pytorch import EfficientNet
from deepface import DeepFace
import pprint

import base64
import time

from PIL import Image
from io import BytesIO
from pymongo import MongoClient

# model = torch.hub.load('/home/nikita/yolov5recognition/yolov5/', 'custom',
#                        path='/home/nikita/yolov5recognition/yolov5/runs/train/exp_1/weights/best.pt', source='local')
# C:\Users\igors/.cache\torch\hub\ultralytics_yolov5_master
# model = torch.hub.load('ultralytics/yolov5', 'custom', 'weights/yolo_weights.pt')
model = torch.hub.load('C:\\Users\\igors/.cache\\torch\\hub\\ultralytics_yolov5_master', 'custom',
                       'weights/best(3).pt', source='local')
model.conf = 0.4


#
class MyEffnet(nn.Module):
    def __init__(self, model_name='efficientnet-b3'):
        super().__init__()
        self.model = EfficientNet.from_name(model_name)
        #         in_features = self.model.get_classifier().in_features
        self.model._fc = nn.Sequential(
            nn.Linear(self.model._fc.in_features, self.model._fc.in_features // 2),
            nn.ReLU(),
            nn.Linear(self.model._fc.in_features // 2, 2),
        )

    def forward(self, x):
        x = self.model(x)
        return x


class EmotionClassifier:
    def __init__(self, path, weights_type='dict'):
        if weights_type == 'dict':
            self.model = MyEffnet()
            self.model.load_state_dict(torch.load(path))
        else:
            self.model = torch.load(path)
        self.model.to('cuda')
        self.model.eval()
        img_size = 224
        self.transforms = albumentations.Compose([
            albumentations.Resize(img_size, img_size),
            albumentations.Normalize(),
            #         albumentations.ToFloat(),
            #         albumentations.ToGray(always_apply=True, p=1.0),
            AT.ToTensorV2()
        ])
        self.labels = ['empty', 'full']
        self.id_label = {i: label for i, label in enumerate(self.labels)}
        self.sm = nn.Softmax(1)

    def make_square(self, img):
        sz = max(img.shape[0], img.shape[1])
        left = (sz - img.shape[1]) // 2
        right = sz - img.shape[1] - left
        top = (sz - img.shape[0]) // 2
        bottom = sz - img.shape[0] - top
        #         print(top, bottom, left, right)
        return cv2.copyMakeBorder(img, top + 10, bottom + 10, left + 10, right + 10, cv2.BORDER_CONSTANT, None, value=0)

    def infer(self, img):
        image = self.make_square(img)
        # image = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
        image = self.transforms(image=image)['image']
        # print(image.numpy().shape)
        # cv2.imshow('img', image.detach().numpy().transpose(1, 2, 0))
        image = image[np.newaxis, ...]

        #                 print(image.shape)
        image = image.to('cuda')
        pred = self.model(image)
        pred = self.sm(pred.data)
        # print(pred)
        label = torch.max(pred, 1)[1].item()
        conf = torch.max(pred, 1)[0].item()
        return self.id_label[label], conf


client = MongoClient(
    'mongodb+srv://hackaton:trash@hackaton-cluster.v1c7f.mongodb.net/trash_db?retryWrites=true&w=majority')

db = client['hack_db']
# coll = db['hack_col']
############################
db.hack_call2.drop()
############################
gc.collect()
torch.cuda.empty_cache()

cap = cv2.VideoCapture(0)
classifier = EmotionClassifier('weights/best_model_dict(13).pth')

# while cap.isOpened():
#     # читаем кадр из видео
#     ret, frame = cap.read()
img_src_dir = 'datasets/trash_parts-20211203T104335Z-001/'
img_dst_dir = 'datasets/trash_p_infer/'
all_cam_dir = 'datasets/drive-download-20211203T114953Z-001/'
dst_dir_cams = 'dst_dir/'
to_insert = []

for cam_id in os.listdir(all_cam_dir):

    # for file in os.listdir(img_src_dir):
    # print(all_cam_dir + cam_id)
    cur_photos_dir = os.listdir(all_cam_dir + cam_id)
    file = cur_photos_dir[(random.randint(0, len(cur_photos_dir) - 1))]
    frame = cv2.imread(all_cam_dir + cam_id + '/' + file)
    # print(file)
    t = time.time()
    # print(file)
    # cv2.imshow('123', frame)
    # if cv2.waitKey(1000) & 0xFF == ord('q'):
    #     break
    # frame = cv2.imread('/home/nikita/yolov5recognition/datasets/rfd/test_1_photo_per_human/afraid/AF03AFS.JPG')
    # frame_copy = copy.deepcopy(frame)
    w, h = (640, 480)
    old_w, old_h = frame.shape[1], frame.shape[0]
    frame = cv2.resize(frame, (w, h), interpolation=cv2.INTER_AREA)
    frame_copy = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
    results = model(result)
    cnt_results = 0
    full_bins = 0
    if not results.pandas().xyxy[0].empty:
        for res in range(len(results.pandas().xyxy[0])):

            r = results.pandas().xyxy[0].to_numpy()[res]
            # if not results.pandas().xyxy[0].empty:
            pad = 3
            x0 = int(r[0])
            x0 = max(0, x0 - pad)
            y0 = int(r[1])
            y0 = max(0, y0 - pad)

            x1 = int(r[2])
            x1 = min(w - 1, x1 + pad)
            y1 = int(r[3])
            y1 = min(h - 1, y1 + pad)

            # x0_true = int(x0 * w_old / w)
            # y0_true = int(y0 * h_old / h)
            # x1_true = int(x1 * w_old / w)
            # y1_true = int(y1 * h_old / h)

            crop = frame_copy[y0:y1, x0:x1].copy()

            # actions = ['emotion']
            # Сделать паралленльный вывод
            # obj = DeepFace.analyze(img_path=square_black, actions=actions, detector_backend='skip',
            #                        enforce_detection=False)
            # emotion = obj['dominant_emotion']
            # confidence = f"conf: {obj['emotion'][str(emotion)]:.2f}%"

            emotion, confidence = classifier.infer(crop)
            # cv2.imshow("Demo", crop)
            confidence = str(round(confidence, 2))
            # cv2.rectangle()

            # cv2.putText(frame, confidence, (x0 + 20, y0), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
            if emotion == 'full':
                full_bins += 1
                cv2.rectangle(frame, (x0, y0), (x1, y1), (0, 0, 255), 2)
            else:
                cv2.rectangle(frame, (x0, y0), (x1, y1), (0, 255, 0), 2)
            # cv2.putText(frame, emotion, (x0, y0 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
            # cv2.imshow("crop", crop)
            # print(1)
    # cv2.imshow("Demo", frame)

    # frame = cv2.resize(frame, (old_w, old_h))
    # cv2.imwrite(img_dst_dir + file, frame)
    if not os.path.exists(dst_dir_cams + cam_id):
        shutil.rmtree(dst_dir_cams + cam_id)
        os.mkdir(dst_dir_cams + cam_id)

    cv2.imwrite(dst_dir_cams + cam_id + '/' + file, frame)

    with open(dst_dir_cams + cam_id + '/' + file, "rb") as image_file:
        data = base64.b64encode(image_file.read())
    cnt_results = len(results.pandas().xyxy[0])
    cur_dict = {
        'cam_id': int(cam_id),
        'img_bytes': data,
        'time': time.time(),
        'cnt_bins': cnt_results,
        'full_bins': full_bins
    }
    to_insert.append(cur_dict)
    # print(time.time() - t)
db.hack_call2.insert_many(to_insert)
# cv2.destroyAllWindows()
