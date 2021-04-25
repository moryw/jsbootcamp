// Simple calculator that keeps the state until cleared

state = 0

const sum = (n) => state += n

const sub = (n) => state -= n

const mul = (n) => state *= n

const div = (n) => state /= n

const clear = () => state = 0

sum(3)
sub(6)
mul(3)
div(1.5)
clear()
