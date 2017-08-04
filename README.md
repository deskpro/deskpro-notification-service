# Running deskpro-notification-service

--------
**Disclaimer**:

Please note it's just a Proof-Of-Concept, so the code is dirty and security is absent almost at all, but auth only.

Also do not forget to checkout ``deskpro-notification-service`` branch for main repository.

--------

## Installing dependencies

After checkout, run npm:

    $ npm install

## Transpile the code

    $ npm run prod:build

## Configure

Copy `config.json.dist` -> `config.json`

Fill up config file with propper secret and port number you want to bind.

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