
document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("taskForm").addEventListener("submit", async function (event) {
        
        event.preventDefault()

        const description = document.getElementById("description").value

        const taskData = {
            description: description,
            isCompleted: false
            
        }
        try {
            
        const response = await fetch("http://localhost:8080/task", 
        
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskData)
        })

        await response.json()

        console.log(response.json)  

        const responseStatus = document.getElementById("responseStatus")

        responseStatus.textContent = "Task created successfully!"

    }catch (error)
    {
        const responseStatus = document.getElementById("responseStatus")

        responseStatus.textContent = "Failed"
    }

    
    })

})