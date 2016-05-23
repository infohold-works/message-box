import mongoose from 'mongoose'

const Schema = mongoose.Schema

const feedbackSchema = new Schema({
  userid: String,
  created_time: String,
  feedback_desc: String
})

const Feedback = mongoose.model('Mb_feedback', feedbackSchema)

export default Feedback
