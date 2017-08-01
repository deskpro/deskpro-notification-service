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

    $ npm run build

## Run the code

    $ node dist/index.js
    
Or you can just type:

    $ npm run start

This will build code and start server

# Configuring deskpro

In your ``config.settings.php`` under ``/config/advanced`` directory

You have to change default strategy to ``deskpro``, like this:

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

