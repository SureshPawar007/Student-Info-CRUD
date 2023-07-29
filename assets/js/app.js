const cl = console.log;

const stdForm = document.getElementById("stdForm");
const fnameControls = document.getElementById("fname")
const lnameControls = document.getElementById("lname")
const emailControls = document.getElementById("email")
const contactControls = document.getElementById("contact")
const stdInfoContainer = document.getElementById("stdInfoContainer")
const stdTable = document.getElementById('stdTable')
const noStdData = document.getElementById('noStdData') 
const stdSubBtn = document.getElementById('stdSubBtn')
const stdUpdateBtn = document.getElementById('stdUpdateBtn')


//this is empty array to push the tr 
let stdArray = [];


// Below function is created Unique Id This is ready made function which is availabe of google uuid generator
function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

const trTemplating = (arr) =>{
    let result = ''
    arr.forEach((ele,i) => {
        result+= `
        <tr id="${ele.stdId}">
            <td>${i+1}</td>
            <td>${ele.fname}</td>
            <td>${ele.lname}</td>
            <td>${ele.email}</td>
            <td>${ele.contact}</td>
            <td><i class="fa-solid  fa-pen-to-square" onclick ="onStdEdit(this)"></i></td>
            <td><i class="fa-regular fa-trash-can" onclick ="onStdDelete(this)"></i></td>
    </tr>
        `
        stdInfoContainer.innerHTML = result;
    });
}

if(localStorage.getItem("stdData")){
    //Here we can store localstorage array in the form of string in data variable
    let data = JSON.parse(localStorage.getItem("stdData"));
    //Here we can check the Array data and local storage data are same then call the trTemplating else not call
    stdArray = data;
    trTemplating(data);
    stdTable.classList.remove('d-none');
    // noStdData.classList.add('d-none');
    noStdData.innerHTML = `No Of Students Are => ${data.length}`
}else{
    stdTable.classList.add('d-none');
    // noStdData.classList.remove('d-none');
    noStdData.innerHTML = `No Students Record Found Yet...!!`
}

const onStdEdit = (ele) => {
    // cl(ele);
    //using Traversing we can find the id of Edited tr
    // cl(ele.closest('tr').id)
    let editId = ele.closest('tr').getAttribute("id");
    // cl(editId)
    localStorage.setItem("editId",editId)
    // here we find the stdId and editId Same or not 
    let editObj = stdArray.find(std =>{
        return std.stdId === editId
    })
    // cl(editObj)
    fnameControls.value = editObj.fname;
    lnameControls.value = editObj.lname;
    emailControls.value = editObj.email;
    contactControls.value = editObj.contact
    //Below functionality is for button show and hide when we edit the student data
    stdUpdateBtn.classList.remove('d-none');
    stdSubBtn.classList.add('d-none');
    
}
// Update Info Code 
const onStdInfoUpdate = (ele) =>{
    let updateId = localStorage.getItem('editId');
    // cl(updateId)
    let updateObj = {
        fname : fnameControls.value,
        lname : lnameControls.value,
        email : emailControls.value,
        contact : contactControls.value,
 
    }
    cl(updateObj)

    for (let i = 0; i < stdArray.length; i++) {
        if(stdArray[i].stdId === updateId){
            stdArray[i].fname =updateObj.fname;
            stdArray[i].lname =updateObj.lname;
            stdArray[i].email =updateObj.email;
            stdArray[i].contact =updateObj.contact;
            break
        }
        
    }
    //For updated Student Data in array
    localStorage.setItem('stdData',JSON.stringify(stdArray))
    // trTemplating call beacuse the using the array data templating is creates the trTemplating function
    //This trTemplating calling is a wrong process beacsue we have to create a one tr but trTemplating fun calling and return we create all tr.
    //this is wrong aproach insted of trTemplating fun we have to create tr element 
    // trTemplating(stdArray)
    let tr = [...document.getElementById(updateId).children];
    tr[1].innerHTML = updateObj.fname; //fname td
    tr[2].innerHTML = updateObj.lname; //lname td
    tr[3].innerHTML = updateObj.email; //email td
    tr[4].innerHTML = updateObj.contact; //contact td

    
    stdForm.reset();
    stdUpdateBtn.classList.add('d-none')
    stdSubBtn.classList.remove('d-none')


}

// ********************** Delete Student Data Code **********************

const onStdDelete = (ele) =>{
    // cl(ele.closest('tr').id)
    let confirDelete = confirm("Are You Want To Delete This Student...!!")
    if (confirDelete) {
        let deleteId = ele.closest('tr').id;
        cl(deleteId)
        stdArray = stdArray.filter(std => std.stdId != deleteId)
        localStorage.setItem('stdData', JSON.stringify(stdArray))
        document.getElementById(deleteId).remove()

        if (stdArray.length) {
            noStdData.innerHTML = `Number of Students are ${stdArray.length}`
        } else {
            //Here remove item from localstorage and if empty local storage then show the no record found msg and d-none table
            localStorage.removeItem('stdData')
            noStdData.innerHTML = 'No Student Record Found Yet !!!'
            stdTable.classList.add('d-none')
            
        }
        //Below code purpose is that when you delete random student data then relode the page
        location.reload();

    } else {
        return
    }
    
}

// ********************** Add Student Data in Array **********************

const onStdAdd = (eve) =>{
    eve.preventDefault();
    let stdObj = {
        fname : fnameControls.value,
        lname : lnameControls.value,
        email : emailControls.value,
        contact : contactControls.value,
        stdId : create_UUID()
    }
    
    stdArray.unshift(stdObj);
    //This below line code are when we add the student then increse the count of student data
    noStdData.innerHTML = `No Of Students Are => ${stdArray.length}`
    eve.target.reset();
    //this below code is for the show when the student add in the table 
    stdTable.classList.remove('d-none');
    // noStdData.classList.add('d-none');
    // trTemplating call beacuse the using the array data templating is creates the trTemplating function
    //This trTemplating calling is a wrong process beacsue we have to create a one tr but trTemplating fun calling and return we create all tr.
    //this is wrong aproach insted of trTemplating fun we have to create tr element 
    //here trTemplating is right beacuse another way we have not get the sr no
    trTemplating(stdArray);
    
    //Store the all data in local storage
    localStorage.setItem("stdData", JSON.stringify(stdArray));
}

// Add the Event of Form which is id is stdForm
stdForm.addEventListener("submit", onStdAdd);
stdUpdateBtn.addEventListener("click", onStdInfoUpdate);
