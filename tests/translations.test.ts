import assert from 'node:assert/strict';
import { test } from 'node:test';
import { translate } from '../src/content/translations.ts';
import { wishes } from '../src/content/wishes.ts';
import { transition } from '../src/app/story-state.ts';

test('language switch preserves wish identity and dynamic accessible labels', () => {
  for (const wish of wishes) {
    const english = translate(wish, 'en');
    assert.notEqual(english, wish);
    assert.equal(translate(english, 'vi'), wish);
    assert.equal(translate(english, 'en'), english);
  }
  assert.equal(translate('Mở lời chúc từ lồng đèn 12', 'en'), 'Open wish from lantern 12');
  assert.equal(
    translate('Preparing your companions · 1/2', 'vi'),
    'Đang chuẩn bị người bạn đồng hành · 1/2',
  );
  assert.equal(translate(' Thả lồng đèn ', 'en'), ' Release the lantern ');
});

test('back navigation returns to the bridge then home and cannot interrupt a release', () => {
  assert.equal(transition('scene2Ready', 'replay'), 'scene1Ready');
  assert.equal(transition('scene1Ready', 'back'), 'homeReady');
  assert.equal(transition('releasing', 'back'), 'releasing');
});
