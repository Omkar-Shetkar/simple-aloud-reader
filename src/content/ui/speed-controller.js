import { SPEED_PRESETS } from '../../common/constants.js';

/**
 * Creates the Reading Speed controller element.
 * @param {number} activeSpeed
 * @param {(newSpeed: number) => void} onSpeedChange
 * @returns {HTMLElement}
 */
export function createSpeedController(activeSpeed = 1.0, onSpeedChange = () => {}) {
  const container = document.createElement('div');
  container.className = 'aloud-speed-control';

  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'aloud-speed-btn';
  btn.title = 'Adjust Reading Speed';
  btn.textContent = `${activeSpeed}x`;

  let currentRate = activeSpeed;

  btn.addEventListener('click', () => {
    // Cycle through presets: 0.75x -> 1.0x -> 1.25x -> 1.5x -> 2.0x -> 0.75x
    const currentIndex = SPEED_PRESETS.indexOf(currentRate);
    const nextIndex = (currentIndex + 1) % SPEED_PRESETS.length;
    currentRate = SPEED_PRESETS[nextIndex];
    btn.textContent = `${currentRate}x`;
    onSpeedChange(currentRate);
  });

  container.appendChild(btn);

  // Method to update display if externally changed
  container.setSpeed = (rate) => {
    currentRate = rate;
    btn.textContent = `${rate}x`;
  };

  return container;
}
