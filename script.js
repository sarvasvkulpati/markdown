/*

h1-6

*/


let input = `

# this is a header

this is a *paragraph* of text


this is another **paragraph** of text

this is [google](https://www.google.com)

## this is an h2
### this is an h3

# another header

more paragraphs

> to be or not to be a pencil - Gandhi


- here's a point I'd like to make
- and another one
- aaaand another one


`

let lines = input.match(/[^\r\n]+/g)





output = ""





for (let [lineIdx, line] of lines.entries()) {
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

      output += line[i]
    }
    output += '</h' + headerType + '>'
  }
  // blockquotes
  else if (line[inputIdx] == ">") {

    output += '<blockquote>'

    for (i = 1; i < line.length; i++) {
      output += line[inputIdx + i]
    }

    output += '</blockquote>'

  }

  else if (line[inputIdx] == "-") {


    if (lines[lineIdx - 1] ?.[0] != "-") {
      output += '<ul>'
    }


    output += '<li>'

    for (i = 1; i < line.length; i++) {
      output += line[inputIdx + i]
    }
    output += '</li>'


    if (lines[lineIdx + 1] ?.[0] != "-") {
      output += '</ul>'
    }


  } 


  //paragraphs

  else {

    output += '<p>'




    for (i = 0; i < line.length; i++) {


      //strong and italic tags
      if (line[i] == "*") {



        if (line[i + 1] == "*") {

          //strong tags
          i += 1

          output += '<strong>'

          let j = i + 1
          while (line[j] != "*") {
            output += line[j]
            j++
          }

          output += '</strong>'

          i = j + 2

        } else {
          //italic tags
          output += '<i>'

          let j = i + 1
          while (line[j] != "*") {
            output += line[j]
            j++
          }

          output += '</i>'

          i = j + 1

        }
      }


      //links
      if (line[i] == "[") {
        let link = ""

        let content = ""

        //get content inside []
        let j = i + 1
        while (line[j] != "]") {

          content += line[j]
          j++
        }

        //get link inside ()
        j = j + 2

        while (line[j] != ")") {

          link += line[j]
          j++
        }

        i = j + 1


        output += "<a href=" + link + "/>" + content + "</a>"
      }





      if (line[i]) {
        output += line[i]
      }

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