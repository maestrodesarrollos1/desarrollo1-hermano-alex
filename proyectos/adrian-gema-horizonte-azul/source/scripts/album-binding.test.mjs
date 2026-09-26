import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bindAlbumMotion, turnAlbumPage } from '../src/lib/album-binding.ts';

test('toolbar turns target real corners even with an offscreen portrait spine', () => {
  for (const left of [-320, 0, 35]) {
    const rect = { left, top: 12, width: 640, height: 420 };
    const points = [];
    const book = {
      getRender: () => ({ getRect: () => rect }),
      getFlipController: () => ({ flip: point => points.push(point) }),
    };
    turnAlbumPage(book, -1);
    turnAlbumPage(book, 1);
    assert.deepEqual(points, [{ x: left + 10, y: 430 }, { x: left + 630, y: 430 }]);
  }
});

test('cover geometry follows both directions, cancelled drags and portrait layout', () => {
  let queued;
  const oldRequest = globalThis.requestAnimationFrame;
  const oldCancel = globalThis.cancelAnimationFrame;
  globalThis.requestAnimationFrame = callback => { queued = callback; return 1; };
  globalThis.cancelAnimationFrame = () => { queued = null; };
  let index = 0;
  let progress = 0;
  let direction = 0;
  let positioned = false;
  let orientation = 'landscape';
  const values = new Map();
  const surface = { dataset: {}, style: { setProperty: (key, value) => values.set(key, value) } };
  const book = {
    getOrientation: () => orientation,
    getPageCount: () => 14,
    getCurrentPageIndex: () => index,
    getFlipController: () => ({ getCalculation: () => ({
      getPosition: () => positioned ? { x: 1, y: 1 } : undefined,
      getFlippingProgress: () => { assert.ok(positioned); return progress; },
      getDirection: () => direction,
    }) }),
  };
  const binding = bindAlbumMotion(book, surface);
  const center = () => Number.parseFloat(values.get('--nb-center'));
  try {
    binding.sync();
    assert.equal(center(), -25);
    binding.state('flipping');
    queued(); // The library announces a turn before its first calculation.
    assert.equal(center(), -25);
    binding.state('read');
    positioned = true;

    for (const [from, to, dir, start, end] of [
      [0, 1, 0, -25, 0], [1, 0, 1, 0, -25],
      [11, 13, 0, 0, 25], [13, 11, 1, 25, 0],
    ]) {
      index = from;
      direction = dir;
      progress = 0;
      binding.sync();
      binding.state('user_fold');
      queued();
      assert.equal(center(), start);
      progress = 100;
      queued();
      assert.equal(center(), end);
      // Reversing a partial drag must restore the exact closed/open position.
      progress = 0;
      queued();
      assert.equal(center(), start);
      progress = 100;
      queued();
      index = to;
      binding.sync();
      binding.state('read');
      assert.equal(center(), end);
      assert.equal(queued, null);
    }
    orientation = 'portrait';
    index = 13;
    binding.sync();
    assert.equal(center(), 0);
    assert.equal(surface.dataset.layout, 'portrait');
    binding.state('flipping');
    binding.destroy();
    assert.equal(queued, null);
  } finally {
    binding.destroy();
    globalThis.requestAnimationFrame = oldRequest;
    globalThis.cancelAnimationFrame = oldCancel;
  }
});
