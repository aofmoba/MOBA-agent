export function computedDur(time: any) {
  let theTime: number = time; // 秒
  let middle = 0; // 分
  let hour = 0; // 小时

  if (theTime >= 60) {
    middle = Math.floor(theTime / 60);
    theTime = Math.floor(theTime % 60);
    if (middle >= 60) {
      hour = Math.floor(middle / 60);
      middle = Math.floor(middle % 60);
    }
  }
  let result = `${Math.floor(theTime)}s`;
  if (middle > 0) {
    result = `${Math.floor(middle)}m : ${result}`;
  }
  if (hour > 0) {
    result = `${Math.floor(hour)}h : ${result}`;
  }
  return result;
};

export function vertDate(obj: any) {
  // 日期转yyyy-MM-dd
  const date = new Date(obj)
  date.setHours(date.getHours()-14);
  const y = date.getFullYear()
  const m = `0${  date.getMonth() + 1}`
  const d = `0${  date.getDate()}`
  const h = `0${  date.getHours()}`
  const mt = `0${  date.getMinutes()}`
  const s = `0${  date.getSeconds()}`
  return `${y}-${  m.substring(m.length - 2, m.length)  }-${  d.substring(d.length - 2, d.length)} ${  h.substring(h.length - 2, h.length)}:${  mt.substring(mt.length - 2, mt.length)}:${  s.substring(s.length - 2, s.length)}`
}
