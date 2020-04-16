const inquirer = require('inquirer')
const _ = require('lodash')

let EmployeeTypes = require('./employeeTypes.js')
let team = []



async function main() {

  async function createEmployee(type) {
    try {
      const role = type || await inquirer.prompt({
        type: 'input',
        name: 'type',
        message: `Enter role (${ Object.keys(_.omit(EmployeeTypes, ['Manager'])) })`,
      })
      if(!Object.keys(EmployeeTypes).includes(role.type)) {
        console.log('Invalid employee type.')
      }
      else {
        team.push(new EmployeeTypes[role.type]())
        await team[team.length - 1].ask()
      }
    }
    catch(err) {
      console.log(err)
    }
  }

  async function loop() { // adds employees til the user doesn't want to add any more
    const enterNew = await inquirer.prompt({
      type: 'input',
      name: 'res',
      message: 'Enter new employee? (y/n)',
    })
    if(enterNew.res.toLowerCase() == 'y') {

      await createEmployee()
      loop()
    }
    else {
      renderTeam()
    }
  }

  function renderTeam() {
    console.log(team.map(employee => employee.render()).join(''))
  }

  // We have to have a manager so we add that first
  await createEmployee({ 'type': 'Manager' })
  loop()
}



main()
