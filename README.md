# TeleBot
## Daftar isi
- [Deskripsi](#deskripsi)
- [Instalasi](#instalasi)
- [config.json](#config)
- [Video Tutorial](#tutorial)
- [Contoh kode](#contoh)
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
pkg install nano git nodejs -y
git clone https://github.com/MuhammadRestu999/TeleBot
cd TeleBot
npm install
```
<br><br>
Di Ubuntu, VPS/RDP, etc :
```bash
apt update -y
apt upgrade -y
apt install nano git nodejs -y
git clone https://github.com/MuhammadRestu999/TeleBot
cd TeleBot
npm install
```
<br><br>
Deploy ke heroku :
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/MuhammadRestu999/TeleBot)

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
    <td>2 24</td>
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
    <td>Id Owner</td>
    <td>4 24</td>
    <td>Masukkan id owner ke sini</td>
    <td>Tidak </td>
  </tr>
  <tr>
    <td>Tautan Owner</td>
    <td>5 43</td>
    <td>Masukkan tautan owner ke sini (https://t.me/username)</td>
    <td>Tidak</td>
  </tr>
  <tr>
    <td>Nomor Owner</td>
    <td>6 31</td>
    <td>Masukkan nomor hp owner ke sini (628XXXXXXXXXX)</td>
    <td>Tidak</td>
  </tr>
  <tr>
    <td>Apikey OpenAI</td>
    <td>9 27</td>
    <td>Masukkan apikey OpenAI ke sini</td>
    <td>Ya</td>
  </tr>
</table>

<br><br><br><br><br>
## Tutorial
[![YouTube](https://img.youtube.com/vi/t_qWtyYNWDw/0.jpg)](https://www.youtube.com/watch?v=t_qWtyYNWDw)

<br><br><br><br><br>
## Contoh
Membalas pesan :
```javascript
ctx.reply("Hello World")
```
<br><br>
Membalas pesan dengan foto :
```javascript
// Url
await ctx.replyWithPhoto("https://static.zerochan.net/Misaki.Mei.full.1315931.jpg")

// Buffer
await ctx.replyWithPhoto({
  source: fs.readFileSync("misaki_mei.png")
})

// File
await ctx.replyWithPhoto({
  source: "misaki_mei.png"
})

// Dengan caption
await ctx.replyWithPhoto("https://static.zerochan.net/Misaki.Mei.full.1315931.jpg", {
  caption: "Misaki Mei"
})

// Album
await ctx.replyWithMediaGroup([
  {
    media: "https://static.zerochan.net/Misaki.Mei.full.1315931.jpg",
    caption: "Dari URL",
    type: "photo"
  },
  {
    media: {
      source: fs.readFileSync("MisakiMei_1.png")
    },
    caption: "Dari Buffer",
    type: "photo"
  },
  {
    media: {
      source: "MisakiMei_2.png"
    },
    caption: "Dari File",
    type: "photo"
  }
])
```
<br><br>
Untuk send video hanya perlu ganti dibagian "Photo" jadi "Video" type juga diganti dengan "video"
<br><br><br><br><br>
## Menjalankan bot
Untuk menjalankan bot<br>
Anda hanya perlu mengetik perintah di bawah ini :
```bash
node .
```
