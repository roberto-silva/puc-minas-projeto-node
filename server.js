require('dotenv').config()

const server = require ('express')
const cors = require('cors');
const path = require ('path')
const app = server ()

app.use(cors())
app.use(server.json());
app.use(server.urlencoded({ extended: true }));
app.use('/app', server.static (path.join (__dirname, '/public')))

let port = process.env.PORT || 3000
app.listen (port)