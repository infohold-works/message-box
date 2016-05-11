import mongoose from 'mongoose'

const Schema = mongoose.Schema

const summarySchema = new Schema({
  userid: String,
  typeid: Number,
  message: [{
    id: Number,
    title: String,
    desc: String,
    sendtime: String,
    read: Boolean
  }],
  count: Number
})

export default mongoose.model('Mb_summary', summarySchema)
