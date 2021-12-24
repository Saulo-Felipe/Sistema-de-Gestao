const express = require('express')
const app = express()
const cors = require('cors')
const sequelize = require('./database/database.js')

app.use(express.json())

app.use(cors({ 
  origin: "http://localhost:3000", 
  credentials: true,
  optionSuccessStatus: 200
}))


app.post("/create-client", async (request, response) => {
  try {
    const { formState } = request.body

    await sequelize.query(`
    INSERT INTO cliente (nome, nascimento, telefone, bairro, rua, cidade, estado) 
    VALUES (
      '${formState.name}',
      '${formState.nascimento}',
      '${formState.phone}',
      '${formState.district}',
      '${formState.street}',
      '${formState.city}', 
      '${formState.state}'
    )
    `)

    return response.json({ status: true })
  }
  catch(error) {
    console.log("Error: ", error)

    return response.json({ status: false })
  }
})

app.post("/create-product", async (request, response) => {

  try {
    const { formState } = request.body

    console.log("Seu form: ", formState)

    await sequelize.query(`
      INSERT INTO produto (nome, marca, custo, revenda) VALUES (
        '${formState.name}',
        '${formState.marca}',
        ${formState.custo},
        ${formState.revenda}
      )
    `)

    await sequelize.query(`
      INSERT INTO estoque (id_produto, qtd_disponivel) VALUES 
      ((SELECT MAX(id) FROM produto), 0)
    `)
    
    return response.json({ status: true })
  }
  catch(error) {
    console.log("Error: ", error)
    return response.json({ status: false })
  }
})

app.post("/get-clients", async(request, response) => {

  try {
    var [result] = await sequelize.query(`
      SELECT id, nome FROM cliente
    `)

    return response.json({ status: true, clients: result })
  }
  catch(error) {
    console.log("Error: ", error)
    return response.json({ status: false })
  }
})

app.post("/get-products", async(request, response) => {
  
  try {
    var [result] = await sequelize.query(`
      SELECT produto.id, produto.nome, produto.revenda, estoque.qtd_disponivel FROM produto
      inner join estoque on produto.id = estoque.id_produto
      where estoque.id = (
        SELECT id FROM estoque 
        WHERE id_produto =  produto.id
        ORDER BY id DESC LIMIT 1
      )
    `)

    return response.json({ status: true, products: result })

  }
  catch(error) {
    console.log("Error: ", error)
    return response.json({ status: false })
  }
})

app.post("/create-sale", async(request, response) => {
  try {
    const { allPurchases, totalPrice, pedingValue, discount} = request.body
    var purchase = allPurchases[0]

    console.log("Dados recebidos: ", pedingValue, totalPrice)

    await sequelize.query(`
      INSERT INTO vendas (id_cliente, valor_total, desconto) VALUES
      (${purchase.clientID}, ${totalPrice}, ${discount}) 
    `)

    await sequelize.query(`
      INSERT INTO contas_pendentes (id_venda, valor_pendente, valor_recebido) VALUES 
      (
        (SELECT id FROM vendas ORDER BY id DESC LIMIT 1),
        ${pedingValue == 0 ? "NULL" : Number(pedingValue).toFixed(2)},
        NULL
      )
    `)
     
    for (var c = 0; c < allPurchases.length; c++) {
      var uniquePurchase = allPurchases[c]
      console.log("Inserindo: ", uniquePurchase)
      await sequelize.query(`
        INSERT INTO itens (id_venda, id_produto, quantidade, valor_total, valor_unitario) VALUES
        (
          (SELECT id FROM vendas ORDER BY id DESC LIMIT 1), 
          ${uniquePurchase.id}, 
          ${uniquePurchase.amount}, 
          ${Number(uniquePurchase.price) * Number(uniquePurchase.amount)},
          ${Number(uniquePurchase.price)}
        )
      `)
      
      var [quant] = await sequelize.query(`
        SELECT id, qtd_disponivel FROM estoque 
        WHERE id_produto =  ${uniquePurchase.id}
        ORDER BY id DESC LIMIT 1
      `)

      await sequelize.query(`
          INSERT INTO estoque (id_produto, qtd_disponivel) 
          VALUES (
            ${uniquePurchase.id}, 
            ${Number(quant[0].qtd_disponivel) - Number(uniquePurchase.amount)}
          )
      `)
    }

    return response.json({ status: true })

  }
  catch(error) {
    console.log("Error: ", error)
    return response.json({ status: false })
  }
})

app.post("/stock", async(request, response) => {

  try {
    const { type, id, newValue } = request.body

    if (type === "GET") {
      var [result] = await sequelize.query(`
        SELECT id, qtd_disponivel FROM estoque 
        WHERE id_produto = ${ id } 
        ORDER BY id DESC LIMIT 1
      `)
      
    } else {
      await sequelize.query(`
        INSERT INTO estoque (id_produto, qtd_disponivel) 
        VALUES (${id}, ${Number(newValue)}) 
      `)
    }
    return response.json({ status: true, valueOfProduct: result })
  }
  catch(error) {
    console.log("Error: ", error)
    return response.json({ status: false })
  }
})

app.post("/get-clients-debt", async(request, response) => {

  try {
    var [result] = await sequelize.query(`
      SELECT vendas.id_cliente, (SELECT nome FROM cliente WHERE id = vendas.id_cliente), SUM(vendas.valor_pendente - vendas.valor_recebido) as pendencia_final FROM vendas
      INNER JOIN cliente ON cliente.id = vendas.id_cliente
      GROUP BY id_cliente
      HAVING SUM(vendas.valor_pendente - vendas.valor_recebido) > 0
    `)

    return response.json({ status: true, clients: result })

  }
  catch(error) {
    console.log("Error: ", error)
    return response.json({ status: false })
  }
})

app.post("/get-sale-history", async(request, response) => {
  try {
    
    var { clientID } = request.body

    var [result] = await sequelize.query(`
      SELECT * FROM vendas 
      WHERE id_cliente = ${ clientID }
      AND (valor_pendente != 0 OR valor_recebido != 0) 
      ORDER BY id DESC LIMIT 10
    `)

    return response.json({ status: true, history: result })
  }
  catch(error) {
    console.log("Error: ", error)
    return response.json({ status: false })
  }
})

app.post("/create-receive", async(request, response) => {

  try {
  
    await sequelize.query(`
      INSERT INTO vendas (id_cliente, valor_total, valor_pendente) VALUES
      (${purchase.clientID}, ${totalPrice}, ${pedingValue}) 
    `)

  }
  catch(error) {
    console.log("Error: ", error)
    return response.json({ status: false })
  }
  
})



app.listen(8081, () => console.log("Server is running!"))