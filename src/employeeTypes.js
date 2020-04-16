const _ = require('lodash')
const inquirer = require('inquirer')

let id = 0 // auto increment

class Employee {
  constructor(options) {
    this.defaults = {
      id,
      name: '',
      role: 'Employee',
      propsToEnter: ['name']
    }
    this._options = options || {}
    id++
  }

  get(key) {
    return _.get(this._options, key, _.get(this.defaults, key))
  }

  get options() {
    return _.mapValues(this.defaults, (val, key) => this.get(key))
  }

  setOption(key, val) {
    if(!Object.keys(this.defaults).includes(key)) {
      this.defaults[key] = null // add key to defaults if a new key is being added to _options
    }
    this._options[key] = val
  }

  setOptions(obj) { // set multiple options via object
    Object.keys(obj).forEach(key => this.setOption(key, obj[key]))
  }

  async ask() {
    this.setOptions(
      await inquirer.prompt(
        this.options.propsToEnter.map(prop => {
          return {
            type: 'input',
            name: prop,
            message: `Enter ${ this.constructor.name } ${ prop }: `
          }
        })
      )
    )
  }

  render() { // render a div for each option,
    return `
      <div class="employee">
        ${ Object.keys(_.omit(this.options, ['propsToEnter'])).map(option => `<div class="${ option }">${ this.options[option] }</div>`).join('') }
      </div>
    `
  }
}

class Manager extends Employee {
  constructor(options) {
    super(options)
    this.setOption('role', 'Manager')
    this.setOption('propsToEnter', [...super.options.propsToEnter, 'officeNumber'])
  }
}

class Engineer extends Employee {
  constructor(options) {
    super(options)
    this.setOption('role', 'Engineer')
    this.setOption('propsToEnter', [...super.options.propsToEnter, 'github'])
  }

  render() {
    this.setOption('githubData', 'github data') // actually get github info here
    return super.render()
  }
}

class Intern extends Employee {
  constructor(options) {
    //options.special = [{ prop: 'Office Number', val: 0 }]
    super(options)
    this.setOption('role', 'Intern')
    this.setOption('propsToEnter', [...super.options.propsToEnter, 'school'])
  }
}

module.exports = {
  Manager,
  Engineer,
  Intern,
}
