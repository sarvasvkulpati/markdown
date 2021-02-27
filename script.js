/*

h1-6

*/


let input = `

# this is a header

this is a *paragraph* of text


this is another paragraph of text

## this is an h2
### this is an h3

# another header

more paragraphs

`

let lines = input.match(/[^\r\n]+/g)





output = ""





for (line of lines) {
  let inputIdx = 0
  let headerType = 1



  //headers
  if (line[inputIdx] == "#") {



    if (line[inputIdx + 1] == "#") {
      headerType++

      if (line[inputIdx + 2] == "#") {
        headerType++
      }
    }



    output += '<h' + headerType + '>'
    for (i = headerType; i < line.length; i++) {
      console.log(line[i])
      output += line[i]
    }
    output += '</h' + headerType + '>'
  }


  //paragraphs

  else {

    output += '<p>'
    for (i = 0; i < line.length; i++) {

      if(line[i] == "*"){
        output += '<i>'

        let j = i + 1
        while(line[j] != "*") {
          output += line[j]
          j++ 
        }

        output += '</i>'

        i = j+1


      }



      output += line[i]
    }
    output += '</p>'

  }



}



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