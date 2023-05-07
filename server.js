require('dotenv').config()

const server = require ('express')
const cors = require('cors');
const path = require ('path')
const app = server ()

app.use(cors())
app.use(server.json());
app.use(server.urlencoded({ extended: true }));
app.use('/app', server.static (path.join (__dirname, '/public')))

const knex = require('knex')({
    client: 'sqlite3',
    debug: true,
    connection: {
        filename: './dev.sqlite3'
    }
});


//--- CRUD de Animes ---//

// Create - Animes
app.post ('/api/v1/animes', (req, res) => {
    knex('animes').insert(req.body, ['id'])
        .then(animes => {
            let id = animes[0].id;
            res.json({message: `Anime inserido com sucesso.`, id})
        })
        .catch(err => res.json({message: `Erro ao inserir anime.: ${err.message}`}))
})

// Get All - Animes
app.get ('/api/v1/animes', function (req, res) {
    knex.select('*').from('animes')
        .then(animes => res.json(animes))
        .catch(err => res.json({message: `Erro ao recuperar animes.: ${err.message}`}));
})

// Get by id - Animes
app.get ('/api/v1/animes/:id', function (req, res) {
    const id = Number(req?.params?.id);
    knex.select('*').from('animes').where({id})
        .then(animes => res.json(animes))
        .catch(err => res.status(404).json({message: `Erro ao recuperar animes.: ${err.message}`}));
})

// Update - Animes
app.put('/api/v1/animes/:id', (req, res) => {
    const id = Number(req.params.id);
    knex('animes').delete(req.body, ['id']).where({id})
        .then(animes => {
            let id = animes[0].id;
            res.json({message: `Anime atualizado com sucesso.`, id})
        })
        .catch(err => res.json({message: `Erro ao atualizar anime.: ${err.message}`}))
})

// Delete - Animes
app.delete('/api/v1/animes/:id', (req, res) => {
    const id = Number(req.params.id);
    knex('animes').delete().where({id})
        .then(() => {
            res.json({message: `Anime deletado com sucesso.`, id})
        })
        .catch(err => res.json({message: `Erro ao deletar anime.: ${err.message}`}))
})

app.use (function (req, res) {
    res.status(404).send('Recurso não encontrado.')
})

let port = process.env.PORT || 3000
app.listen (port)