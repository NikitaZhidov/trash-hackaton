[Веса для модели классификации](https://drive.google.com/file/d/1Q2Lww7kNDw8rDQL_E5K9RDTH4oRZcSi0/view?usp=sharing)

## Окружение
- conda install pytorch torchvision torchaudio cudatoolkit=10.2 -c pytorch
- pip install opencv-python efficientnet-pytorch Pillow albumentations

## Детекция
Модель:

В качестве модели для детекции в обоих задачах использовалась [yolov5s](https://github.com/ultralytics/yolov5).

Для решения задачи детекции баков модель была обучена на наших данных, для решения задачи поиска свободных парковочных мест использовалась предобученная модель.

Датасет:

Объем датасета: около 400 картинок, 1000 объектов

Полученная метрика на валидации:

mAP@.5: 0.973


## Классификация заполненности баков

Модель:

Backbone был взят [Efficient-net-b3](https://github.com/lukemelas/EfficientNet-PyTorch) и обучен на два класса: заполненный и не заполненный.

Датасет:

Объем датасета: около 400 картинок, 1000 объектов

Полученная метрика на валидации:

Accuracy: 0.956

