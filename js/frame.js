// 判断两个对象是否相等
function isObjEqual(a, b, keyArr) {
  if (keyArr) {
    var aProps = keyArr;
  } else {
    aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    if (aProps.length != bProps.length) {
      return false;
    }
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];

    var propA = a[propName];
    var propB = b[propName];
    // 2020-11-18更新，这里忽略了值为undefined的情况
    // 故先判断两边都有相同键名
    if (!b.hasOwnProperty(propName)) return false;
    if (typeof propA === "object") {
      if (this.isObjectValueEqual(propA, propB)) {
        // return true     这里不能return ,后面的对象还没判断
      } else {
        return false;
      }
    } else if (propA !== propB) {
      return false;
    } else {
    }
  }
  return true;
}

// 查找指定的元素在数组中的位置
Array.prototype.indexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) {
      return i;
    }
  }
  return -1;
};
// 通过索引删除数组元素
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

//删除数组中的对象元素
Array.prototype.removeObj = function (val) {
  var index = this.indexOfObj(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};

//查找数组元素的位置
Array.prototype.indexOfObj = function (val) {
  for (let index = 0; index < this.length; index++) {
    const ele = this[index];
    if (isObjEqual(ele, val)) {
      return index;
    }
  }
  return -1;
};

//深拷贝对象
function copy(obj) {
  var newobj = obj.constructor === Array ? [] : {};
  if (typeof obj !== "object") {
    return;
  }
  for (var i in obj) {
    newobj[i] = typeof obj[i] === "object" ? copy(obj[i]) : obj[i];
  }
  return newobj;
}
