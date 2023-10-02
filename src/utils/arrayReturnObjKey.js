const objKey = (a, b) => {
    return a.map((el) => {
        return el[b]
    })
}

export { objKey }
