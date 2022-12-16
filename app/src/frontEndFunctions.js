import { useEffect, useState, useMemo } from "react"

export const StudentsList = () => {
    const [studentsState, setStudentsState] = useState([])
    useEffect(() => {
        fetch(`https://app.asana.com/api/1.0/projects/1203169000891327/tasks`, {
            headers: {
                Authorization: `Bearer 1/1202887090235848:e50a6b5c7c5a8d420afa41cb62b558d0`
            }
        })
        .then(result => result.json())
        .then(data => {
            setStudentsState(data.data)})
    }, [])
    return (
        studentsState.map(student => <li key={student.gid}><input type="checkbox" id={student.gid}/> {student.name}</li>)
    )
}


//fetch to asana 
// fetch(asanaURL/api/1.0/projects, headers: sessionStorage.getItem('asanaToken')) <== gives all classes/gid associated with user
//store the gids
//Dropdown value of each drop down = data[0].name
//Click the dropdown
//Sends fetch with that projects gid
//fetch(AsanaURL/api/1.0/projects/sessionStorage.getItem(dropDownValue)) <== this will give that group gid
//Map that data 
//Display the tasks as studnes and their scores

// export const weeklyUpdateStudentSubmit = (e) => {

// }
