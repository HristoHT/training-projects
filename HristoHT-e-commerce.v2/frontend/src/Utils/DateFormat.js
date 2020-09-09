const toDate = (date, str) => {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();

    return str.replace('dd', dd).replace('mm', mm).replace('yyyy', yyyy);
}

export default toDate;