/*

h1-6

*/


let input = "# lalala"

let inputIdx = 0



output = ""



let headerType = 1


if(input[inputIdx] = "#"){

  if (input[inputIdx + 1] == "#"){
    headerType++ 

    if (input[inputIdx + 2] == "#"){
      headerType++
    }
  }
  


  output += '<h' + headerType + '>'
  for(i = headerType; i < input.length; i++) {
    output += input[i]
  }
  output += '</h' + headerType + '>'



}





console.log(output)



document.getElementById('root').innerHTML = output








// class Reader {

//   constructor(input) {
//     this.idx = 0
//     this.str = input
//   }

//   peek(i = 1){
//     return input[this.idx + i]
//   }

//   consume() {
//     this.idx += 1
//     return input[this.idx]
//   }


// }

// let data = new Reader(input)



// class Lexer {
//   constructor(reader) {
//     this.reader = reader
//   }

//   nextToken(){
//     let nextChar = reader.peek()

//     switch(nextChar){
//       case "*":

//         if(reader.peek(1) == "*"):
//           return 'STRONG'

//         break
      
//       default:

//     }



//   }


// }


// good parsers are recursive descent parsers, the rest is BS




/*
Reader

input: entire text string
outputs: list of tokens


reader just has the string and where we are in the string

the tokenizer 


tokens are what each 'thing' is 


in lisp a reader is a parser that's available as a function of the language
*/




/*
Tokenizer and lexer are the same thing 


*/


/*

text -> tokens -> syntax tree

*/




/*
in md, every line is fairly self contained (header will stay to one line)

so you can technically parse line by line, except for lists


LineReader allows you to check if something is a line

*/