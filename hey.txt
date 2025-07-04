@echo off
set MSG=%*
curl -H "Content-Type: application/json" -X POST ^
 -d "{\"content\":\"%MSG%\"}" ^
 "https://discord.com/api/webhooks/1390625756639531010/kb4O5FJ9BX8_VGgHkVyA8HrhLICAf8sGX7C-aIMi_36i3WBpQkmfjk6KNGbM9tbtZ8Mf"
