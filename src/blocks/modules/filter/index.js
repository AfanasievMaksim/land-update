const data = window.initialData;
const resultArr = [];
const minFloor = Math.min(...data.map(el => el.floorFrom));
const maxFloor = Math.max(...data.map(el => el.floorTo));

for (let i = minFloor; i <= maxFloor; i++) {
  for (let j = 0; j < data.length; j++) {
    if (data[j].floorFrom <= i && data[j].floorTo >= i) {
      let tmp = Object.assign({}, data[j]);
      tmp.floor = i;
      resultArr.push(tmp);
    }
  }
}

export default resultArr;