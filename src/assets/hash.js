/** 
 * 　
 * 检查两个字符串的相似度
 * 可以用在 DNA分析 　　拼字检查 　　语音辨识 　　抄袭侦测 
 * @createTime 2012-1-12 
 */
function Levenshtein(str1, str2) {
  //计算两个字符串的长度。  
  var len1 = str1.length;
  var len2 = str2.length;
  //建立上面说的数组，比字符长度大一个空间  
  var dif = [];

  //赋初值，步骤B。  
  for (var a = 0; a <= len1; a++) {
    dif[a] = [];
    dif[a][0] = a;
  }
  for (var a = 0; a <= len2; a++) {
    dif[0][a] = a;
  }
  //计算两个字符是否一样，计算左上的值  
  var temp;
  for (var i = 1; i <= len1; i++) {
    for (var j = 1; j <= len2; j++) {
      if (str1[i - 1] == str2[j - 1]) {
        temp = 0;
      } else {
        temp = 1;
      }
      //取三个值中最小的  
      dif[i][j] = min([
        dif[i - 1][j - 1] + temp,
        dif[i][j - 1] + 1,
        dif[i - 1][j] + 1
      ]);
    }
  }
  //System.out.println("字符串\""+str1+"\"与\""+str2+"\"的比较");  
  //取数组右下角的值，同样不同位置代表不同字符串的比较  
  console.log("差异步骤：" + dif[len1][len2]);

  //计算相似度 
  var similarity = 1 - dif[len1][len2] / Math.max(str1.length, str2.length);
  debugger
  //System.out.println("相似度："+similarity);
  return similarity;

}

//得到最小值  
function min(ints) {
  var min = 0;
  for (var i = 0; i < ints.length; i++) {
    if (min > ints[i]) {
      min = ints[i];
    }
  }
  return min;
}