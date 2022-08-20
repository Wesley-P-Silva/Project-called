const { response } = require('express')
const express = require('express')
const port = 3000

const app = express()
app.use(express.json())
const uuid = require('uuid')

const orders = []

const checkId = (request, response, next) => {
  const {id} = request.params

  const index = orders.findIndex(order => order.id === id)

  if(index < 0){
    return response.status(404).json({error: "Order not found"})
  }

  request.orderIndex = index
  request.orderId = id

  next()
}

const definition = (request, response, next) => {
  console.log(request.method, request.path)
  
  next()
}

app.get('/order', definition, (request, response) => {
  return response.json(orders)
}) 

app.post('/order', definition, (request, response) => {
  const {order, clientName, price} = request.body

  const called = {id: uuid.v4(), order, clientName, price, status: "Em preparação"}

  orders.push(called)
  return response.status(201).json(called)
})

app.put('/order/:id', checkId, definition, (request, response) => {
  const id = request.orderId
  const index = request.orderIndex
  const {order, clientName, price} = request.body

  const updatedCalled = {id, order, clientName, price, status: "Em preparação"}
  
  orders[index] = updatedCalled

  return response.status(202).json(updatedCalled)
})

app.delete('/order/:id', checkId, definition, (request, response) => {
  const index = request.orderIndex

  orders.splice(index,1)

  return response.status(204).json(orders)
})

app.get('/order/:id', checkId, definition, (request, response) => {
  const index = request.orderIndex

  const called = orders[index]

  return response.json(called)
}) 

app.patch('/order/:id', checkId, definition, (request, response) => {
  const index = request.orderIndex
  const called = orders[index]

  called.status = "Pronto"

  return response.status(202).json(called)
})

app.listen(3000, () =>{
  console.log(`🟢 Server started on port ${port}`)
})