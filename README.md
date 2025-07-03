# Klimasun Website

The site supports both Turkish and English.

This repository contains the static files and admin scripts for the Klimasun demo website.

## Local development

You can preview the site by starting a simple HTTP server from the project root:

```bash
python3 -m http.server
```

Then open [http://localhost:8000/index.html](http://localhost:8000/index.html) in your browser.
If your browser language is not Turkish, the landing page will automatically redirect you to the English version under `pages/en/home.html`.

## Database configuration

The admin PHP scripts read database credentials from environment variables. Set these before running the admin panel:

- `DB_HOST` – database hostname (default `localhost`)
- `DB_USER` – username (default `root`)
- `DB_PASS` – password (default `123qwe`)
- `DB_NAME` – database name (default `world`)

Example on Linux:

```bash
export DB_HOST=localhost
export DB_USER=myuser
export DB_PASS=mypassword
export DB_NAME=mydb
```

## Tests

This project does not include automated tests.
