# Klassefest backend

## User routes

GET /user : Get user profile + settings
POST /user/settings : Store user settings
Login/logout: Use passport.js with SAML?


## Suggestion routes (Lille hjelper)

GET /suggestions?isbns=isbn1,isbn2 - get all suggestions
GET /suggestions?isbns=isbn1,isbn2&provider=lc - get suggestions from one provider

## Alma records

GET /records/:id    returns a parsed, simple version of the marcxml
POST /records/:id   posts the same, simple version, allows the server to store activity


## Providers

GET /providers


## Usage
nodemon --exec babel-node
