export const DisplayRupees = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style : "currency",
        currency : "INR"
    }).format(price)
}