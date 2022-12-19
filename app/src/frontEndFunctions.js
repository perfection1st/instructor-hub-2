import { useEffect, useState, useMemo } from "react"



export const StudentsList = () => {
    const [studentsState, setStudentsState] = useState([])
    useEffect(() => {
        fetch(`https://app.asana.com/api/1.0/projects/${sessionStorage.getItem('GID')}/tasks`, {
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('asanaToken')}`
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

// export const weeklyUpdateStudentSubmit = (e) => {

// }
