require('dotenv').config()
const gameServer = require('./app')

const PORT = process.env.PORT || 3000

gameServer.listen(PORT).then(console.log(`Listening on http://localhost:${PORT}`))
