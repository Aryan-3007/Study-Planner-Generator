// ---------- TIME FORMAT ----------
function formatTime(hours){
    if(hours < 1){
        return Math.round(hours * 60) + " min";
    }
    return hours.toFixed(1) + " hr";
}

// ---------- PAGE 1 ----------
function saveUser(){

    const name=document.getElementById("name").value.trim();
    const degree=document.getElementById("degree").value;
    const hours=document.getElementById("hours").value;

    if(!name || !degree || !hours){
        alert("Please fill all details first");
        return;
    }

    localStorage.setItem("name",name);
    localStorage.setItem("degree",degree);
    localStorage.setItem("hours",hours);

    window.location.href="subjects.html";
}

// ---------- PAGE 2 ----------
function addSubject(){

    const box=document.createElement("div");
    box.className="subject-box";

    box.innerHTML=`
        <label>Subject Name</label>
        <input class="sub">

        <label>Remaining Syllabus (%)</label>
        <input type="number" class="syllabus">

        <label>Difficulty</label>
        <select class="difficulty">
            <option value="1">Easy</option>
            <option value="1.5">Medium</option>
            <option value="2">Hard</option>
        </select>

        <label>Exam in Days</label>
        <input type="number" class="days">
    `;

    document.getElementById("subjects-container").appendChild(box);
}

function generatePlan(){

    const subjects=document.querySelectorAll(".subject-box");
    const totalHours=parseFloat(localStorage.getItem("hours"));

    let plans=[];
    let tomorrow=null;

    subjects.forEach(s=>{

        let name=s.querySelector(".sub").value;
        let syl=parseFloat(s.querySelector(".syllabus").value);
        let diff=parseFloat(s.querySelector(".difficulty").value);
        let days=parseInt(s.querySelector(".days").value);

        if(!name) return;

        if(days===1){
            tomorrow={name};
        }else{
            let priority=(syl*diff)/days;

            plans.push({
                name,
                syl,
                diff,
                days,
                priority
            });
        }
    });

    if(tomorrow){
        let study=totalHours*0.7;
        let revision=totalHours*0.3;

        localStorage.setItem("plans",JSON.stringify([{
            name:tomorrow.name,
            study:study,
            revision:revision,
            reason:"tomorrow"
        }]));

        window.location.href="result.html";
        return;
    }

    let totalPriority=plans.reduce((a,b)=>a+b.priority,0);

    plans.forEach(p=>{
        let allocated=(p.priority/totalPriority)*totalHours;
        p.study=allocated*0.75;
        p.revision=allocated*0.25;
    });

    plans.sort((a,b)=>a.days-b.days);

    localStorage.setItem("plans",JSON.stringify(plans));
    window.location.href="result.html";
    document.getElementById("output").innerHTML += runAIAnalysis(subjects, hoursPerDay);
    document.getElementById("output").innerHTML += advancedAI(subjects, hoursPerDay);

}

// ---------- PAGE 3 ----------
if(window.location.pathname.includes("result.html")){

    const plans=JSON.parse(localStorage.getItem("plans"));
    const name=localStorage.getItem("name");

    document.getElementById("welcome").innerHTML=
        `<h3>${name}, this is your personalized study plan</h3>`;

    const table=document.getElementById("timetable");
    const reason=document.getElementById("reason");

    table.innerHTML="";
    reason.innerHTML="";

    plans.forEach(p=>{

        let card=document.createElement("div");
        card.className="result-card";

        card.innerHTML=`<b>${p.name}</b><br>
        Study: ${formatTime(p.study)}<br>
        Revision: ${formatTime(p.revision)}`;

        table.appendChild(card);

        let explain=document.createElement("div");
        explain.className="summary-card";

        if(p.reason==="tomorrow"){
            explain.innerHTML=
            `Since this exam is tomorrow, the entire day is dedicated to this subject.
            The plan focuses on final preparation and structured revision to maximise retention and confidence.`;
        }
        else{
            let difficultyText =
                p.diff==1 ? "easy to finish"
              : p.diff==1.5 ? "moderately challenging"
              : "conceptually demanding";

            let urgencyText =
                p.days<=2 ? "very near"
              : p.days<=4 ? "approaching soon"
              : "not immediate";

            explain.innerHTML=
            `${p.name} is prioritised because the exam is ${urgencyText}.
            The remaining ${p.syl}% syllabus is ${difficultyText}, so balanced time is assigned for both completion and reinforcement.
            This ensures steady progress without last-minute stress.`;
        }

        reason.appendChild(explain);
    });

    let note=document.createElement("div");
    note.className="summary-card";
    note.innerHTML=
    `<b>Preparation Principle:</b><br>
    The day before any exam is reserved exclusively for that subject.
    New topics are avoided and full revision is encouraged to strengthen recall and exam readiness.`;

    reason.appendChild(note);
}

// ================= AI ANALYSIS ENGINE =================

function runAIAnalysis(subjects, hoursPerDay){

    if(!subjects || subjects.length===0) return "";

    let message = "";
    let urgent = subjects.filter(s=>s.days<=2);
    let hard = subjects.filter(s=>s.diff==="hard");
    let overload = subjects.reduce((t,s)=>t+s.syllabus,0)/subjects.length > 60;

    message += `<div class="planCard"><h3>AI Study Mentor Advice</h3>`;

    // Urgency detection
    if(urgent.length>0){
        message += `<p>Some exams are very close (${urgent.map(s=>s.name).join(", ")}). 
        Focus on revision and avoid starting completely new chapters now.</p>`;
    }else{
        message += `<p>You have enough preparation window. Use active recall instead of passive reading.</p>`;
    }

    // Hard subject strategy
    if(hard.length>0){
        message += `<p>Subjects like ${hard.map(s=>s.name).join(", ")} need deep focus sessions in morning when concentration is highest.</p>`;
    }

    // Overload detection
    if(overload){
        message += `<p>Your syllabus load is heavy. Study in 50-10 focus cycles to prevent burnout.</p>`;
    }else{
        message += `<p>Your workload is manageable. Consistency will give better results than long sessions.</p>`;
    }

    // Day before exam rule
    message += `<p><b>Important:</b> One day before exam, revise only that subject fully and pause others.</p>`;

    // Motivation
    message += `<p>Following this schedule daily will maximise retention and reduce last-day stress.</p>`;

    message += `</div>`;

    return message;
}

function advancedAI(subjects, hoursPerDay){

    let html = `<div class="planCard"><h3>Advanced AI Insights</h3>`;

    subjects.forEach(s => {

        let weight = s.diff==="hard"?1.5:s.diff==="medium"?1.2:1;
        let risk = (s.syllabus * weight) / (s.days * hoursPerDay);

        if(risk > 1){
            html += `<p>⚠ <b>${s.name}</b> is high risk. Increase study intensity to avoid incomplete syllabus.</p>`;
        }else if(risk > 0.6){
            html += `<p>${s.name} is moderate pressure. Stay consistent.</p>`;
        }else{
            html += `<p>${s.name} is under control. Maintain revision discipline.</p>`;
        }

    });

    // burnout check
    let totalLoad = subjects.reduce((t,s)=>t+s.syllabus,0);

    if(totalLoad/subjects.length > 70){
        html += `<p>⚠ Cognitive load is high. Use 50-10 study cycles to prevent burnout.</p>`;
    }

    html += `<p>🧠 Study Hard subjects in morning, medium in afternoon, easy in evening for optimal brain performance.</p>`;

    html += `</div>`;

    return html;
}
