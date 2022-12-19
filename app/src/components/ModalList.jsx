import { useEffect, useState, useMemo } from "react"
import swal from 'sweetalert';

export const ModalList = (props) => {
    const { courses, setCourses } = props

    //Makes a fetch to the users Asana to get student info based on selected course
    const [studentsState, setStudentsState] = useState([])
    let currentClass = sessionStorage.getItem('currentClass')
    let gid = sessionStorage.getItem(currentClass)
    let asanaToken = sessionStorage.getItem('asanaToken')
    useEffect(() => {
        if(!currentClass){
            swal('No course selected')
        } else {
            fetch(`https://app.asana.com/api/1.0/projects/${gid}/tasks`, {
                headers: {
                    Authorization: `Bearer ${asanaToken}`
                }
            })
            .then(result => result.json())
            .then(data => {
                setStudentsState(data.data)})
        }
    }, [])
    return (
        studentsState.map(student => <li key={student.gid}><input type="checkbox" id={student.gid}/> {student.name}</li>)
    )
}