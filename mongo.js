const mongoose = require('mongoose')

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url =
  `mongodb+srv://IanBleake:${password}@bleakeserver.vkb3v.mongodb.net/phonebookApp`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)
const person = new Person({
  name: personName,
  number: personNumber,
})

if (process.argv.length===3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}else{
  console.log("Process lenght:",process.argv.length);
  person.save().then(result => {
    console.log(`Added ${personName} number: ${personNumber} to phonebook`)
    mongoose.connection.close()
  })
}
