const formatConverter = (number: any): string => {
    const formatNum = new Intl.NumberFormat("us-US", { style: 'currency', currency: 'USD' }).format(number)
    return formatNum;
}

export { formatConverter };