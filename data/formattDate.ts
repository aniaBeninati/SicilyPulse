//data formattata

export const formattedDate = (value: number = 0) => {
    const today = new Date();
    let day = today.getDate();
    if (value) {
        day = day + value;
    } else {
        day = day;
    }
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const formattedDate = day + '-' + month + '-' + year;
    return formattedDate;
}