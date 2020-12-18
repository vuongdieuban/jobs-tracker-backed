import { Injectable } from '@nestjs/common';
import { MIN_SPACE_BETWEEN_ITEM, SPACE_BETWEEN_ITEM } from 'src/shared/constants';

interface Item {
  id: string;
  position: number;
}

interface ReorderResponse<T> {
  insertedItem: T; // inserted item with its position calculated
  updatedItems: T[]; // all the items that are affected by this insertion
}

// const items: Item[] = [
//   { id: 1, position: 32767 },
//   { id: 2, position: 49151.5 },
//   { id: 3, position: 49151.6 },
//   { id: 4, position: 90000 },
//   { id: 5, position: 129000 },
// ];

// const itemToMove: Item = {
//   id: 5,
//   position: 60000,
// };

@Injectable()
export class ReorderPositionService {
  public moveItemInSameList<T extends Item>(itemToMove: Item, sortedItemList: Item[]): ReorderResponse<T> {
    const { position, id } = itemToMove;

    const item = sortedItemList.find(i => i.id === id);
    if (!item) {
      throw Error(`No item found with id ${id}`);
    }

    // temporary update with data sent in from the front-end
    item.position = position;

    // sort again so we know where it will be
    sortedItemList.sort((a, b) => a.position - b.position);

    // index after sort
    const insertIndex = sortedItemList.findIndex(app => app.id === id);

    const updatedItems = this.calculateItemsPositionAfterInsertion(sortedItemList, insertIndex);
    return {
      insertedItem: updatedItems[insertIndex] as T,
      updatedItems: updatedItems as T[],
    };
  }

  private calculateItemsPositionAfterInsertion(items: Item[], insertIndex: number): Item[] {
    const updatedItems: Item[] = [];
    for (let i = insertIndex; i < items.length; i++) {
      const item = items[i];
      const itemBehind = items[i - 1];
      const itemAhead = items[i + 1];

      const positionBehind = itemBehind ? itemBehind.position : 0;

      if (!itemAhead) {
        // last item in the list
        item.position = positionBehind + SPACE_BETWEEN_ITEM;
        updatedItems.push(item);
        return updatedItems;
      }

      const positionAhead = itemAhead.position;
      const spaceBetween = positionAhead - positionBehind;

      /* If space between two items are more than MIN_SPACE_BETWEEN_ITEM then we can just insert between them.
        Otherwise, the space is too small between them so we increment the space, 
        keep increment them until they are large enough. */
      if (spaceBetween > MIN_SPACE_BETWEEN_ITEM) {
        item.position = (positionAhead + positionBehind) / 2;
        updatedItems.push(item);
        return updatedItems;
      }

      item.position = positionBehind + SPACE_BETWEEN_ITEM;
      updatedItems.push(item);
    }
    return updatedItems;
  }
}
