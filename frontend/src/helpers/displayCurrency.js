const displayINRCurrency = (num) => {
    const formatter = new Intl.NumberFormat('en-US',{
        minimumFractionDigits : 0,
        maximumFractionDigits : 2
    })

    return formatter.format(num) + " DT"

}

export default displayINRCurrency