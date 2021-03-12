let input = document.getElementById('input')
let parsedTextBox = document.getElementById('root')
input.addEventListener('keyup', (e)=>handleInputChange(e))


function handleInputChange(e){
 
  let markdown = e.target.value
  
  parsedTextBox.innerHTML =  toHTML(markdown)}