class Student:
    def __init__(self, name, study_hours):
        self.name = name
        self.study_hours = study_hours
        self.subjects = []

    def add_subject(self, subject):
        self.subjects.append(subject)
