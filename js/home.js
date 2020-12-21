let tableVue = new Vue({
  el: "#app",
  data: {
    oldArr: [],
    uploadArr: [],
    cmoldArr: [],
    cmuploadArr: [],
    oldKeys: [],
    showOldKeys: [],
    uploadKeys: [],
    showUploadKeys: [],
  },
  methods: {
    changeCheck: function (e) {
      console.log("点击了---" + e.target.innerText);
      let key = e.target.innerText;
      if (tableVue.showOldKeys.indexOf(key) == -1) {
        if (tableVue.showOldKeys.length >= 5) {
          console.log("it is over three data");
          layui.use(["layer", "form"], function () {
            var layer = layui.layer,
              form = layui.form;

            layer.msg(
              "亲，最多只能选择5个哦o(*^＠^*)o",
              {
                time: 5000, //2s后自动关闭
                btn: ["明白了", "知道了", "哦"],
              }
            );
          });
          return;
        }
        tableVue.showOldKeys.push(key);
        e.target.classList.replace("nochecked", "cheched");
      } else {
        tableVue.showOldKeys.remove(key);
        e.target.classList.replace("checked", "nochecked");
      }
    },
  },
});

$("#origin").change(function (e) {
  var files = e.target.files;
  var fileReader = new FileReader();
  fileReader.onload = function (ev) {
    try {
      var data = ev.target.result;
      var workbook = XLSX.read(data, {
        type: "binary",
      }); // 以二进制流方式读取得到整份excel表格对象
      var persons = []; // 存储获取到的数据
    } catch (e) {
      console.log("文件类型不正确");
      return;
    }
    // 表格的表格范围，可用于判断表头是否数量是否正确
    var fromTo = "";
    // 遍历每张表读取
    for (var sheet in workbook.Sheets) {
      if (workbook.Sheets.hasOwnProperty(sheet)) {
        fromTo = workbook.Sheets[sheet]["!ref"];
        console.log(fromTo);
        persons = persons.concat(
          XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
        );
        // break; // 如果只取第一张表，就取消注释这行
      }
    }
    //在控制台打印出来表格中的数据
    let strArr = JSON.stringify(persons);
    tableVue.oldArr = JSON.parse(strArr);
    let keysArr = Object.getOwnPropertyNames(JSON.parse(strArr)[0]);
    tableVue.oldKeys = keysArr;
    tableVue.showOldKeys = getFont3Arr(keysArr);
  };
  // 以二进制方式打开文件
  fileReader.readAsBinaryString(files[0]);
});

// 获取对比表中的数据信息
$("#upload").change(function (e) {
  var files = e.target.files;
  var fileReader = new FileReader();
  fileReader.onload = function (ev) {
    try {
      var data = ev.target.result;
      var workbook = XLSX.read(data, {
        type: "binary",
      }); // 以二进制流方式读取得到整份excel表格对象
      var persons = []; // 存储获取到的数据
    } catch (e) {
      console.log("文件类型不正确");
      return;
    }
    // 表格的表格范围，可用于判断表头是否数量是否正确
    var fromTo = "";
    // 遍历每张表读取
    for (var sheet in workbook.Sheets) {
      if (workbook.Sheets.hasOwnProperty(sheet)) {
        fromTo = workbook.Sheets[sheet]["!ref"];
        console.log(fromTo);
        persons = persons.concat(
          XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
        );
        // break; // 如果只取第一张表，就取消注释这行
      }
    }
    //在控制台打印出来表格中的数据
    let strArr = JSON.stringify(persons);
    tableVue.uploadArr = JSON.parse(strArr);
    console.log(tableVue.uploadArr);
  };
  // 以二进制方式打开文件
  fileReader.readAsBinaryString(files[0]);
});

// 对比excel内容
function CompareExcel() {
  console.log("I will compare the excels");
  let oldArr = JSON.parse(JSON.stringify(tableVue.oldArr));
  let old2 = copy(oldArr);
  let newArr = JSON.parse(JSON.stringify(tableVue.uploadArr));
  for (let index = 0; index < old2.length; index++) {
    const ele1 = old2[index];
    for (let j = 0; j < newArr.length; j++) {
      const ele2 = newArr[j];
      let keys = JSON.parse(JSON.stringify(tableVue.showOldKeys));
      if (isObjEqual(ele1, ele2, keys)) {
        oldArr.removeObj(ele1);
        newArr.removeObj(ele2);
        break;
      }
    }
    if (index == old2.length - 1) {
      tableVue.cmoldArr = copy(oldArr);
      tableVue.cmuploadArr = copy(newArr);
      console.log(tableVue.cmoldArr);
      console.log(tableVue.cmuploadArr);
    }
  }
}

//获取数组前三个数据
function getFont3Arr(arr) {
  if (arr.length > 3) {
    return arr.slice(0, 3);
  }
  return arr.slice(0, arr.length);
}
