Bracket Store
=============

Solution for developers who work in disconnected networks

## how to install
```
npm install bracket-store
```

## how to use
### download all package from bracket registry
```
npm run update
```

### run server and listen
```
npm start --port=8080
```

### change bracket to work with bracket store
#### Manual
1. go to <--Bracket_Path-->\www\
2. open config.json
3. change the keys:
```json
"extension_registry": "http://<-dns->:<-port->/registry.json",
"extension_url": "http://<-dns->:<-port->/{0}/{0}-{1}.zip",
```

#### auto in windows
```
npm run change --url="http://your_url" --port=8080
```
1. default url = "https://localhost"
2. default port = 8080

#### restore to old url
```
npm run restore
```