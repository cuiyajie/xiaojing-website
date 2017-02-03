export default {
  formatDate: (time) => {
    const tmpDate = new Date(time);
    const year = tmpDate.getFullYear();
    const month = tmpDate.getMonth() + 1;
    const day = tmpDate.getDate();
    const hours = tmpDate.getHours();
    let minutes = tmpDate.getMinutes();
    if (minutes < 10) minutes = `0${minutes}`;
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },
};
