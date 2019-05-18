var notes = document.querySelectorAll('.note')
for(let i = 0; i < notes.length; i++){
///FIX THIS
  let note = notes[i]
  let idName = note.id
  let linkLocation = `#${idName}`
  //append a link to note
  let link = document.createElement('A')
  link.href = linkLocation
  note.appendChild(link)
  link.display = "none"
}

function inFocusEditMenu(){
  let inFocusEditMenu = document.querySelector('#in-focus-edit-menu')
  return inFocusEditMenu
}
//FIX THIS: not keeping new href set
for(let i = 0; i < notes.length; i++){
  let note = notes[i]
  addInFocusHandler(note)
}

// bring note in focus and show bottom menu
function addInFocusHandler(note){
  note.addEventListener('click', function(){
    var newLocation = note.querySelector('a').href
    if(window.location.href.split('#').includes(note.id)) return false
    window.location = newLocation
  })
  note.addEventListener('click', function(){
    if(!note.querySelector('.new-entry-bottom-container')){
      note.append(buildEditMenu())
      addCloseEvent()
    }
  })
}

// build the bottom menu for the in focus note
function buildEditMenu(){
  var container = document.createElement('div')
    container.className = "new-entry-bottom-container"
    container.id = "in-focus-edit-menu"
  var iconsContainer = document.createElement('div')
    iconsContainer.className = "bottom-icons-container"
  var addAlert = document.createElement('IMG')
    addAlert.src = "images/outline-add_alert-24px.svg"
  var addPerson = document.createElement('IMG')
    addPerson.src = "images/outline-person_add-24px.svg"
  var changeColor = document.createElement('IMG')
    changeColor.src = "images/baseline-palette-24px.svg"
  var addImage = document.createElement('IMG')
    addImage.src = "images/baseline-image-24px.svg"
  var archive = document.createElement('IMG')
    archive.src = "images/baseline-archive-24px.svg"
  //DELETE icon
  var trash = document.createElement('IMG')
      trash.src = "images/outline-delete_outline-24px.svg"
  var more = document.createElement('IMG')
    more.src = "images/outline-more_vert-24px.svg"
  var undo = document.createElement('IMG')
    undo.src = "images/outline-undo-24px.svg"
  var redo = document.createElement('IMG')
    redo.src = "images/outline-redo-24px.svg"

  trash.addEventListener('click', function(e){
    if(e.target === e.currentTarget){
      deleteNote()
      $('.col').masonry('layout')
    }
  })

  var icons = [ addAlert, addPerson, changeColor, addImage, archive, trash, more, undo, redo]

  var close = document.createElement('div')
    close.className = "close"
    close.id = "in-focus-close"
    close.textContent = "Close"

  icons.forEach( icon => {
    iconsContainer.append(icon)
  })
  container.append(iconsContainer)
  container.append(close)
  return container
}

//Set handlers for new entry inputs: show and hide
function initNewEntryHandlers(){
  const newEntryContainer = document.querySelector('.new-entry-container')
  const newEntryBody = document.querySelector('.new-entry-body-container')
  const newEntryTitle = document.querySelector('.new-entry-title')

  newEntryContainer.addEventListener('click', function(e){
    newEntryTitle.textContent = "Title"
    if(e.target === newEntryTitle){
      newEntryBody.style.display = "block"
    }
  })

  document.body.addEventListener('click', function(e){
    if(isDescendant(newEntryContainer, e.target) == false){
      if(newEntryBody.style.display == "block"){
        newEntryBody.style.display = "none"
      }
    }
  })
}
initNewEntryHandlers()

function isDescendant(parent, child) {
     var node = child.parentNode;
     while (node != null) {
         if (node == parent) {
             return true;
         }
         node = node.parentNode;
     }
     return false;
}

//Set handler to un focus note via window.location and remove edit menu
document.body.addEventListener('click', function(e){
  var url = window.location.href
  if(e.target === e.currentTarget || e.target == document.querySelector('.notes-section-container')) {
    // window.location = $(this).find("a").attr("href");
    window.location.hash = ""
    var editMenu = document.querySelector('#in-focus-edit-menu')
    console.log('hello from the body listener. You triggered my event!')
    if(editMenu) editMenu.remove()
  }
})

//Set handler to focus on note, toggle Masonry styling
function focusOnNote(){
  let prevStyles = null
  let prevEl
  let styleInFocus = false
  document.body.addEventListener('click', function(e){
    //FIX THIS FOR TRANSFORM EFFECT
    let hash = window.location.hash.slice(1)
    console.log("THE HASH IS ", hash)
    if(hash.length > 0) prevEl = getPrevEl(hash)
    if(hash){
      prevStyles = getPrevStyles(prevEl)
    }
    console.log(prevStyles)

    prevEl.style.left = "50%"
    prevEl.style.top = "50%"
    prevEl.style.transform = "translate(-50%, -50%)"
    styleInFocus = true

    if(e.target === e.currentTarget || e.target == document.querySelector('.notes-section-container')){
        console.log('hello from the else code, the hash is ', hash)
        prevEl.style.left = prevStyles[0]
        prevEl.style.top = prevStyles[1]
        prevEl.style.transform = ""
        prevStyles = null
        prevEl = null
        $('.col').masonry('layout')
      }
      console.log('hello from the body listener')
  })
}

focusOnNote()
// focusOnNote helper methods
function getPrevEl(id){
  var prevEl = document.getElementById(id)
  return prevEl
}

function getPrevStyles(el){
  var prevStyles = [el.style.left.toString(), el.style.top.toString(), el.style.transform.toString()]
  return prevStyles
}

function styleInFocusEl(){
    var prevStyles = [el.style.left.toString(), el.style.top.toString(), el.style.transform.toString()]
    console.log(id)
  var inFocus = false
    if(!inFocus){
      inFocus = true
      el.style.left = "50%"
      el.style.top = "50%"
      el.style.transform = "translate(-50%, -50%)"
    }else{
      el.style.left = prevStyles[0]
      el.style.top = prevStyles[1]
      el.style.transform = prevStyles[2]
    }

  }

// AJAX for getting next batch of notes
$(window).scroll(function() {
   if($(window).scrollTop() + $(window).height() == $(document).height()) {
     const numbNotes = document.querySelectorAll('.note').length
     $.ajax({
           type: "GET",
           url: "/getMore",
           // include data to tell mongoose which record to start from
           data: {noteCount: numbNotes},
           success: function(result){
             $.each(result, function(i, note){
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

               addInFocusHandler(noteDiv)
               $('.col').append($(noteDiv)).masonry( 'appended', $(noteDiv))
             })
           },
           error: function(err){
             console.log(err)
           }
        })
   }
})

// inside click event handler, add this function
const addCloseEvent = function(){
  console.log('running addCloseEvent!')
  let closeButton = document.querySelector('#in-focus-close')
  ajaxEvent(closeButton)
}

// PUT request for Close button
const ajaxEvent = function(el){
  el.addEventListener('click', function(event){
    const noteID = document.location.href.split('#').slice(-1)[0]
    const currentNote = document.getElementById(noteID)
    const currentTitle = currentNote.querySelector('.title').innerText
    const currentText = currentNote.querySelector('.noteBody').innerText
    console.log("Hello from the close button!", noteID, currentTitle, currentText)
    $.ajax({
      type: "PUT",
      url: "/put",//document.location.href.split('#').slice(-1)[0],
      dataType: "json",
      data: {"noteID": noteID, "title": currentTitle, "note": currentText},
      success: function(){
        $(el).off()
        var editMenu = document.querySelector('#in-focus-edit-menu')
        if(editMenu) editMenu.remove()
        window.location.hash = ""
        $('.col').masonry('layout')
      },
      error: function(err){
        console.log(err)
      }
    })
  })
}

// init Masonry
$('.col').masonry({
  itemSelector: '.note',
  columnWidth: '.note',
  isFitWidth: true
})

//OTHER
const colors = {
  keys: ["red", "orange", "yellow", "green", "teal", "blue", "pink"],
  red: "#e57373",
  orange: "#ffcc80",
  yellow: "#fff59d",
  green: "#a5d6a7",
  teal: "#b2dfdb",
  blue: "#90caf9",
  pink: "#fce4ec"
}

function setColors(){
  const notes = document.querySelectorAll('.note')
  for(var i = 0; i < notes.length; i++){
    console.log('running set Colors')
    var randNumb = Math.floor(Math.random() * 10)
    console.log(randNumb)
    if(randNumb < colors.keys.length){
      notes[i].style.backgroundColor = colors.keys[randNumb]
    }
  }
}
