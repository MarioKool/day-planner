
// dd_month_yyyy
// works as a key for the day
const listKey = generateKey();
// [id, completion status, task text, ...]
let taskList = [];


try {
    insertToPage("#day", getDayOfWeek(new Date()));
    insertToPage("#date", getDate(new Date()));
} catch (error) {
    console.log("error: Failed to retrieve date, day.");
    console.log(error);
}


try {
    taskList = parseListData(getFromLocalStorage(listKey));
} catch (error) {
    console.log("error: Failed to retrieve task list.");
    console.log(error);
}

for (let i = 0, n = taskList.length; i < n; i += 3) {
    task = newTaskNode(i, taskList[i], taskList[i+1], taskList[i+2]);
    insertToPage("#planner-list", task);
}


try {
    document.querySelector("#planner-list").addEventListener("click", listEventHandler);
    document.querySelector("#insert-btn").addEventListener("click", newTask);
    window.addEventListener("beforeunload", pageUnloadHandler);
} catch (error) {
    console.log("error: Failed to add event listeners.");
    console.log(error);
}

