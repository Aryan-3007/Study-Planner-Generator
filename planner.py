class Planner:
    def __init__(self, student, max_hours_per_subject=3):
        self.student = student
        self.max_hours = max_hours_per_subject

    def generate_plan(self):
        subjects = sorted(
            self.student.subjects,
            key=lambda x: x.priority,
            reverse=True
        )

        total_priority = sum(s.priority for s in subjects)
        timetable = {}
        remaining_hours = self.student.study_hours

        for subject in subjects:
            raw_hours = (subject.priority / total_priority) * self.student.study_hours
            allocated = min(round(raw_hours, 1), self.max_hours)

            timetable[subject.name] = allocated
            remaining_hours -= allocated

        # redistribute remaining hours safely
        i = 0
        while remaining_hours > 0 and i < len(subjects):
            sub = subjects[i].name
            timetable[sub] += 0.5
            remaining_hours -= 0.5
            i = (i + 1) % len(subjects)

        return timetable
