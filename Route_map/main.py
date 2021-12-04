import osmnx as ox
import networkx as nx
from pymongo import MongoClient

ox.config(use_cache=True)

# Мусорные баки (планируется получать из базы данных)
# id: point
bins = {
    '0': [54.902413131840845, 52.28897012404052],
    '1': [54.90056501751895, 52.28753185672437],
    '3': [54.9055141974496, 52.27044224682817],
    '4': [54.90708210787897, 52.26648085450261],
    '5': [54.90583614076387, 52.2636957317128],
    '6': [54.906884048981055, 52.263436485056936],
    '7': [54.90729096394144, 52.26391092936052],
    '10': [54.899748134509245, 52.29063185985744],
    '11': [54.899056064212566, 52.28563908656023],
    '12': [54.89568906621508, 52.2885462794295],
    '14': [54.901034512197654, 52.26732246223078],
    '15': [54.90287075597258, 52.26978766953216]
}

# Количество мусоровозов (планируется получать из базы данных)
car_counts = 2

# Граф дорог
G = ox.graph_from_place('Almetyevsk, Russia', 'drive', simplify=False,
                        custom_filter='["highway"~"residential|tertiary|secondary|primary"]')
# Вершины и ребра графа
nodes, edges = ox.graph_to_gdfs(G)

# Данные ребер
u = []          # вершины начала
v = []          # вершины конца
data = []       # параметры ребра (тип дороги, длина, и т.д.)

# Точка гаража
garage = [54.908896975566456, 52.30437414942531]
# Лист полных баков, координаты с карты
full_bins_map = []
# Лист полных баков, id вершин графа
full_bins_graph = []
# Лист расстояний между баками
distances = []
# Лист используемых баков в построении путей
used = []


def get_path_to_id(frm, dst, id_type=False):
    """ Строит кратчайший путь между точками
        :param frm - точка начала
            (x, y) при id_type=False
            id вершины графа при id_type=True
        :param dst - точка конца
            (x, y) при id_type=False
            id вершины графа при id_type=True
        :param id_type - тип точек
        :returns list(id1, id2, ...) - лист id вершин графа
    """
    f = frm
    d = dst
    # Если точки не id вершин, находим к ним ближайшие из графа
    if not id_type:
        f = ox.get_nearest_node(G, frm)
        d = ox.get_nearest_node(G, dst)
    return nx.shortest_path(G, f, d)


def get_path_to_dots(frm, dst, id_type=False):
    """ Строит кратчайший путь между точками
        :param frm - точка начала
            (x, y) при id_type=False
            id вершины графа при id_type=True
        :param dst - точка конца
            (x, y) при id_type=False
            id вершины графа при id_type=True
        :param id_type - тип точек
        :returns list([x1, y1], [x2, y2], ...) - лист точек
    """
    f = frm
    d = dst
    # Если точки не id вершин, находим к ним ближайшие из графа
    if not id_type:
        f = ox.get_nearest_node(G, frm)
        d = ox.get_nearest_node(G, dst)

    # Получаем путь
    route = nx.shortest_path(G, f, d)
    path = nodes.loc[route]

    # Сохраняем только точки
    dots = []
    for node in path.values:
        dots.append([node[0], node[1]])
    return dots


def set_all_distances():
    """ Заполняет массив расстояний между баками
    """
    length = len(full_bins_map)
    # Сохраняем ближайшие к бакам точки графа
    for i in range(length):
        full_bins_graph.append(ox.get_nearest_node(G, full_bins_map[i]))

    # Инициализируем массив растояний между баками
    for i in range(length):
        distances.append([])
        for j in range(length):
            distances[i].append(0)

    # Заполняем массив растояний между баками
    for i in range(length):
        for j in range(length):
            if i == j:
                continue
            path = get_path_to_id(full_bins_graph[i], full_bins_graph[j], True)
            distances[i][j] = get_path_distance(path)


def get_path_distance(path_by_ind):
    """ Определяет длину пути
        :param path_by_ind - путь в виде массива id вершин
        :returns float - длина путь
    """
    distance = 0
    # Складываем растояния между вершинами
    for i in range(len(path_by_ind) - 1):
        distance += get_edge_length_by_nodes(path_by_ind[i], path_by_ind[i+1])
    return distance


def get_edge_length_by_nodes(nid1, nid2, depth=0):
    """ Определяет длину ребра
        :param nid1 - id первой вершины
        :param nid2 - id второй вершины
        :param depth - глубина рекурсии (default 0)
        :returns float - длина ребра
    """
    # Прекращаем рекурсию при повторе
    if depth > 1:
        return

    start_index = 0     # позиция старта поиска
    ind = -1            # найденный индекс
    length = len(u)     # количество вершин

    # Повторяем поиск
    while True:
        # Если индекс превысил размер массива, прекращаем
        if start_index > length - 1:
            break

        # Ищем в массиве вершин индекс нужной вершины
        try:
            ind = u.index(nid1, start_index)
        # Если такой вершины нет, прекращаем поиск
        except ValueError:
            break
        # Если нашли вершину с таким id
        else:
            # Если индекс вершины конца совпадает с найденным,
            # возвращаем длину ребра
            if v[ind] == nid2:
                return data[ind]['length']
            start_index = ind + 1

    # Меняем местами вершины и повторяем
    return get_edge_length_by_nodes(nid2, nid1, depth + 1)


def get_components(n):
    """ Получает компоненты с id баков
        :param n - количество машин
        :returns list([id1, id2, ...], [id3, id4, ...], ...)
            - лист компонент с id баков
    """
    components = []     # массив компонент
    count = 1           # количество баков в компонентах
    # Инициализируем массив компонент
    for i in range(n):
        components.append([])

    # Добавляем ближайший к гаражу бак в первую компоненту
    components[0].append(find_first_bin())
    count += 1

    # Добавляем в остальные компоненты по одному баку
    # с максимальным расстоянием до всех уже добавленных баков
    for i in range(1, n):
        components[i].append(find_max_dist_node())
        count += 1

    # Пока не добавим все баки в компоненты
    while count != len(full_bins_map):
        # Добавляем по ближайшему баку в каждую компоненту
        for i in range(0, n):
            # Если добавили все баки, прекращаем
            if count >= len(full_bins_map):
                break
            length = len(components[i]) - 1
            components[i].append(get_nearest_bin(components[i][length]))
            count += 1

    return components


def get_nearest_bin(bin_id):
    """ Ищет ближайший бак к данному
        :param bin_id - id последнего бака
        :returns int - id бака
    """
    min = 0         # минимальное расстояние
    id = -1         # id найденного бака
    # Находим начальные значения id и min
    for i in range(1, len(full_bins_map)):
        try:
            used.index(i)
        except ValueError:
            min = distances[bin_id][i]
            id = i
            break

    # Находим конечные значения id и min
    for i in range(1, len(full_bins_map)):
        try:
            used.index(i)
        except ValueError:
            # Если расстояние меньше нашего, сохраянем
            if distances[bin_id][i] < min:
                min = distances[bin_id][i]
                id = i

    used.append(id)
    return id


def find_first_bin():
    """ Ищет ближайший бак к гаражу
        :returns int - id бака
    """
    id = 1                      # начальный id
    min = distances[0][id]      # начальное минимальное расстояние
    length = len(distances)     # количество баков
    # Обходим все баки
    for i in range(1, length):
        # Если расстояние меньше нашего, сохраняем
        if distances[0][i] < min:
            id = i
            min = distances[0][id]

    used.append(id)
    return id


def find_max_dist_node():
    """ Ищет бак с наибольшим расстоянием до всех других
        :returns int - id бака
    """
    max_value = 99999999        # максимальное расстояние
    id = -1                     # начальный id
    length = len(distances)     # количество баков
    not_used = []               # массив неиспользованных баков
    bins_dist = [max_value]     # массив расстояний до всех баков
    # Инициализируем массив расстояний до баков
    for i in range(1, length):
        bins_dist.append(max_value)
        try:
            used.index(i)
        except ValueError:
            not_used.append(i)

    # Обновляем минимальные расстояния до каждого бака
    for i in used:
        for j in not_used:
            if distances[i][j] < bins_dist[j]:
                bins_dist[j] = distances[i][j]

    max = -1                    # максимум из минимумов
    # Ищем максимум среди минимумов
    for i in range(1, length):
        try:
            used.index(i)
        except ValueError:
            if bins_dist[i] > max:
                max = bins_dist[i]
                id = i

    used.append(id)
    return id


def get_paths(components):
    """ Получает пути для каждой компоненты
        :param components - массив компонент
        :returns list([[x1, y1], [x2, y2], [[x3, y3], [x4, y4]], ...)
            - массив путей, путь - массив точек
    """
    paths = []      # массив путей
    # Для каждой компоненты
    for i in range(len(components)):
        path = []                                           # путь
        ind = components[i][0]                              # индекс бака
        p = get_path_to_dots(full_bins_graph[0],            # путь между вершинами
                             full_bins_graph[ind], True)
        # Добавляем точки между гаражом и первым баком в путь
        for pp in p:
            path.append(pp)
        # Добавляем точки между баками в путь
        for j in range(0, len(components[i]) - 1):
            ind1 = components[i][j]
            ind2 = components[i][j + 1]
            p = get_path_to_dots(full_bins_graph[ind1],
                                 full_bins_graph[ind2], True)
            for pp in p:
                path.append(pp)

        paths.append(path)
    return paths


def main():
    """ Точка входа
    """
    # Заполняем данные ребер
    for uu, vv, _, ddata in G.edges(keys=True, data=True):
        u.append(uu)
        v.append(vv)
        data.append(ddata)

    # Настраиваем подключение к базе данных
    client = MongoClient(
        'mongodb+srv://hackaton:trash@hackaton-cluster.v1c7f.mongodb.net/trash_db?retryWrites=true&w=majority')
    db = client['hack_db']

    # Добавляем гараж в массив баков
    full_bins_map.append(garage)

    # Получаем координаты баков
    coll = db.hack_call2
    for bbins in coll.find():
        # Сохраняем заполненные баки
        if bbins['cnt_bins'] != 0 and bbins['full_bins'] / bbins['cnt_bins'] > 0.5:
            full_bins_map.append(bins[f"{bbins['cam_id']}"])

    # Ищем растояния между баками, строим компоненты и получаем пути
    set_all_distances()
    components = get_components(car_counts)
    paths = get_paths(components)

    '''
    # Сохраняем пути в базе данных
    db.hack_route.drop()
    coll = db.hack_route
    coll.insert_one({"path": paths})
'''

if __name__ == '__main__':
    main()
