import React from 'react';
import {
  getMergeSortAnimations,
  getQuickSortAnimations,
  getHeapSortAnimations,
  getBubbleSortAnimations,
  getSelectionSortAnimations,
  getInsertionSortAnimations,
} from '../sortingAlgorithms/sortingAlgorithms.js';
import './SortingVisualizer.css';

const INITIAL_COLOR = '#d3d3d3'; // Grey
const COMPARE_COLOR = 'red';     // Compare
const REVERT_COLOR = 'blue';     // Revert
const SORTED_COLOR = 'green';    // Sorted

export default class SortingVisualizer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      array: this.generateArray(20),
      isSorting: false,
      currentAlgorithm: null,
      animationSpeed: 100,
      complexity: null,
    };
  }

  generateArray = (size) => {
    const arr = [];
    for (let i = 0; i < size; i++) {
      arr.push(randomIntFromInterval(5, 150));
    }
    return arr;
  };

  resetArray = () => {
    const size = this.state.array.length;
    this.setState({
      array: this.generateArray(size),
      currentAlgorithm: null,
      complexity: null,
    });
  };

  setSpeed = (event) => {
    this.setState({ animationSpeed: Number(event.target.value) });
  };

  animateWithPromise = (animations) => {
    return new Promise((resolve) => {
      this.animateAllSorts(animations, resolve);
    });
  };

  startSort = async (algorithm) => {
    const { array } = this.state;

    this.setState({
      isSorting: true,
      currentAlgorithm: algorithm,
      complexity: this.getComplexity(algorithm),
    });

    const animations = (() => {
      switch (algorithm) {
        case 'Merge Sort':
          return getMergeSortAnimations(array.slice());
        case 'Quick Sort':
          return getQuickSortAnimations(array.slice());
        case 'Heap Sort':
          return getHeapSortAnimations(array.slice());
        case 'Bubble Sort':
          return getBubbleSortAnimations(array.slice());
        case 'Selection Sort':
          return getSelectionSortAnimations(array.slice());
        case 'Insertion Sort':
          return getInsertionSortAnimations(array.slice());
        default:
          return [];
      }
    })();

    await this.animateWithPromise(animations);

    this.setState({
      isSorting: false,
    });
  };

  getComplexity = (algorithm) => {
    switch (algorithm) {
      case 'Merge Sort':
        return { time: 'O(n log n)', space: 'O(n)' };
      case 'Quick Sort':
        return { time: 'O(n log n)', space: 'O(n)' };
      case 'Heap Sort':
        return { time: 'O(n log n)', space: 'O(1)' };
      case 'Bubble Sort':
        return { time: 'O(n²)', space: 'O(1)' };
      case 'Selection Sort':
        return { time: 'O(n²)', space: 'O(1)' };
      case 'Insertion Sort':
        return { time: 'O(n²)', space: 'O(1)' };
      default:
        return { time: '', space: '' };
    }
  };

  animateAllSorts = (animations, onComplete) => {
    const arrayBars = document.getElementsByClassName('array-bar');
    for (let bar of arrayBars) bar.style.backgroundColor = INITIAL_COLOR;

    for (let i = 0; i < animations.length; i++) {
      const step = animations[i];
      const delay = i * 10 * (this.state.animationSpeed / 100);

      if (step.type === 'compare') {
        const [barOneIdx, barTwoIdx] = step.indices;
        setTimeout(() => {
          arrayBars[barOneIdx].style.backgroundColor = COMPARE_COLOR;
          arrayBars[barTwoIdx].style.backgroundColor = COMPARE_COLOR;
        }, delay);
      } else if (step.type === 'revert') {
        const [barOneIdx, barTwoIdx] = step.indices;
        setTimeout(() => {
          arrayBars[barOneIdx].style.backgroundColor = REVERT_COLOR;
          arrayBars[barTwoIdx].style.backgroundColor = REVERT_COLOR;
        }, delay);
      } else if (step.type === 'swap') {
        const [barIdx, newHeight] = step.indices;
        setTimeout(() => {
          arrayBars[barIdx].style.height = `${newHeight}px`;
        }, delay);
      }
    }

    setTimeout(() => {
      for (let bar of arrayBars) bar.style.backgroundColor = SORTED_COLOR;
      onComplete();
    }, animations.length * 10 * (this.state.animationSpeed / 100));
  };

  render() {
    const { array, isSorting, currentAlgorithm, animationSpeed, complexity } = this.state;

    return (
      <div>
        {currentAlgorithm && (
          <div style={{ marginBottom: "10px" }}>
            <h3>Currently running: {currentAlgorithm}</h3>
          </div>
        )}

        <div style={{ marginBottom: "10px" }}>
          <p><strong>Array Size:</strong> {array.length}</p>
          {complexity && (
            <>
              <p><strong>Time Complexity:</strong> {complexity.time}</p>
              <p><strong>Space Complexity:</strong> {complexity.space}</p>
            </>
          )}
        </div>

        <div className="array-container">
          {array.map((value, idx) => (
            <div
              className="array-bar"
              key={idx}
              style={{
                backgroundColor: INITIAL_COLOR,
                height: `${value}px`,
                width: `${Math.floor(700 / array.length)}px`,
              }}
            />
          ))}
        </div>

        <button onClick={this.resetArray} disabled={isSorting}>Generate New Array</button>
        <button onClick={() => this.startSort("Merge Sort")} disabled={isSorting}>Merge Sort</button>
        <button onClick={() => this.startSort("Quick Sort")} disabled={isSorting}>Quick Sort</button>
        <button onClick={() => this.startSort("Heap Sort")} disabled={isSorting}>Heap Sort</button>
        <button onClick={() => this.startSort("Bubble Sort")} disabled={isSorting}>Bubble Sort</button>
        <button onClick={() => this.startSort("Selection Sort")} disabled={isSorting}>Selection Sort</button>
        <button onClick={() => this.startSort("Insertion Sort")} disabled={isSorting}>Insertion Sort</button>

        <div style={{ marginTop: "10px" }}>
          <label>Animation Speed:&nbsp;</label>
          <select value={animationSpeed} onChange={this.setSpeed} disabled={isSorting}>
            <option value={1000}>Slow</option>
            <option value={500}>Medium</option>
            <option value={100}>Fast</option>
          </select>
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Array Size:&nbsp;</label>
          <select
            value={array.length}
            onChange={(e) => {
              const newSize = Number(e.target.value);
              this.setState({
                array: this.generateArray(newSize),
                complexity: null,
              });
            }}
            disabled={isSorting}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={40}>40</option>
            <option value={60}>60</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
    );
  }
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}