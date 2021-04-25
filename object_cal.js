class Calculator {
  #state = 0

  sum(n) {
   this.#state += n
  }

  sub(n) {
    this.#state -= n
  }

  mul(n) {
    this.#state *= n
  }

  div(n) {
    this.#state /= n
  }

  state() {
    return this.#state
  }

  clear() {
    this.#state = 0
  }
}

const cal = new Calculator()

cal.sum(2)
cal.sum(5)
cal.mul(3)
cal.div(7)
cal.state() //7

cal.clear()
cal.sum(2)
cal.state()
