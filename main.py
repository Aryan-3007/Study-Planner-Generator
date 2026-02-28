from subject import Subject
from student import Student
from planner import Planner

student = Student("Aryan", 6)

student.add_subject(Subject("Maths", "Hard", 2))
student.add_subject(Subject("Physics", "Medium", 5))
student.add_subject(Subject("Chemistry", "Easy", 10))

planner = Planner(student)
plan = planner.generate_plan()

print("Today's Study Plan:")
for sub, hrs in plan.items():
    print(f"{sub}: {hrs} hours")
