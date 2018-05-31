# Running deskpro-notification-service

## Installing dependencies

1. Clone or download this repo

2. After that install all dependencies:

    $ npm install

## Transpile the code

    $ npm run prod:build

## Configure

### Basic configuration

Copy `config.json.dist` -> `config.json`

Fill up config file with propper secret and port number you want to bind.

Also you may want to use secure connections, so don't forget to enable `secure` in config
and provide paths to your key and certificate files.

    "keyFile":   "/path/to/private.key",
    "certFile":  "/path/to/certificate/bundle"


You can set up host (or IP) you want to bind to.

    "host": "1.2.3.4"
    
Sometimes your data for messages is too large to be sent.

Deskpro Notification Service offers you two ways to solve that:
1. Do nothing. We will multiplex messages for you, and send your data chopped to several pieces.
Default maximum message size is 100Kb.
2. You can change default 100Kb maximum messages size. Just set `maxBody` in your `config.json`, you can use values like
"500Kb", "5Mb" etc. Please don't forget to set same size (in bytes) in `config.settings.php` under your deskpro installation.
The key for the setting in deskpro config file is `notification.settings.deskpro_client.max_message_size`.


### Configuring your nginx to pass requests to node.

Sometimes you are restricted to only use one port number (e.g. 443), so you can't just bind to port you want on public interface.

You may configure nginx, to bypass this restriction. Example config could be found below.

    upstream node {
      server 127.0.0.1:3000;
    }

    location /socket.io {
        proxy_pass https://node;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    location /test {
       proxy_pass https://node;
    }
    
    location /send {
        proxy_pass https://node;
    }
    
In

    Admin -> Server -> Realtime Events -> Deskpro Notification Service

you have to set port your nginx listen, and send all your requests there

## Run the code

    $ node dist/index.js
    
Or you can just type:

    $ npm run prod:start
    
This will build code and start server
    
For dev:

    $ npm run dev:build
    $ npm run dev:start 

# Configuring deskpro

Proceed to Admin->Server->Realtime events on your deskpro installation and pick up `Deskpro` option there.
Enter required information.

Or you can change ``config.settings.php`` under ``/config/advanced`` directory

Replace default strategy to ``deskpro``, like this:

```php
  ...
  'notification.settings.default_strategy' => [
      'strategy' => 'immediate',
      'delivery' => [
          'deskpro',
      ],
  ],
  ...
```

If you want to enabled client debug info then add following in your `config.settings.php`

    'notification.settings.deskpro_client.debug'  => true,
