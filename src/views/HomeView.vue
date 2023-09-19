<script setup lang="ts">
import { Button } from '@/components/ui/button';
import type { CompactMapping, CompactMappingY, CompactMappingX, StoneMapping, StonePlace } from '@/models/types';
import boards from '@/assets/data/boards.json';
import { onMounted, ref } from 'vue';

const flyBoard = boards.find((item: any) => item.name === "Teotihucan");
const tileTypes: Array<string> = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
]

const expandMap = (map: CompactMapping): StoneMapping => {
  const result: StoneMapping = [];
	map.forEach(matrix => {
		const z = matrix[0] as number;
		const rows = matrix[1] as Array<CompactMappingY>;
		rows.forEach(row => {
			const y = row[0] as number;
			const cells = row[1] as CompactMappingX;
			if (!Array.isArray(cells)) {
				result.push({z, x: cells, y});
			} else {
				cells.forEach(cell => {
					if (Array.isArray(cell)) {
						let x = cell[0];
						const count = cell[1];
						for (let i = 0; i < count; i++) {
							result.push({z, x, y});
							x += 2;
						}
					} else {
						result.push({z, x: cell, y});
					}
				});
			}
		});
	});
	return result;
}
let flyLayout = ref<StoneMapping>(expandMap(flyBoard?.map ?? []));

const isTileDisabled = (tile: StonePlace): boolean => {
  const tilesAbove = flyLayout.value.filter((item: StonePlace) => item.z === tile.z + 1 && (item.y === tile.y - 1 || item.y === tile.y || item.y === tile.y + 1) && (item.x === tile.x - 1 || item.x === tile.x || item.x === tile.x + 1));
  const rowAboveTiles = tilesAbove.filter((item: StonePlace) => item.y === tile.y - 1);
  const rowBelowTiles = tilesAbove.filter((item: StonePlace) => item.y === tile.y + 1);
  const nextCellTiles = tilesAbove.filter((item: StonePlace) => item.x === tile.x + 1);
  const prevCellTiles = tilesAbove.filter((item: StonePlace) => item.x === tile.x - 1);
  const hasTileAbove = !!tilesAbove.find((item: StonePlace) => item.x === tile.x);  
  return rowAboveTiles.length >= 1 || rowBelowTiles.length >= 1 || nextCellTiles.length >= 1 || prevCellTiles.length >= 1 || hasTileAbove;
};

const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

onMounted(() => {
  const neededTileTypes: string[] = [];
  while (neededTileTypes.length < flyLayout.value.length) {
    neededTileTypes.push(...tileTypes);
  }

  // Shuffle the tile types randomly
  shuffleArray(neededTileTypes);

  // Assign randomized 'value' properties to tiles with null values in the existing layout
  flyLayout.value.forEach(tile => {
    if (!tile.value) {
      tile.value = neededTileTypes.pop();
    }
  });
});

const pickedTiles = ref<StonePlace[]>([]);
const pickTile = (index: number) => {
  if (pickedTiles.value.length < 7) {
    pickedTiles.value.push(flyLayout.value[index]);
    flyLayout.value.splice(index, 1);
    pickedTiles.value.sort((a: any, b: any) => {
      return a.value?.localeCompare(b.value ?? "")
    })
    setTimeout(() => {
      removeThreeInARow();
    }, 200)
    // let tileIndex = 0;
    // let count = 0;
    // let currentTile: StonePlace | null = null;
    // let currentIndex = 0;
    // pickedTiles.value.forEach((item, idx) => {
    //   if(currentTile?.value === item.value) {
    //     console.log(idx);
    //     if (count === 0) tileIndex = currentIndex;
    //     count += 1;
    //     if (count === 2) {
    //       console.log(tileIndex);
    //       pickedTiles.value.splice(tileIndex, 3)
    //       count = 0;
    //     }
    //   }
    //   currentTile = item;
    //   currentIndex = idx;
    // })
    // const last3 = pickedTiles.value.slice(-3);
    // if (last3.length === 3) {
    //   if (last3.every(item => item.value === last3[0].value)) {
    //     pickedTiles.value.splice(pickedTiles.value.length - 3, 3)
    //   }
    // }
  }
}

const removeThreeInARow = () => {
  let count = 1;
  let currentItem = pickedTiles.value[0];
  const result = [currentItem];

  for (let i = 1; i < pickedTiles.value.length; i++) {
    if (pickedTiles.value[i].value === currentItem.value) {
      count++;
    } else {
      count = 1;
      currentItem = pickedTiles.value[i];
    }

    result.push(currentItem);

    if (count === 3) {
      result.pop();
      result.pop();
      result.pop();
      count = 1;
    }
  }

  // Update the 'pickedTiles' ref with the filtered result
  pickedTiles.value = result;
}

</script>

<template>
  <main class="h-screen bg-slate-100">
    <div class="flex flex-col items-center justify-center h-full gap-12">
      <div class="relative w-[400px] h-[360px]">
        <div :style="{ zIndex: tile.z, top: `${40 * (tile.y / 2) + (tile.z * 5)}px`, left: `${40 * (tile.x / 2)}px` }" class="absolute" v-for="(tile, index) in flyLayout" v-bind:key="index">
          <Button :disabled="isTileDisabled(tile)" @click="() => { if(!isTileDisabled(tile)) pickTile(index); }" variant="tile" >{{ tile.value }}</Button>
        </div>
      </div>
      <div class="flex gap-1">
        <div class="w-[40px] h-[45px] bg-slate-300 rounded-md" v-for="index in [...Array(7).keys()]" v-bind:key="index">
          <Button variant="tile" v-if="pickedTiles[index]">{{ pickedTiles[index].value }}</Button>
        </div>
      </div>
    </div>
  </main>
</template>
