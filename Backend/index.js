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

    await sequelize.query(`
      INSERT INTO produto (nome, marca, quantidade, custo, revenda) VALUES (
        '${formState.name}',
        '${formState.marca}',
        ${formState.quantidade},
        ${formState.custo},
        ${formState.revenda}
      )
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
      SELECT id, nome, revenda FROM produto
    `)

    return response.json({ status: true, products: result })

  }
  catch(error) {
    console.log("Error: ", error)
    return response.json({ status: false })
  }

})


app.listen(8081, () => console.log("Server is running!"))