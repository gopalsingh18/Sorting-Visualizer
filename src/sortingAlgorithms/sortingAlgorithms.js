// Merge Sort
export function getMergeSortAnimations(array) {
  const animations = [];
  if (array.length <= 1) return animations;
  const auxiliaryArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
  return animations;
}

function mergeSortHelper(mainArray, startIdx, endIdx, auxiliaryArray, animations) {
  if (startIdx === endIdx) return;
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, animations);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, animations);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations);
}

function doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, animations) {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  while (i <= middleIdx && j <= endIdx) {
    animations.push({ type: 'compare', indices: [i, j] });
    animations.push({ type: 'revert', indices: [i, j] });
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      animations.push({ type: 'swap', indices: [k, auxiliaryArray[i]] });
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      animations.push({ type: 'swap', indices: [k, auxiliaryArray[j]] });
      mainArray[k++] = auxiliaryArray[j++];
    }
  }
  while (i <= middleIdx) {
    animations.push({ type: 'compare', indices: [i, i] });
    animations.push({ type: 'revert', indices: [i, i] });
    animations.push({ type: 'swap', indices: [k, auxiliaryArray[i]] });
    mainArray[k++] = auxiliaryArray[i++];
  }
  while (j <= endIdx) {
    animations.push({ type: 'compare', indices: [j, j] });
    animations.push({ type: 'revert', indices: [j, j] });
    animations.push({ type: 'swap', indices: [k, auxiliaryArray[j]] });
    mainArray[k++] = auxiliaryArray[j++];
  }
}

// Quick Sort
export function getQuickSortAnimations(array) {
  const animations = [];
  const arr = array.slice();
  quickSortHelper(arr, 0, arr.length - 1, animations);
  return animations;
}

function quickSortHelper(arr, low, high, animations) {
  if (low < high) {
    const pi = partition(arr, low, high, animations);
    quickSortHelper(arr, low, pi - 1, animations);
    quickSortHelper(arr, pi + 1, high, animations);
  }
}

function partition(arr, low, high, animations) {
  const pivot = arr[high];
  let i = low;
  for (let j = low; j < high; j++) {
    animations.push({ type: 'compare', indices: [j, high] });
    animations.push({ type: 'revert', indices: [j, high] });
    if (arr[j] < pivot) {
      animations.push({ type: 'swap', indices: [i, arr[j]] });
      animations.push({ type: 'swap', indices: [j, arr[i]] });
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  animations.push({ type: 'swap', indices: [i, arr[high]] });
  animations.push({ type: 'swap', indices: [high, arr[i]] });
  [arr[i], arr[high]] = [arr[high], arr[i]];
  return i;
}

// Heap Sort
export function getHeapSortAnimations(array) {
  const animations = [];
  const arr = array.slice();
  const n = arr.length;

  function heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      animations.push({ type: 'compare', indices: [i, left] });
      animations.push({ type: 'revert', indices: [i, left] });
      if (arr[left] > arr[largest]) largest = left;
    }
    if (right < n) {
      animations.push({ type: 'compare', indices: [i, right] });
      animations.push({ type: 'revert', indices: [i, right] });
      if (arr[right] > arr[largest]) largest = right;
    }
    if (largest !== i) {
      animations.push({ type: 'swap', indices: [i, arr[largest]] });
      animations.push({ type: 'swap', indices: [largest, arr[i]] });
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(n, largest);
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  for (let i = n - 1; i > 0; i--) {
    animations.push({ type: 'swap', indices: [0, arr[i]] });
    animations.push({ type: 'swap', indices: [i, arr[0]] });
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(i, 0);
  }
  return animations;
}

// Bubble Sort
export function getBubbleSortAnimations(array) {
  const animations = [];
  const arr = array.slice();
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      animations.push({ type: 'compare', indices: [j, j + 1] });
      animations.push({ type: 'revert', indices: [j, j + 1] });
      if (arr[j] > arr[j + 1]) {
        animations.push({ type: 'swap', indices: [j, arr[j + 1]] });
        animations.push({ type: 'swap', indices: [j + 1, arr[j]] });
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return animations;
}

// Selection Sort
export function getSelectionSortAnimations(array) {
  const animations = [];
  const arr = array.slice();
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      animations.push({ type: 'compare', indices: [j, minIdx] });
      animations.push({ type: 'revert', indices: [j, minIdx] });
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    animations.push({ type: 'swap', indices: [i, arr[minIdx]] });
    animations.push({ type: 'swap', indices: [minIdx, arr[i]] });
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return animations;
}

// Insertion Sort
export function getInsertionSortAnimations(array) {
  const animations = [];
  const arr = array.slice();
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      animations.push({ type: 'compare', indices: [j, j + 1] });
      animations.push({ type: 'revert', indices: [j, j + 1] });
      animations.push({ type: 'swap', indices: [j + 1, arr[j]] });
      arr[j + 1] = arr[j];
      j--;
    }
    animations.push({ type: 'swap', indices: [j + 1, key] });
    arr[j + 1] = key;
  }
  return animations;
}
