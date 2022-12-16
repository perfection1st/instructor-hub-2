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

// export const weeklyUpdateStudentSubmit = (e) => {

// }
