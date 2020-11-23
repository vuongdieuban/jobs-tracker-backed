import { Injectable } from '@nestjs/common';

interface Item {
  id: number;
  pos: number;
}

// const items: Item[] = [
//   { id: 1, pos: 32767 },
//   { id: 2, pos: 49151.5 },
//   { id: 3, pos: 49151.6 },
//   { id: 4, pos: 90000 },
//   { id: 5, pos: 129000 },
// ];

// const itemToMove: Item = {
//   id: 5,
//   pos: 60000,
// };

const SPACE_BETWEEN_ITEM = Math.pow(2, 14);
const MIN_SPACE_BETWEEN_ITEM = 0.15;

@Injectable()
export class ReorderPositionService {
  public moveItemInSameList(itemToMove: Item, items: Item[]): Item[] {
    const { pos, id } = itemToMove;

    const item = items.find(i => i.id === id);
    if (!item) {
      throw Error(`No item found with id ${id}`);
    }

    // temporary update with data sent in from the front-end
    item.pos = pos;

    // sort again so we know where it will be
    items.sort((a, b) => a.pos - b.pos);

    // index after sort
    const insertIndex = items.findIndex(app => app.id === id);

    const updatedItems = this.calculateItemsPositionAfterInsertion(items, insertIndex);
    console.log('Applications reordered', items);
    console.log('updatedItems', updatedItems);
    return updatedItems;
  }

  private calculateItemsPositionAfterInsertion(items: Item[], insertIndex: number): Item[] {
    const updatedItems: Item[] = [];
    for (let i = insertIndex; i < items.length; i++) {
      const item = items[i];
      const itemBehind = items[i - 1];
      const itemAhead = items[i + 1];

      const positionBehind = itemBehind ? itemBehind.pos : 0;

      if (!itemAhead) {
        // last item in the list
        item.pos = positionBehind + SPACE_BETWEEN_ITEM;
        updatedItems.push(item);
        return updatedItems;
      }

      const positionAhead = itemAhead.pos;
      const spaceBetween = positionAhead - positionBehind;

      // if space between two items are more than MIN_SPACE_BETWEEN_ITEM then we can just insert between them
      // Otherwise the space is too small between them so we increment the space, keep increment them until they are large enough.
      if (spaceBetween > MIN_SPACE_BETWEEN_ITEM) {
        item.pos = (positionAhead + positionBehind) / 2;
        updatedItems.push(item);
        return updatedItems;
      }

      item.pos = positionBehind + SPACE_BETWEEN_ITEM;
      updatedItems.push(item);
    }
    return updatedItems;
  }
}
