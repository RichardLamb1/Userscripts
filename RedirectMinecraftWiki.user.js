// ==UserScript==
// @name         RedirectMinecraftWiki
// @namespace    https://richardlamb.dev/
// @description  Redirects Minecraft Wiki to the new URL
// @version      1
// @license      Public Domain
// @match        *://minecraft.fandom.com/*
// @run-at       document-start
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/RichardLamb1/Userscripts/refs/heads/main/RedirectMinecraftWiki.user.js
// ==/UserScript==

window.location = 'https://minecraft.wiki/' + window.location.toString().substring(34);
