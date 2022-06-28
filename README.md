# TeleBot
## Daftar isi
- [Deskripsi](#deskripsi)
- [Instalasi](#instalasi)
- [config.json](#config)
- [Video Tutorial](#tutorial)
- [Menjalankan bot](#menjalankan-bot)
<br><br><br><br><br>
## Deskripsi
TeleBot adalah skrip bot Telegram yang menggunakan NodeJS dan modul [telegraf](https://telegraf.js.org)
<br><br><br><br><br>
## Instalasi
Cara menginstal TeleBot
<br><br>
Di Termux :
```bash
pkg update -y
pkg upgrade -y
pkg install nano git nodejs-lts -y
git clone https://github.com/MuhammadRestu999/TeleBot
cd TeleBot
npm install
```
<br><br>
Di Ubuntu, VPS/RDP, etc :
```bash
apt update -y
apt upgrade -y
apt install nano git nodejs-lts -y
git clone https://github.com/MuhammadRestu999/TeleBot
cd TeleBot
npm install
```
<br><br><br><br><br>
## Config
Edit file config.json :
<table>
  <tr>
    <th>Nama</th>
    <th>Baris</th>
    <th>Deskripsi</th>
    <th>Wajib</th>
  </tr>
  <tr>
    <td>Token</td>
    <td>2 30</td>
    <td>Masukkan token bot ke sini</td>
    <td>Ya</td>
  </tr>
  <tr>
    <td>Nama Owner</td>
    <td>3 18</td>
    <td>Masukkan nama owner ke sini</td>
    <td>Tidak</td>
  </tr>
  <tr>
    <td>Tautan Owner</td>
    <td>4 96</td>
    <td>Masukkan tautan owner ke sini (https://t.me/username)</td>
    <td>Tidak</td>
  </tr>
  <tr>
    <td>Id Owner</td>
    <td>5 122</td>
    <td>Masukkan id owner ke sini</td>
    <td>Tidak </td>
  </tr>
</table>

<br><br><br><br><br>
## Tutorial
[![YouTube](https://img.youtube.com/vi/t_qWtyYNWDw/0.jpg)](https://www.youtube.com/watch?v=t_qWtyYNWDw)

<br><br><br><br><br>
## Menjalankan bot
Untuk menjalankan bot<br>
Anda hanya perlu mengetik perintah di bawah ini :
```bash
node .
```
