import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeRelease, safeReleaseUrl, getReleases, formatSize } from '../assets/releases.mjs';
const root='https://github.com/malikali4129/AIM-DOWNLOADER-RELEASE/releases';
const release={tag_name:'v1.0.7',html_url:root+'/tag/v1.0.7',published_at:'2026-09-11T21:03:46Z',assets:[
  {name:'AIM-DOWNLOADER-1.0.7-win-x64-setup.exe',size:92000000,browser_download_url:root+'/download/v1.0.7/AIM-DOWNLOADER-1.0.7-win-x64-setup.exe'},
  {name:'AIM-DOWNLOADER-1.0.7-win-x64-portable.zip',size:93000000,browser_download_url:root+'/download/v1.0.7/AIM-DOWNLOADER-1.0.7-win-x64-portable.zip'},
  {name:'SHA256SUMS.txt',size:220,browser_download_url:root+'/download/v1.0.7/SHA256SUMS.txt'}]};
test('discovers verified package types without guessing URLs',()=>{const r=normalizeRelease(release); assert.equal(r.installer.url,release.assets[0].browser_download_url);assert.ok(r.portable);assert.ok(r.checksums);});
test('missing or unrelated assets never become download buttons',()=>{assert.equal(normalizeRelease({...release,assets:[]}).installer,null);assert.equal(normalizeRelease({...release,assets:[{...release.assets[0],name:'unrelated.exe'}]}).installer,null);});
test('drafts and prereleases are excluded',()=>{assert.equal(normalizeRelease({...release,draft:true}),null);assert.equal(normalizeRelease({...release,prerelease:true}),null);});
test('rejects malformed data and unsafe asset destinations',()=>{assert.equal(normalizeRelease(null),null);assert.equal(normalizeRelease({}),null);assert.equal(safeReleaseUrl('javascript:alert(1)'),null);assert.equal(safeReleaseUrl('https://evil.example/download'),null);assert.equal(safeReleaseUrl('https://github.com/other/repo/releases/tag/v1'),null);assert.equal(safeReleaseUrl('https://github.com@evil.example/a'),null);assert.equal(normalizeRelease({...release,assets:[{...release.assets[0],browser_download_url:'https://evil.example/app.exe'}]}).installer,null);});
test('invalid dates and sizes are omitted',()=>{assert.equal(normalizeRelease({...release,published_at:'bad'}).date,null);assert.equal(formatSize(null),'');assert.equal(formatSize(1048576),'1 MB');});
test('API failure, malformed response, and no releases remain distinguishable',async()=>{await assert.rejects(getReleases(false,async()=>({ok:false,status:403})));await assert.rejects(getReleases(true,async()=>({ok:true,json:async()=>({})})));assert.deepEqual(await getReleases(true,async()=>({ok:true,json:async()=>[]})),[]);});
test('history excludes unstable releases and latest result normalizes correctly',async()=>{assert.equal((await getReleases(true,async()=>({ok:true,json:async()=>[{...release,draft:true},release]}))).length,1);assert.equal((await getReleases(false,async()=>({ok:true,json:async()=>release})))[0].tag,'v1.0.7');});
