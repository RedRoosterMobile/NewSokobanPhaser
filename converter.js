/*
```
########
#   @  #
## $   #
# . $  #
# .  $ #
##. ####
##  ####
########


#,#,#,#,#,#,#,#
#,c, , ,@, , ,#
#,#, ,$, , , ,#
#, ,., ,$, , ,#
#, ,., , ,$, ,#
#,#,., ,#,#,#,#
#,#, , ,#,#,#,#
#,#,#,#,#,#,#,#



#   = wall = 2
' ' = empty = 0
.   = target = 1

@   = player = 5

#,#,#,#,#,#,#,#
#,c, , ,@, , ,#
#,#, ,$, , , ,#
#, ,., ,$, , ,#
#, ,., , ,$, ,#
#,#,., ,#,#,#,#
#,#, , ,#,#,#,#
#,#,#,#,#,#,#,#


2,2,2,2,2,2,2,2
2, , , , , , ,2
2,2, , , , , ,2
2, ,1, , , , ,2
2, ,1, , , , ,2
2,2,1, ,2,2,2,2
2,2, , ,2,2,2,2
2,2,2,2,2,2,2,2
```

*/

const { convertCompilerOptionsFromJson } = require("typescript");


var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);



/*const fs = require('fs') 


fs.readFile(myArgs[0], (err, data) => { 
    if (err) throw err; 
  
    console.log(data.toString()); 
})*/

var txt = `
########
#   @  #
## $   #
# . $  #
# .  $ #
##. ####
##  ####
########`

 String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 
 console.log(txt);
 function levelConvert(level) {
     return level
     .split('\n').map((line)=>{
        return line.split('').join(',').replaceAll('#',2).replaceAll('.',1).replaceAll('@', '5').replaceAll('$', '4')
     }).join('\n')
     // add commas
     
     
     // replace stuff
     

 }
 var restult = levelConvert(txt);
 console.log(restult);



  
// Data which will write in a file. 
let data = "Learning how to write in a file."
  
/*
// Write data in 'Output.txt' . 
fs.writeFile(myArgs[1], data, (err) => { 
      
    // In case of a error throw err. 
    if (err) throw err; 
}) 
*/