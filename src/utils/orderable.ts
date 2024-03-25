interface OrderableObject {
  order: number;
}

export function order<Orderable extends OrderableObject[]>(list: Orderable) {
  return list.sort((a, b) => a.order - b.order);
}
