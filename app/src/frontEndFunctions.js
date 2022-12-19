import { useEffect, useState, useMemo } from "react"




export const StudentsList = (props) => {
    const { courses, setCourses } = props
    const [studentsState, setStudentsState] = useState([])
    let currentClass = sessionStorage.getItem('currentClass')
    let gid = sessionStorage.getItem(currentClass)
    let asanaToken = sessionStorage.getItem('asanaToken')
    console.log(gid)
    useEffect(() => {
        fetch(`https://app.asana.com/api/1.0/projects/${gid}/tasks`, {
            headers: {
                Authorization: `Bearer ${asanaToken}`
            }
        })
        .then(result => result.json())
        .then(data => {
            console.log(data)
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
