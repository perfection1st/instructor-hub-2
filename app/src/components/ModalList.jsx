import { useEffect, useState, useMemo } from "react"
import swal from 'sweetalert';

export const ModalList = (props) => {
    /********* This component is only used for weekly update and assessment update **********/

    const { courses, setCourses, setShowAssessmentModal, setShowWeeklyModal, setShowProjectModal, checked, setChecked, selectedStudents, setSelectedStudents } = props

    //Makes a fetch to the users Asana to get student info based on selected course
    const [studentsState, setStudentsState] = useState([])
    let currentClass = sessionStorage.getItem('currentClass')
    let gid = sessionStorage.getItem(currentClass)
    let asanaToken = sessionStorage.getItem('asanaToken')
    useEffect(() => {
        if (!currentClass) {
            //Checks to see if weekly button was clicked
            //If it wasn't then it runs the assessment code
            //Should only be used with weekly update and assessment update

            // NEED A WAY TO CHECK IF CLASS IS SELECTED FOR PROJECT MODAL AND THROW ERROR ACCORDINGLY
            if (checked == "btn-weekly-update") {
                swal('No course selected')
                setShowWeeklyModal(false)
            } else {
                setShowAssessmentModal(false)
                swal('No course selected')
            }
        } else {
            fetch(`https://app.asana.com/api/1.0/projects/${gid}/tasks`, {
                headers: {
                    Authorization: `Bearer ${asanaToken}`
                }
            })
                .then(result => result.json())
                .then(data => {
                    setStudentsState(data.data)
                })
        }
    }, [])
    function clickStudent(e) {
        //Checks to see if box was unclicked
        //Removes student from state used to add changes if so
        if (!e.target.checked) {
            let findKey = e.target.id
            //Filters the selected students to remove the unchecked student
            let deleteObj = selectedStudents.filter(obj => {
                return obj.gid !== findKey
            })
            setSelectedStudents(deleteObj)
            // console.log('index', index)
            // if(index >= 0) selectedStudents.splice(index, 1)

        } else {
            //Checks to see if there is already anything in the state
            //If not it only puts the obj in without spread operator
            if (selectedStudents === []) {
                let obj = {
                    gid: e.target.id,
                    name: e.target.value
                }
                setSelectedStudents(obj)
            } else {
                let obj = {
                    gid: e.target.id,
                    name: e.target.value
                }
                setSelectedStudents([...selectedStudents, obj])
            }
        }
    }
    return (
        <>
            {/* Checks to see if the students are present in selectedStudent state
            if they are it keeps the check in the box even if modal is closed */}
            {studentsState
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((student) => {
                    return (
                        selectedStudents.find((selected) => selected.gid === student.gid) ?
                            <li key={student.gid}>
                                <input
                                    type="checkbox"
                                    value={student.name}
                                    onChange={(e) => clickStudent(e)}
                                    id={student.gid}
                                    checked
                                />
                                {student.name}
                            </li>
                            :
                            <li key={student.gid}>
                                <input
                                    type="checkbox"
                                    value={student.name}
                                    onChange={(e) => clickStudent(e)}
                                    id={student.gid}
                                    checked={false}
                                />
                                {student.name}
                            </li>
                    );
                })}

        </>
    )
}