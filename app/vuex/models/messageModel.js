import mongoose from 'mongoose'

const Schema = mongoose.Schema

const messageSchema = new Schema({
  id: Number,
  userid: String,
  userbrc: String,
  typeid: Number,
  type: String,
  title: String,
  author: String,
  desc: String,
  content: String,
  sendtime: String
})

export default mongoose.model('Mb_message', messageSchema)
