# Web mongodb query interface

Web interface to query mongo

1. Type your query (as in Mongo Shell or language)
2. Click on submit
3. Process inside:
    1. Save query in text file named `__query.js`
    2. Execute bash command: `mongo --quiet < __query.js > __result.json`
    3. Read text file `__result.json` 

## Require

- Express
- ejs
- body-parser

## JS libraries

- jQuery
- ACE
- Bootstrap