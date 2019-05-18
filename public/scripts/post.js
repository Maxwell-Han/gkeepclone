console.log('hello from the post.js file')

const title = document.querySelector('.title')
const noteText = document.querySelector('.note-text')
const getButton = document.querySelector('#get-notes')
const col = document.querySelector('.col')

$(getButton).click(function(event){
  const numbNotes = document.querySelectorAll('.note').length
  $.ajax({
    type: "GET",
    url: "/getMore",
    data: {noteCount: numbNotes},
    success: function(result){
      $.each(result, function(i, note){
        var noteDiv = document.createElement('div')
        noteDiv.className = "note"
        var titleDiv = document.createElement('div')
        titleDiv.className = "title"
        titleDiv.innerText = note.title
        var bodyDiv = document.createElement('div')
        bodyDiv.className = "noteBody"
        bodyDiv.contenteditable = "true"
        bodyDiv.innerText = note.note
        noteDiv.append(titleDiv)
        noteDiv.append(bodyDiv)
        col.append(noteDiv)
        console.log(noteDiv)
      })
    },
    error: function(err){
      console.log(err)
    }
  })

})

const newEntryTitle = document.querySelector('.new-entry-title')
const newEntryText = document.querySelector('.new-entry-text')
const newEntryClose = document.querySelector('#new-entry-close')

$(newEntryClose).click(function(event){
  if(newEntryText.innerText != "Take a note..."){
    var url = "/new"
    var data = {title: newEntryTitle.innerText, note: newEntryText.innerText}
    $.ajax(url, {
       data: data,
       type: "POST",
       success: function(res){
         console.log('successfully sent post')
         var newNote = createNote(res)
         console.log(newNote)
         $('.col').prepend($(newNote)).masonry('prepended', $(newNote))
         newEntryTitle.innerText = "Title"
         newEntryText.innerText = "Take a note..."
         var newEntryContainer = document.querySelector('.new-entry-body-container')
         console.log(newEntryContainer)
         newEntryContainer.style.display = "none"
       }
     }).fail(function(jqXHR){
       console.log(jqXHR.status)
     })
  }
})

function createNote(note){
  var noteDiv = document.createElement('div')
  noteDiv.className = "note"
  noteDiv.id = note._id
  var titleDiv = document.createElement('div')
  titleDiv.className = "title"
  titleDiv.setAttribute("contenteditable", "true")
  titleDiv.innerText = note.title
  var bodyDiv = document.createElement('div')
  bodyDiv.className = "noteBody"
  bodyDiv.setAttribute("contenteditable", "true")
  bodyDiv.innerText = note.note
  noteDiv.append(titleDiv)
  noteDiv.append(bodyDiv)

  var link = document.createElement('A')
  link.href = "#" + note._id
  noteDiv.appendChild(link)
  link.display = "none"
  return noteDiv
}

//Also use Masonry to remove note along with this
function deleteNote(){
  var url = "/" + window.location.hash.slice(1)
  $.ajax(url, {
    type: "DELETE",
    success: function(res){
        console.log('just DELETED a note')
        var currentNote = document.getElementById(window.location.hash.slice(1))
        $('.col').masonry( 'remove', currentNote ).masonry('layout')
    }
  }).fail(function(jqXHR){
    console.log('We had an issue... ', jqXHR.status)
  })
}
