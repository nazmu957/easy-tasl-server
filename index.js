const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
require('dotenv').config()
const port = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())

//code

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lxrexps.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
})

async function run() {
  try {
    const addTaskCollection = client.db('easyTask').collection('addTask')
    const myTaskCollection = client.db('easyTask').collection('myTasks')

    app.get('/addTask', async (req, res) => {
      const query = {}
      const cursor = myTaskCollection.find(query)
      const tasks = await cursor.toArray()
      res.send(tasks)
    })

    app.get('/addTask/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const user = await myTaskCollection.findOne(query)
      res.send(user)
    })

    app.post('/addTask', async (req, res) => {
      const newList = req.body
      console.log(newList)
      const result = await myTaskCollection.insertOne(newList)
      //   console.log(result)
      res.send(result)
    })

    app.put('/addTask/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: ObjectId(id) }
      const task = req.body
      console.log(task)
      const option = { upsert: true }
      const updateTask = {
        $set: {
          taskList: task.taskList,
        },
      }
      const result = await myTaskCollection.updateOne(
        filter,
        updateTask,
        option,
      )
      res.send(result)
    })

    // make completed
    app.put('/complete/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: ObjectId(id) }
      const option = { upsert: true }
      const updateTask = {
        $set: {
          status: 'complete',
        },
      }
      const result = await myTaskCollection.updateOne(
        filter,
        updateTask,
        option,
      )
      res.send(result)
    })

    app.delete('/addTask/:id', async (req, res) => {
      const id = req.params.id
      // console.log('trying to delete', id);
      const query = { _id: ObjectId(id) }
      const result = await myTaskCollection.deleteOne(query)
      console.log(result)
      res.send(result)
    })
  } finally {
  }
}
run().catch(console.log)

app.get('/', (req, res) => {
  res.send('Easy task Server Running')
})

app.listen(port, () => {
  console.log(`Easy Task server running on port ${port}`)
})
