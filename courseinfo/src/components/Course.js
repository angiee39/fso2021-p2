import React from 'react'

const Header = ({ course }) => {
    return (
      <h2>{course.name}</h2>
    )
  }
  
  const Total = ({ course }) => {
    const exercises = course.parts.map((part) => part.exercises)
    const sum = exercises.reduce((total, currentTotal) => total + currentTotal, 0)
    return(
      <p><b>total of {sum} exercises</b></p>
    ) 
  }
  
  const Part = (props) => {
    return (
      <p>
        {props.part.name} {props.part.exercises}
      </p>    
    )
  }
  
  const Content = ({ course }) => {
    return (
      <div>
        {course.parts.map((part, i) => 
          <div key={i}>
            <Part part={part} />
          </div>
        )}
    </div>
    )
  }
  
  const Course = (props) => {
    return (
      <div>
        {props.courses.map((course) =>
          <div key={course.id} >
            <Header course={course} />
            <Content course={course} />
            <Total course={course} />
          </div>
        )}
      </div>   
    )
  }

  export default Course