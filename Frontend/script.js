
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("taskForm").addEventListener("submit", async function (event) {
        
        event.preventDefault()

        const description = document.getElementById("description").value

        const taskData = {
            description: description,
            isCompleted: false
            
        }

        const response = await fetch("http://localhost:8080/tasks", 
            
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskData)
        })

        await response.json()

        console.log(response.json)    


        
        
    })

})