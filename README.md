# cityhall

A communication system for the city.

市のためのやりとりシステム。

## How to use

### core/

This is the server system.

これはサーバーシステムです。

[city side server]
```
% deno run --allow-net --allow-read --allow-write server-city.js
```
[citizen side server]
```
% deno run --allow-net --allow-read --allow-write server-citizen.js
```

### city/

This is for city hall side.
Open ```file://***/www/index.html``` on your browser.

これは市側のためのものです。
```file://***/www/index.html``` をブラウザで開きます。

### citizen/

This is for citizen side.
Open ```file://***/www/index.html``` on your browser.

これは市民側のためのものです。
```file://***/www/index.html``` をブラウザで開きます。

## License

CC-BY
