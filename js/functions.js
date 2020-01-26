function getDayOfWeek(date) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayStr = days[date.getDay()];

    return dayStr;
}

function getDate(date) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Oktober", "November", "December"];
    const dateStr = date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear();

    return dateStr;
}

function insertToPage(selector, content) {
    try {
        const fields = document.querySelectorAll(selector);

        if ((typeof content) == "string") {
            for (let i = 0, x = fields.length; i < x ; i++) {
                fields[i].textContent = content;
            }
        }
        else if ((typeof content) == "object") {
            for (let i = 0, x = fields.length; i < x ; i++) {
                fields[i].appendChild(content);
            }
        }
    } catch (error) {
        console.log("error: Failed to insert content to page.");
        console.log(error);
    }
}

function generateKey() {
    try {
        const re = /\s/g;
        return getDate(new Date()).replace(re, "_");
    } catch (error) {
        console.log("error: Generating daily key failed.");
        console.log(error);
    } 
}

function toggleClassByNode(className, node) {    
    try {
        node.classList.toggle(className);
    } catch (error) {
        console.log(`error: Couldn't find node: ${node.nodeName}.`);
        console.log(error);
    }
}


function listEventHandler(event) {
    if (event.target.className == "remove-btn") {
        const li = event.target.parentNode;
        const li_id = Number(li.id);

        // remove task from html
        li.remove();
        // remove task from task list
        // + 0 -> id
        // + 1 -> status
        // + 2 -> text
        // using remove because list elements rely on their original array index
        // each task li has id that corresponds to index in array
        delete taskList[li_id];
        delete taskList[li_id + 1];
        delete taskList[li_id + 2];
    }
    else if (event.target.nodeName == "INPUT") {
        const li = event.target.parentNode;
        const li_status = (Number(li.id) + 1);
        toggleClassByNode("complete", li);
        
        // change completion status
        if (taskList[li_status] === "0") {
            taskList[li_status] = "1";
        } else {
            taskList[li_status] = "0";
        }
    }
}

function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, value);
    }
    catch(error) {
        console.log("error: writing to localStorage failed. Possible causes: LocalStorage is disabled");
        console.log(error);
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        //console.log(data);
        // no data -> return empty string
        if (!data) {
            return "";
        } else {
            return data;
        } 
    }
    catch(error) {
        console.log("error: Retrieving from localStorage failed.");
        console.log(error);
    }
}

function parseListData(data) {
    // data = "id, completion, text, id, completion, text..."
    // split at commas and get array of values

    // if no data -> return empty array
    if (!data) {
        return [];
    } else {
        try {
            const re = /,/g; 
            data = data.split(re);

            // data is saved as sets of 3, so if data length modulo 3 is not zero, data is corrupted
            if(data.length % 3 != 0){
                return [];
            }
            
            return data;
    
        } catch (error) {
            console.log("error: Parsing data failed.");
            console.log(error);
        }
    }  
}

function pageUnloadHandler() {
    // filter out undefined values and save to local storage
    // undefined values are removed list elements
    saveToLocalStorage(listKey, taskList.filter(el => el != undefined)); 
}

function newTask(event) {
    try {
        event.preventDefault();

        const text = document.querySelector("#list-input").value;
        const id = Date.now();
        const count = taskList.length;
        const status = "0";
        const task = newTaskNode(count, id, status, text);

        taskList.push(String(id));
        taskList.push(status);
        taskList.push(text);
        //console.log(taskList);

        document.querySelector("#input-form").reset();
        insertToPage("#planner-list", task);

    } catch (error) {
        console.log("error: Failed to create a new task.");
        console.log(error);
    }
}

function newTaskNode(count, id, status, text) {
    try {
        if ('content' in document.createElement('template')) {
            const template = document.querySelector("#task-template");
        
            const clone = template.content.cloneNode(true);
            const li = clone.querySelector(".task");
            const checkbox = clone.querySelector("input[type = 'checkbox']");
            const label = clone.querySelector(".task-label");
            const li_text = clone.querySelector(".li-text");

            if (status === "1"){
                li.classList.add("complete");
            }
            li.id = count;
            checkbox.id = id;
            label.setAttribute("for", id);
            li_text.textContent = text;

            return clone;
        } else {
          // Find another way to add the rows to the table because 
          // the HTML template element is not supported.
        }
    

    } catch (error) {
        console.log("error: Failed to create a new task node.");
        console.log(error);
    }   
}
