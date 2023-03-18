export {}

interface TestInterface {
    a: string,
    b: string
}

type Fun<X> = (value: X)=>void

let a: Fun<{a: string}> = console.log
let b: Fun<{b: string}> = console.log
let c: Fun<{}> = console.log

const x: Fun<{b: string}>[] = [
    c,
    b
]
let y: Fun<TestInterface>[] = [
    ...x,
    a
]
y[0]({a: '', b: ''})