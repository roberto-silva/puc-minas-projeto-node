// Importa o módulo do Express Framework e o body parse
const express = require ('express')
const bodyParser = require('body-parser')

const https = require('https');
const fs = require('fs');
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/projetonode.vps.webdock.cloud/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/projetonode.vps.webdock.cloud/fullchain.pem')
};

// Inicializa um objeto de aplicação Express e configura o body parse
const app = express ()
app.use(bodyParser.json())

// Banco de dados fake
const lista_produtos = {
    produtos: [
        { id: 1, descricao: "Arroz parboilizado 5Kg", valor: 25.00, marca: "Tio João"  },
        { id: 2, descricao: "Maionese 250gr", valor: 7.20, marca: "Helmans"  },
        { id: 3, descricao: "Iogurte Natural 200ml", valor: 2.50, marca: "Itambé"  },
        { id: 4, descricao: "Batata Maior Palha 300gr", valor: 15.20, marca: "Chipps"  },
        { id: 5, descricao: "Nescau 400gr", valor: 8.00, marca: "Nestlé"  },
    ]
}

//--- CRUD de Produtos ---//

// Get All - Produtos
app.get ('/produtos', function (req, res) {
    res.status(200).send(lista_produtos);
})

// Get by id - Produtos
app.get ('/produtos/:id', function (req, res) {
    const id = Number(req?.params?.id);
    const produto = lista_produtos.produtos.find(produto => produto.id === id);

    if (!!produto) {
        res.status(200).json(produto);
    } else {
        tratarProdutoNaoEncontrado(res, id);
    }
})

// Create - Produtos
app.post ('/produtos', (req, res) => {
    const produto = req.body;
    produto.id = getUltimoProduto().id + 1
    lista_produtos.produtos.push(produto)
    res.status(201).json(produto)
})

// Update - Produtos
app.put('/produtos/:id', (req, res) => {
    const id = Number(req.params.id);
    const produtoIndex = lista_produtos.produtos.findIndex(produto => produto.id === id);

    if (!!produtoIndex) {
        lista_produtos.produtos[produtoIndex] = req.body;
        res.status(200).json(lista_produtos.produtos[produtoIndex]);
    } else {
        tratarProdutoNaoEncontrado(res, id);
    }
})

// Delete - Produtos
app.delete('/produtos/:id', (req, res) => {
    const id = Number(req.params.id);
    const produtoIndex = lista_produtos.produtos.findIndex(produto => produto.id === id);

    if (produtoIndex !== -1) {
        lista_produtos.produtos.splice(produtoIndex, 1);
        res.status(200).json();
    } else {
        tratarProdutoNaoEncontrado(res, id);
    }
})

app.use (function (req, res) {
    res.status(404).send('Recurso não encontrado.')
})

function tratarProdutoNaoEncontrado(res, id) {
    res.status(404).json({message: `Produto não encontrado, id: ${id}`});
}

function getUltimoProduto() {
    return lista_produtos.produtos[lista_produtos.produtos.length -1]
}

// Inicializa o servidor HTTP na porta 3000
app.listen (3000, function () {
  console.log ('Servidor rodando na porta 3000')
})
