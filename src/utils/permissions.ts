import { UserInfo } from "@/utils/Settings";

const pageItem = [
  { id: "1", codes: ["btnDelete", "btn45", "btnAdd", "btnIdc"] },
  { id: "0", codes: ["btnAdd", "btnIdc"] },
];

export function permiss($container: JQuery) {
  //判断单个权限
  for (var i = 0; i < pageItem.length; i++) {
    if (UserInfo.UserPermission === pageItem[i].id) {
      for (var j = 0; j < pageItem[i].codes.length; j++) {
        if (pageItem[i].codes[j] === $container.prop("name")) {
          $container.removeAttr("disabled");
          return;
        }
      }
    }
  }
  $container.attr({ disabled: "disabled" });
}

export function permsissAr($containers: JQuery[]) {
  //判断多个权限
  for (var z = 0; z < $containers.length; z++) {
    var type: boolean = false;
    for (var i = 0; i < pageItem.length; i++) {
      if (UserInfo.UserPermission === pageItem[i].id) {
        for (var j = 0; j < pageItem[i].codes.length; j++) {
          if (pageItem[i].codes[j] === $containers[z].prop("name")) {
            type = true;
          }
        }
      }
    }
    if (type == true) {
      $containers[z].removeAttr("disabled");
    } else {
      $containers[z].attr({ disabled: "disabled" });
    }
  }
}
