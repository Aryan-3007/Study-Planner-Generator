import tkinter as tk
from subject import Subject
from student import Student
from planner import Planner

def generate_plan():
    student = Student("Student", int(hours_entry.get()))

    student.add_subject(Subject(sub1_entry.get(), diff1.get(), int(days1_entry.get())))
    student.add_subject(Subject(sub2_entry.get(), diff2.get(), int(days2_entry.get())))
    student.add_subject(Subject(sub3_entry.get(), diff3.get(), int(days3_entry.get())))

    planner = Planner(student)
    plan = planner.generate_plan()

    result_text.delete("1.0", tk.END)
    for sub, hrs in plan.items():
        result_text.insert(tk.END, f"{sub}: {hrs} hours\n")

# UI Window
root = tk.Tk()
root.title("Smart Study Planner")
root.geometry("400x450")

tk.Label(root, text="Daily Study Hours").pack()
hours_entry = tk.Entry(root)
hours_entry.pack()

# Subject 1
tk.Label(root, text="Subject 1 Name").pack()
sub1_entry = tk.Entry(root)
sub1_entry.pack()
diff1 = tk.StringVar(value="Medium")
tk.OptionMenu(root, diff1, "Easy", "Medium", "Hard").pack()
days1_entry = tk.Entry(root)
days1_entry.pack()

# Subject 2
tk.Label(root, text="Subject 2 Name").pack()
sub2_entry = tk.Entry(root)
sub2_entry.pack()
diff2 = tk.StringVar(value="Medium")
tk.OptionMenu(root, diff2, "Easy", "Medium", "Hard").pack()
days2_entry = tk.Entry(root)
days2_entry.pack()

# Subject 3
tk.Label(root, text="Subject 3 Name").pack()
sub3_entry = tk.Entry(root)
sub3_entry.pack()
diff3 = tk.StringVar(value="Medium")
tk.OptionMenu(root, diff3, "Easy", "Medium", "Hard").pack()
days3_entry = tk.Entry(root)
days3_entry.pack()

tk.Button(root, text="Generate Timetable", command=generate_plan).pack(pady=10)

result_text = tk.Text(root, height=8)
result_text.pack()

root.mainloop()
