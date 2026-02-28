class Subject:
    def __init__(self, name, difficulty, days_left):
        self.name = name
        self.difficulty = difficulty
        self.days_left = days_left
        self.priority = self.calculate_priority()

    def calculate_priority(self):
        diff_weight = {"Easy": 1, "Medium": 2, "Hard": 3}
        urgency = 3 if self.days_left <= 3 else 2 if self.days_left <= 7 else 1
        return diff_weight[self.difficulty] + urgency
