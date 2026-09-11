const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const base=process.env.SITE_URL||'http://127.0.0.1:4173';
const output=process.env.QA_OUTPUT||path.join(__dirname,'.artifacts');fs.mkdirSync(output,{recursive:true});
const github='https://github.com/malikali4129/AIM-DOWNLOADER-RELEASE/releases';
const fixture={tag_name:'v1.0.7',name:'v1.0.7',published_at:'2026-09-11T21:03:46Z',html_url:github+'/tag/v1.0.7',assets:[
 {name:'AIM-DOWNLOADER-1.0.7-win-x64-setup.exe',size:92000000,browser_download_url:github+'/download/v1.0.7/AIM-DOWNLOADER-1.0.7-win-x64-setup.exe'},
 {name:'AIM-DOWNLOADER-1.0.7-win-x64-portable.zip',size:93000000,browser_download_url:github+'/download/v1.0.7/AIM-DOWNLOADER-1.0.7-win-x64-portable.zip'},
 {name:'SHA256SUMS.txt',size:220,browser_download_url:github+'/download/v1.0.7/SHA256SUMS.txt'}]};
(async()=>{
 const browser=await chromium.launch({headless:true, ...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {})});
 try {
  const context=await browser.newContext(); let mode='success';
  await context.route('https://api.github.com/**',route=>{
   if(mode==='error')return route.fulfill({status:403,body:'rate limited'});
   if(mode==='missing')return route.fulfill({json:{...fixture,assets:[]}});
   if(mode==='empty')return route.fulfill({json:[]});
   if(mode==='unsafe')return route.fulfill({json:[{...fixture,name:'<img src=x onerror=alert(1)>',assets:[]}]});
   return route.fulfill({json:route.request().url().includes('?')?[fixture]:fixture});
  });
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const width of [390,768,1440]){
   await page.setViewportSize({width,height:950});
   for(const route of ['/','/download/','/getting-started/','/support/','/releases/','/404.html']){
    await page.goto(base+route);await page.waitForLoadState('networkidle');
    assert.equal(await page.locator('h1').count(),1,route);
    assert.equal(await page.locator('link[rel=canonical]').count(),1);
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`Overflow ${route} at ${width}`);
    assert.equal(await page.locator('img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0)),true,`Broken image ${route}`);
    for(const href of await page.locator('a[href^="/"]').evaluateAll(a=>a.map(x=>x.getAttribute('href')).filter(h=>!h.includes('#')))){
     const response=await context.request.get(base+href);assert.ok(response.ok(),`Broken local link ${href}`);
    }
    if(width===1440 || width===390)await page.screenshot({path:path.join(output,`${width}-${route==='/'?'home':route.replaceAll('/','').replace('.html','')}.png`),fullPage:true,animations:"disabled"});
   }
  }
  await page.setViewportSize({width:390,height:844});await page.goto(base+'/');
  const menu=page.locator('.menu-toggle');await menu.click();assert.equal(await menu.getAttribute('aria-expanded'),'true');assert.equal(await page.locator('#navigation').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await menu.getAttribute('aria-expanded'),'false');
  await page.goto(base+'/support/');await page.locator('summary').first().click();assert.equal(await page.locator('details').first().getAttribute('open'),'');
  mode='success';await page.goto(base+'/download/');await page.waitForLoadState('networkidle');assert.equal(await page.locator('[data-asset="installer"]').getAttribute('href'),fixture.assets[0].browser_download_url);assert.equal(await page.locator('[data-asset="portable"]').isVisible(),true);
  mode='missing';await page.reload();await page.waitForLoadState('networkidle');assert.equal(await page.locator('[data-asset="installer"]').isVisible(),false);assert.equal(await page.locator('[data-missing="installer"]').isVisible(),true);
  mode='error';await page.reload();await page.waitForLoadState('networkidle');assert.match(await page.locator('[data-release-status]').textContent(),/unavailable/);assert.equal(await page.locator('[data-asset="installer"]').isVisible(),false);assert.ok(await page.getByText('View downloads on GitHub').first().isVisible());
  mode='empty';await page.goto(base+'/releases/');await page.waitForLoadState('networkidle');assert.match(await page.locator('[data-release-status]').textContent(),/No stable/);
  mode='unsafe';await page.reload();await page.waitForLoadState('networkidle');assert.equal(await page.locator('.release-list img').count(),0);assert.ok((await page.locator('.release-list').textContent()).includes('<img'));
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/');assert.equal(await page.locator('.hero-copy').evaluate(e=>getComputedStyle(e).animationName),'none');
  await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Skip to content');await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.id),'main');
  const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});const plain=await nojs.newPage();await plain.goto(base+'/download/');assert.equal(await plain.locator('#navigation').isVisible(),true);assert.equal(await plain.locator('[data-asset="installer"]').isVisible(),false);assert.ok(await plain.getByText('View downloads on GitHub').first().isVisible());
  assert.deepEqual(errors,[]);console.log('PASS: all pages at mobile/tablet/desktop; links, images, menu, FAQ, keyboard, reduced motion, release success/missing/error/empty/unsafe data, and no-JS fallback.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});


