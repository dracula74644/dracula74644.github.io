@echo off
set MSG=%*
curl -H "Content-Type: application/json" -X POST ^
 -d "{\"content\":\"%MSG%\"}" ^
 "https://discord.com/api/webhooks/1308072993993265152/lJejN1Hyzp1-uGP_nCdIzP75SiljfFfjlwoIntJKUbHRH0RBcW-U1a_jrfY_NX_ekSg1"
