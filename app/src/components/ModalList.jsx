import { useEffect, useState, useMemo } from "react"

export const ModalList = (props) => {
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