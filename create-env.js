const fs = require('fs')
fs.writeFileSync('./.env', `
BASE_URL=${process.env.BASE_URL}\n
POSTS_URL=${process.env.POSTS_URL}\n
URL=${process.env.URL}\n
PER_PAGE=${process.env.PER_PAGE}\n
SEARCH_URL=${process.env.SEARCH_URL}\n
CONTACT_URL=${process.env.CONTACT_URL}
`)