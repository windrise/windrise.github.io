import assert from 'node:assert/strict';
import {chromium,expect} from '@playwright/test';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {mkdir} from 'node:fs/promises';
const base=process.env.SLIDES_BASE_URL||'http://127.0.0.1:4173';
const server=process.env.SLIDES_BASE_URL?null:spawn(process.execPath,['slides/scripts/preview.mjs'],{stdio:['ignore','pipe','inherit']});
let browser;
try {
 if(server)await once(server.stdout,'data');
 browser=await chromium.launch({...(process.env.CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.CHROMIUM_EXECUTABLE_PATH}:{})});
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await mkdir('/tmp/slidev-recipe-shots',{recursive:true});
 for(const slide of [2,3]){
  await page.goto(`${base}/slides/design-recipes/#/${slide}`);
  const card=page.locator(`#slide-content [data-slidev-no="${slide}"] .recipe-player`);
  await expect(card).toBeVisible();
  await expect(card.locator('output')).toHaveText('100%');
  await card.getByRole('button',{name:'重播动画'}).click();
  await expect(card.getByRole('button',{name:'暂停',exact:true})).toBeVisible();
  await page.waitForTimeout(350);
  await card.getByRole('button',{name:'暂停',exact:true}).click();
  const stopped=await card.locator('output').innerText();await page.waitForTimeout(150);assert.equal(await card.locator('output').innerText(),stopped);
  await card.locator('input').fill('0.5'); await expect(card.locator('output')).toHaveText('50%');
  await card.locator('input').focus();await page.keyboard.press('ArrowRight');assert.equal(new URL(page.url()).hash,`#/${slide}`);
  await card.locator('input').fill('1');
  await page.screenshot({path:`/tmp/slidev-recipe-shots/recipe-${slide}.png`});
  await card.getByRole('button',{name:'重播动画'}).click();await page.waitForTimeout(4300);await expect(card.locator('output')).toHaveText('100%');
  await page.reload();await expect(card.locator('output')).toHaveText('100%');
  const overflowing=await page.locator(`#slide-content [data-slidev-no="${slide}"] .slidev-layout`).evaluate(el=>el.scrollHeight>el.clientHeight+2);assert.equal(overflowing,false);
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();
 const card=page.locator('#slide-content [data-slidev-no="3"] .recipe-player');await card.getByRole('button',{name:'显示终态'}).click();await expect(card.locator('output')).toHaveText('100%');await expect(card.locator('.reduced')).toBeVisible();
 assert.deepEqual(errors,[]);console.log('Recipe interaction checks passed: replay, pause, scrub, keyboard, finish, reload, reduced motion, no overflow.');
}finally{await browser?.close();server?.kill();}
