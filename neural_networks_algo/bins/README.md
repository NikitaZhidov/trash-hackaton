# Детекция заполненности мусорных баков
## Детекция
### Модель:

В качестве модели для детекции в обоих задачах использовалась [yolov5s](https://github.com/ultralytics/yolov5).

### Датасет

Объем датасета: около 400 картинок, 1000 объектов. [Датасет с баками для детекции](https://drive.google.com/drive/folders/1iWbv-UfowGBAM7VzPunUIpZUzYzOo7di?usp=sharing)

### Полученная метрика на валидации детекции баков:

mAP@.5: 0.973

### Веса

[Веса для модели детекции](https://github.com/NikitaZhidov/trash-hackaton/blob/master/neural_networks_algo/bins/weights/best(3).pt)

## Классификация заполненности баков

### Модель:

Backbone был взят [Efficient-net-b3](https://github.com/lukemelas/EfficientNet-PyTorch) и обучен на два класса: заполненный и не заполненный.

### Датасет:

Объем датасета: 1000 картинок. [Датасет с баками для классификации](https://drive.google.com/drive/folders/1iWbv-UfowGBAM7VzPunUIpZUzYzOo7di?usp=sharing)

### Полученная метрика на валидации:

Accuracy: 0.956

### Веса

[Веса для модели классификации](https://drive.google.com/file/d/1Q2Lww7kNDw8rDQL_E5K9RDTH4oRZcSi0/view?usp=sharing)

