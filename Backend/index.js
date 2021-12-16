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
  }
})


app.listen(8081, () => console.log("Server is running!"))