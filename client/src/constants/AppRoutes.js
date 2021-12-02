export const AppRoutes = {
  Map: { title: 'Карта баков', route: '/map' },
  GetRoutToTrashContainer(id) {
    return `/container/${id}`;
  },
  TrashContainer: {
    title: 'Контейнер для мусора',
    route: '/container/:containerId',
  },
  TrashContainersList: {
    title: 'Статус баков',
    route: '/containers',
  },
};
