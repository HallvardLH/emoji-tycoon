export const formatTimestampToShortDate = (timestamp) => {
    const date = new Date(timestamp);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const month = monthNames[date.getMonth()];
    const day = date.getDate();

    return `${month}. ${day}`;
}

